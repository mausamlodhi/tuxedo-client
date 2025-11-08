import { TOKEN_KEY } from "./env";
import CryptoJS from "crypto-js";
import logger from "./logger";
import { updateAllLayers } from "@/hooks/useLayers";

export const removeSessionStorageToken = () => {
  if (sessionStorage.getItem(`${TOKEN_KEY}:token`)) {
    sessionStorage.setItem(`${TOKEN_KEY}:token`, '');
  }
};

export const getLocalStorageToken = () => {
  const token = localStorage.getItem(`${TOKEN_KEY}:token`);
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, `${TOKEN_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};

export const setLocalStorageToken = (token: string) => {
  if (!token) return;
  const encrypted = CryptoJS.AES.encrypt(token, `${TOKEN_KEY}-token`).toString();
  localStorage.setItem(`${TOKEN_KEY}:token`, encrypted);
};

export const removeLocalStorageToken = () => {
  if (localStorage.getItem(`${TOKEN_KEY}:token`)) {
    localStorage.setItem(`${TOKEN_KEY}:token`, '');
  }
};

export const getRefreshToken = () => {
  const token = localStorage.getItem(`${TOKEN_KEY}:refresh-token`);
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, `${TOKEN_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};

const colorMap: Record<string, string> = {
  "White/Off-White": "#FFFFFF",
  Black: "#000000",
  Grey: "#808080",
  LightGrey: "#D3D3D3",
  DarkGrey: "#A9A9A9",

  Red: "#FF0000",
  DarkRed: "#8B0000",
  Burgundy: "#800020",
  Maroon: "#800000",

  Pink: "#FFC0CB",
  HotPink: "#FF69B4",
  DeepPink: "#FF1493",

  Orange: "#FFA500",
  DarkOrange: "#FF8C00",
  Coral: "#FF7F50",

  Yellow: "#FFFF00",
  Gold: "#FFD700",
  Khaki: "#F0E68C",

  Green: "#008000",
  DarkGreen: "#006400",
  LightGreen: "#90EE90",
  Lime: "#00FF00",
  Olive: "#808000",

  Blue: "#0000FF",
  LightBlue: "#ADD8E6",
  SkyBlue: "#87CEEB",
  SteelBlue: "#4682B4",
  Navy: "#000080",
  Teal: "#008080",

  Purple: "#800080",
  Indigo: "#4B0082",
  Violet: "#EE82EE",
  Lavender: "#E6E6FA",

  Brown: "#8B4513",
  "Tan/Brown": "#D2B48C",
  Tan: "#D2B48C",
  Beige: "#F5F5DC",
  Chocolate: "#D2691E",

  Cyan: "#00FFFF",
  Aqua: "#00FFFF",
  Turquoise: "#40E0D0",

  Magenta: "#FF00FF",
  Fuchsia: "#FF00FF",
};


export function getColorCode(name: string): string | undefined {
  return colorMap[name] || undefined;
}

export const getDynamicQuery = (
  collectionType: string,
  color: string,
  texture: string,
  textureColors1: string,
  textureColors2: string,
  bgColor: string
) => {
  return `Change its image color to the ${color} and texture should be ${texture} (${textureColors1 || ""}, ${textureColors2 || ""}) with the solid ${bgColor} background and no shadow effects and don't add it's color code`;
}

export const getCommonQuery = (collectionType: string, color: string, bgColor: string) => {
  return `Change its image color to the ${color} with the solid ${bgColor} background and no shadow effect and don't add it's color code.`;
}

export const pocketSquareSummary = (color: string, bgColor: string) => {
  return `change its image color to the ${color} and make the background ${bgColor} solid and done don't add it's color code`
}


export const areLayersEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false;

  return a.every((obj, i) => {
    const other = b[i];
    return (
      Object.keys(obj).length === Object.keys(other).length &&
      Object.keys(obj).every((key) => obj[key] === other[key])
    );
  });
}

export const flattenLayers = (obj: Record<string, any[]>): any[] => {
  return Object.values(obj)
    .flat()
    .filter((item) => item !== undefined && item !== null);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export const getLayerData = async (data) => {
  let layers = [];
  const categoryMap = {
    Coat: "coat",
    Pant: "pant",
    Shirt: "shirt",
    Vest: "vest",
    Tie: "tie",
    PocketSquare: "pocketSquare",
    Shoe: "shoe",
    StudsCufflinks: "jewel",
    Suspenders: "suspenders",
    Socks: "socks",
  };
  for (const [category, keys] of Object.entries(categoryMap)) {
    const sources = Array.isArray(keys) ? keys : [keys];
    const source =
      sources.map((key) => data?.[key]).find((item) => Object.keys(item || {}).length) || null;
    if (!source) continue;
    layers.push({
      category,
      data: {
        details: source?.collections?.details,
        id: source?.id,
        rental_price: source?.rental_price,
        buy_price: source?.buy_price,
        images: source?.images,
        tie_type: source?.tie_type || "",
        description: source?.description
      },
    });
  }
  const layerData = await updateAllLayers(layers);
  return layerData;
}

export const groupByCategory = (items:any) => {
  const grouped = {};
  items.forEach((item:any) => {
    const match = item.className?.match(/^[A-Za-z]+/);
    if (!match) return;
    let category = match[0];
    if(category==='bow'||category==='neck'){
      category = 'Tie';
    }
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({
      src: item.src,
      alt: item.alt,
      className: item.className,
      z: item.z,
      id: item.id,
      description: item.description,
      rental_price: item.rental_price || null,
      buy_price: item.buy_price || null,
      image: item.image || null,
    });
  });

  return grouped;
}

export const generateRandomCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toLocaleLowerCase();
};