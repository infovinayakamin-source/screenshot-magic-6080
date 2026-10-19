import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, Search, Heart, ShoppingBag, UserRound, X, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import { BRAND, formatINR, useProducts } from '@/lib/products';
import { useStore } from '@/lib/store';
import { storefrontContent } from '@/lib/storefront-content';
const nav = [
  { label: 'Home', to: '/' as const },
  { label: 'Zodiac Bracelets', to: '/collections/zodiac-crystal-collection' as const },
  { label: 'Shop All', to: '/shop' as const },
  { label: 'About Us', to: '/about' as const },
  { label: 'Contact', to: '/contact' as const },
  { label: 'FAQ', to: '/faq' as const },
];
export function Header() {
  const { count, setCartOpen, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const products = useProducts();
  const term = query.trim().toLowerCase();
  const results = (term ? products.filter(p => [p.name, p.nameHi, p.sign, p.signHi, p.stones].join(' ').toLowerCase().includes(term)) : products).slice(0, 8);
  return <>
    <div className="reference-announcement">{storefrontContent.announcement}</div>
    <header className="reference-header">
      <div className="shell reference-header-inner">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu" className="mobile-menu-button"><Menu /></Button></SheetTrigger>
          <SheetContent side="left"><SheetTitle>{BRAND}</SheetTitle><p className="mt-2 text-xs">{storefrontContent.tagline}</p><nav className="mt-6 flex flex-col">{nav.map(item => <div key={item.label} className="flex flex-col"><Link to={item.to} onClick={() => setMenuOpen(false)} className="border-b border-border py-4 text-sm">{item.label}</Link>{item.to === '/shop' && <Link to="/collections/salt" onClick={() => setMenuOpen(false)} className="border-b border-border py-3 pl-4 text-sm text-muted-foreground">Salt</Link>}</div>)}</nav></SheetContent>
        </Sheet>
        <Link to="/" aria-label={`${BRAND} home`} className="reference-brand"><img src={logo} alt={`${BRAND} original logo`} width={512} height={512} /><span><strong>{BRAND}</strong><small>{storefrontContent.tagline}</small></span></Link>
        <nav className="reference-desktop-nav" aria-label="Main navigation">{nav.map(item => item.to === '/shop' ? <DropdownMenu key={item.label}><DropdownMenuTrigger className="inline-flex items-center gap-1">{item.label}<ChevronDown className="size-3" /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem asChild><Link to="/shop">Shop All</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/collections/salt">Salt</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <Link key={item.label} to={item.to} activeOptions={{ exact: true }} activeProps={{ className: 'reference-active' }}>{item.label}</Link>)}</nav>
        <div className="reference-header-tools">
          <Button variant="ghost" className="reference-search" aria-label="Search products" onClick={() => setSearchOpen(true)}><Search /><span>Search crystals...</span></Button>
          <Button variant="ghost" size="icon" className="mobile-search-button" aria-label="Search products" onClick={() => setSearchOpen(true)}><Search /></Button>
          <Link to="/auth" className="reference-account" aria-label="Account"><UserRound /></Link>
          <Link to="/shop" search={{ wishlist: true }} className="reference-wishlist" aria-label="Wishlist"><Heart />{wishlist.length > 0 && <span>{wishlist.length}</span>}</Link>
          <Button variant="ghost" size="icon" aria-label="Open cart" className="reference-cart" onClick={() => setCartOpen(true)}><ShoppingBag /><span>{count}</span></Button>
        </div>
      </div>
    </header>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent className="max-w-xl"><DialogTitle>Search ShivAmrit Healers</DialogTitle><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><Input aria-label="Search jewellery" placeholder="Search by zodiac sign, stone or bracelet" maxLength={100} value={query} onChange={event => setQuery(event.target.value)} />{query && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQuery('')}><X /></Button>}</div><p className="text-xs text-muted-foreground" aria-live="polite">{results.length ? `${results.length} matching pieces` : 'No pieces match that search.'}</p><ul className="max-h-96 overflow-y-auto">{results.map(p => <li key={p.id}><Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => { setSearchOpen(false); setQuery(''); }} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3"><img src={p.images[0]} alt={p.name} width={56} height={56} className="size-14 object-cover" /><span className="min-w-0 text-sm">{p.name}<small className="block text-muted-foreground">{p.signHi}</small></span><span className="text-sm">{formatINR(p.price)}</span></Link></li>)}</ul></DialogContent></Dialog>
  </>;
}
