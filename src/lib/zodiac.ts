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
};

// Only signs with an uploaded photograph are listed.
export const zodiacItems: ZodiacItem[] = [
  { sign: "Aries", hindi: "मेष", image: aries.url, price: null, inventory: null },
  { sign: "Taurus", hindi: "वृषभ", image: taurus.url, price: null, inventory: null },
  { sign: "Gemini", hindi: "मिथुन", image: gemini.url, price: null, inventory: null },
  { sign: "Cancer", hindi: "कर्क", image: cancer.url, price: null, inventory: null },
  { sign: "Leo", hindi: "सिंह", image: leo.url, price: null, inventory: null },
  { sign: "Virgo", hindi: "कन्या", image: virgo.url, price: null, inventory: null },
  { sign: "Libra", hindi: "तुला", image: libra.url, price: null, inventory: null },
  { sign: "Scorpio", hindi: "वृश्चिक", image: scorpio.url, price: null, inventory: null },
  { sign: "Sagittarius", hindi: "धनु", image: sagittarius.url, price: null, inventory: null },
  { sign: "Capricorn", hindi: "मकर", image: capricorn.url, price: null, inventory: null },
  { sign: "Pisces", hindi: "मीन", image: pisces.url, price: null, inventory: null },
];

export const zodiacTitle = (z: ZodiacItem) => `${z.sign} Crystal Bracelet • ${z.hindi}`;
