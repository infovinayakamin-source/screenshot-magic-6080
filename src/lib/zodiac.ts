import aries from "@/assets/zodiac-aries.png.asset.json";
import leo from "@/assets/zodiac-leo.png.asset.json";
import virgo from "@/assets/zodiac-virgo.png.asset.json";
import libra from "@/assets/zodiac-libra.png.asset.json";
import scorpio from "@/assets/zodiac-scorpio.png.asset.json";
import capricorn from "@/assets/zodiac-capricorn.png.asset.json";

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
};

// Only signs with an uploaded photograph are listed.
export const zodiacItems: ZodiacItem[] = [
  { sign: "Aries", hindi: "मेष", image: aries.url, price: null, inventory: null },
  { sign: "Leo", hindi: "सिंह", image: leo.url, price: null, inventory: null },
  { sign: "Virgo", hindi: "कन्या", image: virgo.url, price: null, inventory: null },
  { sign: "Libra", hindi: "तुला", image: libra.url, price: null, inventory: null },
  { sign: "Scorpio", hindi: "वृश्चिक", image: scorpio.url, price: null, inventory: null },
  { sign: "Capricorn", hindi: "मकर", image: capricorn.url, price: null, inventory: null },
];

export const zodiacTitle = (z: ZodiacItem) => `${z.sign} Crystal Bracelet • ${z.hindi}`;
