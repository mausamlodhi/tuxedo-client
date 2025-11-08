import logger from "@/utils/logger";
import { desc, image } from "framer-motion/m";
import { title } from "process";
import { useMemo, useState } from "react";

type Layer = {
    src: string;
    alt: string;
    className: string;
    z: number;
    id?: number;
    description: string;
};

type CategoryData = {
    id: number;
    rental_price: string;
    buy_price?: string;
    title?: string;
    tie_type:string;
    details: [
        {
            type: string;
            image: string
        }
    ];
    description: string;
}

type GroupedLayers = Record<string, Layer[]>;

const categoryMap: Record<string, string> = {
    placeholder: "base",
    hanger: "base",
    pants: "pants",
    "shirt": "shirt",
    //   "shirt-tail": "shirt",
    //   "shirt-collar": "shirt",
    "vest-full": "vest",
    "vest-front": "vest",
    "jacket-front": "jacket",
    tie: "tie",
    "pocket-square": "pocketSquare",
    belt: "accessories",
    cufflinks: "accessories",
    "lapel-pin": "accessories",
    shoes: "shoes",
    //   "shadow-socks": "shadows",
    socks: "shadows",
};

function groupLayers(layers: Layer[]): GroupedLayers {
    return layers.reduce((acc: GroupedLayers, layer) => {
        const category = categoryMap[layer.className] || "misc";
        if (!acc[category]) acc[category] = [];
        acc[category].push(layer);
        return acc;
    }, {});
}

function flattenLayers(grouped: GroupedLayers): Layer[] {
    return Object.values(grouped).flat().sort((a, b) => a.z - b.z);
}

export function useLayers(initialLayers: Layer[]) {
    const [layers, setLayers] = useState<Layer[]>(initialLayers);

    const grouped = useMemo(() => groupLayers(layers), [layers]);
    const flat = useMemo(() => flattenLayers(grouped), [grouped]);

    const updateLayer = (category: string, updatedLayer: Layer) => {
        setLayers((prev) => {
            const without = prev.filter(
                (l) => categoryMap[l.className] !== category
            );
            return [...without, updatedLayer];
        });
    };

    return { grouped, flat, updateLayer };
}

const sampleLayers = {
    Pant: [{
        src: "",
        alt: "pant",
        className: "",
        z: 1,
        id: 0,
        description: ""
    }],
    Shirt: [{
        src: "",
        alt: "shirt_full",
        className: "",
        z: 3,
        id: 0,
        description: ""
    }],
    Shoe: [{
        src: "",
        alt: "shoes",
        className: "",
        z: 11,
        id: 0,
        description: ""
    }],
    Tie: [{
        src: "",
        alt: "tie",
        className: "",
        z: 4,
        id: 0,
        description: ""
    }],
    Jewelry: [{
        src: "",
        alt: "",
        className: "",
        z: 0,
        id: 0,
        description: ""
    }],
    Socks: [{
        src: "",
        alt: "socks",
        className: "",
        z: 2,
        id: 0,
        description: ""
    }],
    'PocketSquare': [{
        src: "",
        alt: "pocket_square",
        className: "",
        z: 10,
        id: 0,
        description: ""
    }],
    Suspenders: [{
        src: "",
        alt: "suspenders",
        className: "",
        z: 10,
        id: 0,
        description: ""
    }],
    'StudsCufflinks': [{
        src: "",
        alt: "studs&cufflinks",
        className: "",
        z: 10,
        id: 0,
        description: ""
    }],
    lapelPin: [{
        src: "",
        alt: "lapel_pin",
        className: "",
        z: 9,
        id: 0,
        description: ""
    }],
    Vest: [
        {
            src: "",
            alt: "",
            className: "vest-full",
            z: 2,
            id: 0,
            description: ""
        },
        {
            src: "",
            alt: "",
            className: "vest-front",
            z: 5,
            id: 0,
            description: ""
        }
    ],
    Coat: [
        {
            src: "",
            alt: "vest_full",
            className: "",
            z: 2,
            id: 0,
            description: ""
        },
        {
            src: "",
            alt: "jacket_front",
            className: "",
            z: 7,
            id: 0,
            description: ""
        }
    ]
}

export const hangerLayer = {
    src: "https://vipformalwear.s3.us-east-2.amazonaws.com/refrence_images/hanger.png",
    alt: "hanger",
    className: "hanger",
    z: 0,
    id: 0
}


export const updateAllLayers = (layerData: any) => {
    if (!Array.isArray(layerData)) return {};
    const updatedLayers = layerData.reduce((acc: any, data: any) => {
        const category = data?.category;
        const categorySample = sampleLayers[category] || [];

        const updatedCategory = categorySample.map((item: any, idx: number) => ({
            ...item,
            src: data?.data?.details?.[idx]?.image ?? item.src,
            className: data?.data?.tie_type? data?.data?.tie_type :`${category}-${data?.data?.details?.[idx]?.type}`,
            rental_price: data?.data?.rental_price ?? item.rental_price,
            id: data?.data?.id ?? item.id,
            title: data?.data?.title ?? item.title,
            buy_price: data?.data?.buy_price,
            rental_price_id: item.rental_price,
            image: data?.data?.images?.[0],
            description: data?.data?.description || ""

        }));

        acc[category] = updatedCategory;
        return acc;
    }, {});

    return updatedLayers;
};

export const updateLayers = (category: string, data: CategoryData) => {
    const categorySample = sampleLayers[category];
    const updatedCategory = categorySample.map((item:any,idx:number)=>{
        return {
            ...item,
            src:data?.details?.[idx]?.image,
            className:data?.tie_type?data?.tie_type : `${category}-${data?.details?.[idx]?.type}`,
            rental_price:data?.rental_price,
            id:data?.id,
            title:data?.title,
            buy_price:data?.buy_price,
            description: data?.description || data?.description || ""
        }
    });
    return updatedCategory
}