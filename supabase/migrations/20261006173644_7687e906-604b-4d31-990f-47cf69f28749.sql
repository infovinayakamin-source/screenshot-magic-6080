create table public.zodiac_signs (
  id smallint primary key,
  name_en text not null unique,
  name_hi text not null,
  symbol text not null,
  slug text not null unique
);
grant select on public.zodiac_signs to anon, authenticated;
grant all on public.zodiac_signs to service_role;
alter table public.zodiac_signs enable row level security;
create policy "Anyone can read zodiac signs" on public.zodiac_signs for select to anon, authenticated using (true);
insert into public.zodiac_signs values
(1,'Aries','मेष','♈','aries'),(2,'Taurus','वृषभ','♉','taurus'),(3,'Gemini','मिथुन','♊','gemini'),
(4,'Cancer','कर्क','♋','cancer'),(5,'Leo','सिंह','♌','leo'),(6,'Virgo','कन्या','♍','virgo'),
(7,'Libra','तुला','♎','libra'),(8,'Scorpio','वृश्चिक','♏','scorpio'),(9,'Sagittarius','धनु','♐','sagittarius'),
(10,'Capricorn','मकर','♑','capricorn'),(11,'Aquarius','कुंभ','♒','aquarius'),(12,'Pisces','मीन','♓','pisces');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hi text,
  zodiac_sign_id smallint not null references public.zodiac_signs(id),
  slug text not null unique,
  sku text not null unique,
  stones text,
  short_description text,
  description text,
  product_info text,
  original_price integer,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  low_stock_threshold integer not null default 3,
  status text not null default 'draft' check (status in ('draft','active','inactive','archived')),
  featured boolean not null default false,
  apply_branding boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Public can read active products" on public.products for select to anon, authenticated using (status = 'active');

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  original_image_url text not null,
  branded_image_url text,
  branding_error text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.product_images(product_id);
grant select on public.product_images to anon, authenticated;
grant all on public.product_images to service_role;
alter table public.product_images enable row level security;
create policy "Public can read images of active products" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active'));

create table public.inventory_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  change integer not null,
  stock_after integer not null,
  reason text not null,
  actor uuid,
  created_at timestamptz not null default now()
);
create index on public.inventory_history(product_id, created_at desc);
grant all on public.inventory_history to service_role;
alter table public.inventory_history enable row level security;

create table public.product_branding_settings (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default true,
  logo_url text,
  position text not null default 'bottom-right' check (position in ('top-left','top-right','bottom-left','bottom-right')),
  size text not null default 'small' check (size in ('small','medium')),
  opacity numeric not null default 0.95 check (opacity between 0.1 and 1),
  padding integer not null default 4 check (padding between 0 and 20),
  updated_at timestamptz not null default now()
);
grant select on public.product_branding_settings to anon, authenticated;
grant all on public.product_branding_settings to service_role;
alter table public.product_branding_settings enable row level security;
create policy "Anyone can read branding settings" on public.product_branding_settings for select to anon, authenticated using (true);
insert into public.product_branding_settings (id) values (1);

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create or replace function public.consume_stock(_items jsonb, _reason text) returns void
language plpgsql security definer set search_path = public as $$
declare it jsonb; left_ integer;
begin
  for it in select * from jsonb_array_elements(_items) loop
    update public.products set stock = stock - (it->>'qty')::int
      where id = (it->>'id')::uuid and stock >= (it->>'qty')::int
      returning stock into left_;
    if not found then raise exception 'insufficient_stock'; end if;
    insert into public.inventory_history(product_id, change, stock_after, reason)
      values ((it->>'id')::uuid, -(it->>'qty')::int, left_, _reason);
  end loop;
end $$;
revoke execute on function public.consume_stock(jsonb, text) from public, anon, authenticated;
grant execute on function public.consume_stock(jsonb, text) to service_role;

insert into public.products (name, name_hi, zodiac_sign_id, slug, sku, stones, short_description, description, price, stock, status) values
('Aries Crystal Bracelet','मेष क्रिस्टल ब्रेसलेट',1,'aries-zodiac-bracelet','SH-ARI-001','Natural stone beads — clear white, light green, deep green and one reddish-brown bead','Handcrafted Aries zodiac bracelet with clear white, light green, deep green and one reddish-brown bead, shown on a gold stand.','A handcrafted Aries (मेष) zodiac bracelet, made with natural stone beads in clear white, light green, deep green and one reddish-brown bead. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Taurus Crystal Bracelet','वृषभ क्रिस्टल ब्रेसलेट',2,'taurus-zodiac-bracelet','SH-TAU-001','Natural stone beads — soft pink, royal blue and pink-brown mottled beads','Handcrafted Taurus zodiac bracelet with soft pink, royal blue and pink-brown mottled beads, shown on a gold stand.','A handcrafted Taurus (वृषभ) zodiac bracelet, made with natural stone beads in soft pink, royal blue and pink-brown mottled beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Gemini Crystal Bracelet','मिथुन क्रिस्टल ब्रेसलेट',3,'gemini-zodiac-bracelet','SH-GEM-001','Natural stone beads — pink, sky blue and bright yellow beads','Handcrafted Gemini zodiac bracelet with pink, sky blue and bright yellow beads, shown on a gold stand.','A handcrafted Gemini (मिथुन) zodiac bracelet, made with natural stone beads in pink, sky blue and bright yellow beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Cancer Crystal Bracelet','कर्क क्रिस्टल ब्रेसलेट',4,'cancer-zodiac-bracelet','SH-CAN-001','Natural stone beads — light pink, orange-red, speckled green and purple-green beads','Handcrafted Cancer zodiac bracelet with light pink, orange-red, speckled green and purple-green beads, shown on a gold stand.','A handcrafted Cancer (कर्क) zodiac bracelet, made with natural stone beads in light pink, orange-red, speckled green and purple-green beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Leo Crystal Bracelet','सिंह क्रिस्टल ब्रेसलेट',5,'leo-zodiac-bracelet','SH-LEO-001','Natural stone beads — red, black, clear speckled and cream beads','Handcrafted Leo zodiac bracelet with red, black, clear speckled and cream beads, shown on a gold stand.','A handcrafted Leo (सिंह) zodiac bracelet, made with natural stone beads in red, black, clear speckled and cream beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Virgo Crystal Bracelet','कन्या क्रिस्टल ब्रेसलेट',6,'virgo-zodiac-bracelet','SH-VIR-001','Natural stone beads — orange-red, dark brown, olive green and yellow beads','Handcrafted Virgo zodiac bracelet with orange-red, dark brown, olive green and yellow beads, shown on a gold stand.','A handcrafted Virgo (कन्या) zodiac bracelet, made with natural stone beads in orange-red, dark brown, olive green and yellow beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Libra Crystal Bracelet','तुला क्रिस्टल ब्रेसलेट',7,'libra-zodiac-bracelet','SH-LIB-001','Natural stone beads — pink, olive-yellow and smoky black-grey beads','Handcrafted Libra zodiac bracelet with pink, olive-yellow and smoky black-grey beads, shown on a gold stand.','A handcrafted Libra (तुला) zodiac bracelet, made with natural stone beads in pink, olive-yellow and smoky black-grey beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Scorpio Crystal Bracelet','वृश्चिक क्रिस्टल ब्रेसलेट',8,'scorpio-zodiac-bracelet','SH-SCO-001','Natural stone beads — turquoise blue, smoky brown and grey-green shimmer beads','Handcrafted Scorpio zodiac bracelet with turquoise blue, smoky brown and grey-green shimmer beads, shown on a gold stand.','A handcrafted Scorpio (वृश्चिक) zodiac bracelet, made with natural stone beads in turquoise blue, smoky brown and grey-green shimmer beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Sagittarius Crystal Bracelet','धनु क्रिस्टल ब्रेसलेट',9,'sagittarius-zodiac-bracelet','SH-SAG-001','Natural stone beads — yellow, blue-grey, orange-cream and gold faceted beads','Handcrafted Sagittarius zodiac bracelet with yellow, blue-grey, orange-cream and gold faceted beads, shown on a gold stand.','A handcrafted Sagittarius (धनु) zodiac bracelet, made with natural stone beads in yellow, blue-grey, orange-cream and gold faceted beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Capricorn Crystal Bracelet','मकर क्रिस्टल ब्रेसलेट',10,'capricorn-zodiac-bracelet','SH-CAP-001','Natural stone beads — teal blue, deep green, purple and smoky brown beads','Handcrafted Capricorn zodiac bracelet with teal blue, deep green, purple and smoky brown beads, shown on a gold stand.','A handcrafted Capricorn (मकर) zodiac bracelet, made with natural stone beads in teal blue, deep green, purple and smoky brown beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active'),
('Pisces Crystal Bracelet','मीन क्रिस्टल ब्रेसलेट',12,'pisces-zodiac-bracelet','SH-PIS-001','Natural stone beads — purple, pale green, cream and blue-white speckled beads','Handcrafted Pisces zodiac bracelet with purple, pale green, cream and blue-white speckled beads, shown on a gold stand.','A handcrafted Pisces (मीन) zodiac bracelet, made with natural stone beads in purple, pale green, cream and blue-white speckled beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind.',999,30,'active');

insert into public.product_images (product_id, original_image_url, is_primary)
select p.id, v.url, true from (values
('aries-zodiac-bracelet','/__l5e/assets-v1/9ef36970-6c2d-456b-b077-fb56a01f3a5a/zodiac-aries.png'),
('taurus-zodiac-bracelet','/__l5e/assets-v1/aafa5268-8ac8-405b-a56d-a7e865695fcd/zodiac-taurus.png'),
('gemini-zodiac-bracelet','/__l5e/assets-v1/8b356779-e3f1-41a6-9537-304f435ca2e2/zodiac-gemini.png'),
('cancer-zodiac-bracelet','/__l5e/assets-v1/49a41bff-e32a-46c1-a7d9-fd7ec1c95a61/zodiac-cancer.png'),
('leo-zodiac-bracelet','/__l5e/assets-v1/4ca3c97c-f463-40b7-978d-cacadb55b0c5/zodiac-leo.png'),
('virgo-zodiac-bracelet','/__l5e/assets-v1/6499a42f-e1bd-41a7-8d74-b576d8992659/zodiac-virgo.png'),
('libra-zodiac-bracelet','/__l5e/assets-v1/b27fabbb-fdfa-4f44-b788-303331520a95/zodiac-libra.png'),
('scorpio-zodiac-bracelet','/__l5e/assets-v1/cea6fcbd-8e64-4b4b-960f-6c1b40eba9ae/zodiac-scorpio.png'),
('sagittarius-zodiac-bracelet','/__l5e/assets-v1/02e8f61f-d279-49b9-8610-406b69b1dc5f/zodiac-sagittarius.png'),
('capricorn-zodiac-bracelet','/__l5e/assets-v1/d2666bf7-ba28-463b-980e-c6e11285dc49/zodiac-capricorn.png'),
('pisces-zodiac-bracelet','/__l5e/assets-v1/34204175-6c09-4441-8e70-83b9de65908b/zodiac-pisces.png')) v(slug,url) join public.products p on p.slug=v.slug;