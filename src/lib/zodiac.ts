import aries from "@/assets/zodiac-aries.png.asset.json";
import taurus from "@/assets/zodiac-taurus.png.asset.json";
import gemini from "@/assets/zodiac-gemini.png.asset.json";
import cancer from "@/assets/zodiac-cancer.png.asset.json";
import leo from "@/assets/zodiac-leo.png.asset.json";
import virgo from "@/assets/zodiac-virgo.png.asset.json";
import libra from "@/assets/zodiac-libra.png.asset.json";
import scorpio from "@/assets/zodiac-scorpio.png.asset.json";
import sagittarius from "@/assets/zodiac-sagittarius.png.asset.json";
import capricorn from "@/assets/zodiac-capricorn.png.asset.json";
import pisces from "@/assets/zodiac-pisces.png.asset.json";

export const ZODIAC_SIGNS = [
  { en: "Aries", hi: "मेष" },
  { en: "Taurus", hi: "वृषभ" },
  { en: "Gemini", hi: "मिथुन" },
  { en: "Cancer", hi: "कर्क" },
  { en: "Leo", hi: "सिंह" },
  { en: "Virgo", hi: "कन्या" },
  { en: "Libra", hi: "तुला" },
  { en: "Scorpio", hi: "वृश्चिक" },
  { en: "Sagittarius", hi: "धनु" },
  { en: "Capricorn", hi: "मकर" },
  { en: "Aquarius", hi: "कुंभ" },
  { en: "Pisces", hi: "मीन" },
] as const;

export type ZodiacItem = {
  sign: string;
  hindi: string;
  image: string;
  /** Actual price — null until supplied by the store owner. */
  price: number | null;
  /** Actual stock — null until supplied. */
  inventory: number | null;
  slug: string;
  colours: string;
  shortDescription: string;
  description: string;
};

// Only signs with an uploaded photograph are listed.
export const zodiacItems: ZodiacItem[] = [
  { sign: "Aries", hindi: "मेष", image: aries.url, price: 999, inventory: 30, slug: "aries-zodiac-bracelet", colours: "clear white, light green, deep green and one reddish-brown bead", shortDescription: "Handcrafted Aries zodiac bracelet with clear white, light green, deep green and one reddish-brown bead, shown on a gold stand.", description: "A handcrafted Aries (मेष) zodiac bracelet, made with natural stone beads in clear white, light green, deep green and one reddish-brown bead. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Taurus", hindi: "वृषभ", image: taurus.url, price: 999, inventory: 30, slug: "taurus-zodiac-bracelet", colours: "soft pink, royal blue and pink-brown mottled beads", shortDescription: "Handcrafted Taurus zodiac bracelet with soft pink, royal blue and pink-brown mottled beads, shown on a gold stand.", description: "A handcrafted Taurus (वृषभ) zodiac bracelet, made with natural stone beads in soft pink, royal blue and pink-brown mottled beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Gemini", hindi: "मिथुन", image: gemini.url, price: 999, inventory: 30, slug: "gemini-zodiac-bracelet", colours: "pink, sky blue and bright yellow beads", shortDescription: "Handcrafted Gemini zodiac bracelet with pink, sky blue and bright yellow beads, shown on a gold stand.", description: "A handcrafted Gemini (मिथुन) zodiac bracelet, made with natural stone beads in pink, sky blue and bright yellow beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Cancer", hindi: "कर्क", image: cancer.url, price: 999, inventory: 30, slug: "cancer-zodiac-bracelet", colours: "light pink, orange-red, speckled green and purple-green beads", shortDescription: "Handcrafted Cancer zodiac bracelet with light pink, orange-red, speckled green and purple-green beads, shown on a gold stand.", description: "A handcrafted Cancer (कर्क) zodiac bracelet, made with natural stone beads in light pink, orange-red, speckled green and purple-green beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Leo", hindi: "सिंह", image: leo.url, price: 999, inventory: 30, slug: "leo-zodiac-bracelet", colours: "red, black, clear speckled and cream beads", shortDescription: "Handcrafted Leo zodiac bracelet with red, black, clear speckled and cream beads, shown on a gold stand.", description: "A handcrafted Leo (सिंह) zodiac bracelet, made with natural stone beads in red, black, clear speckled and cream beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Virgo", hindi: "कन्या", image: virgo.url, price: 999, inventory: 30, slug: "virgo-zodiac-bracelet", colours: "orange-red, dark brown, olive green and yellow beads", shortDescription: "Handcrafted Virgo zodiac bracelet with orange-red, dark brown, olive green and yellow beads, shown on a gold stand.", description: "A handcrafted Virgo (कन्या) zodiac bracelet, made with natural stone beads in orange-red, dark brown, olive green and yellow beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Libra", hindi: "तुला", image: libra.url, price: 999, inventory: 30, slug: "libra-zodiac-bracelet", colours: "pink, olive-yellow and smoky black-grey beads", shortDescription: "Handcrafted Libra zodiac bracelet with pink, olive-yellow and smoky black-grey beads, shown on a gold stand.", description: "A handcrafted Libra (तुला) zodiac bracelet, made with natural stone beads in pink, olive-yellow and smoky black-grey beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Scorpio", hindi: "वृश्चिक", image: scorpio.url, price: 999, inventory: 30, slug: "scorpio-zodiac-bracelet", colours: "turquoise blue, smoky brown and grey-green shimmer beads", shortDescription: "Handcrafted Scorpio zodiac bracelet with turquoise blue, smoky brown and grey-green shimmer beads, shown on a gold stand.", description: "A handcrafted Scorpio (वृश्चिक) zodiac bracelet, made with natural stone beads in turquoise blue, smoky brown and grey-green shimmer beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Sagittarius", hindi: "धनु", image: sagittarius.url, price: 999, inventory: 30, slug: "sagittarius-zodiac-bracelet", colours: "yellow, blue-grey, orange-cream and gold faceted beads", shortDescription: "Handcrafted Sagittarius zodiac bracelet with yellow, blue-grey, orange-cream and gold faceted beads, shown on a gold stand.", description: "A handcrafted Sagittarius (धनु) zodiac bracelet, made with natural stone beads in yellow, blue-grey, orange-cream and gold faceted beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Capricorn", hindi: "मकर", image: capricorn.url, price: 999, inventory: 30, slug: "capricorn-zodiac-bracelet", colours: "teal blue, deep green, purple and smoky brown beads", shortDescription: "Handcrafted Capricorn zodiac bracelet with teal blue, deep green, purple and smoky brown beads, shown on a gold stand.", description: "A handcrafted Capricorn (मकर) zodiac bracelet, made with natural stone beads in teal blue, deep green, purple and smoky brown beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
  { sign: "Pisces", hindi: "मीन", image: pisces.url, price: 999, inventory: 30, slug: "pisces-zodiac-bracelet", colours: "purple, pale green, cream and blue-white speckled beads", shortDescription: "Handcrafted Pisces zodiac bracelet with purple, pale green, cream and blue-white speckled beads, shown on a gold stand.", description: "A handcrafted Pisces (मीन) zodiac bracelet, made with natural stone beads in purple, pale green, cream and blue-white speckled beads. Elastic stretch fit. A thoughtful gift for birthdays, festivals and special occasions. Natural stones vary slightly in colour and pattern, so every bracelet is one of a kind." },
];

export const zodiacTitle = (z: ZodiacItem) => `${z.sign} Crystal Bracelet • ${z.hindi}`;
