import { fileToBase64 } from ".";
import { GOOGLE_STUDIO_KEY } from "./env";
import logger from "./logger";
import { GoogleGenAI } from "@google/genai";

export const urlToBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/png";
    return {
        base64: buffer.toString("base64"),
        mimeType: contentType,
    };
}
export const removeSolidBackground = (
    input: File | string,
    bgColor = { r: 255, g: 255, b: 255 },
    tolerance = 30
): Promise<File> => {
    return new Promise<File>((resolve, reject) => {
        const img = new Image();
        if (typeof input === "string") {
            img.src = input;
        } else {
            img.src = URL.createObjectURL(input);
        }

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i],
                    g = data[i + 1],
                    b = data[i + 2];
                if (
                    Math.abs(r - bgColor.r) < tolerance &&
                    Math.abs(g - bgColor.g) < tolerance &&
                    Math.abs(b - bgColor.b) < tolerance
                ) {
                    data[i + 3] = 0;
                }
            }

            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Failed to convert canvas to blob"));
                    return;
                }
                resolve(new File([blob], "removed.png", { type: "image/png" }));
            }, "image/png");
        };

        img.onerror = () => reject(new Error("Failed to load image"));
    });
};


export const generateGeminiImages = async (query: string,imageUrl: string,bgColor:string,image:File=null) => {
    try {
        let rgb = { r: 255, g: 255, b: 255 };
        if(bgColor === "black"){
            rgb = { r: 0, g: 0, b: 0 };
        }
        const ai = new GoogleGenAI({ apiKey: GOOGLE_STUDIO_KEY });
        const { base64, mimeType } = await urlToBase64(imageUrl)
        const prompt = [
            {
                text: query
            },
            {
                inlineData: {
                    mimeType,
                    data: base64
                }
            }
        ];
        if(image){
            const firstIamge = await fileToBase64(image);
            prompt.push({
                inlineData: {
                    mimeType,
                    data:firstIamge.split(",")[1]
                }
            },)
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: prompt
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                // const buffer = Buffer.from(imageData, "base64");
                // const fileUrl = await removeSolidBackground(imageData)
                console.log("Image saved as gemini-native-image.png");
                const fileUrl = removeSolidBackground(`data:image/png;base64,${imageData}`,rgb)
                // console.log("Fileeeeeeeeeeeee : ",fileUrl);
                
                return fileUrl;
            }
        }
    } catch (error) {
        logger("Error in generate image : ", error);
        return error;
    }
}