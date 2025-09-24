import { GoogleGenAI, Modality, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_API_KEY } from '../config';

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


export const generateRedesignMockup = async (url: string, imageParts: Part[]): Promise<string[]> => {
    try {
        const prompt = `
You are a world-class UI/UX designer and digital artist, specializing in creating stunning, marketable presentation images for website templates, like those seen on ThemeForest or Dribbble.

Your task is to take the provided collection of website screenshots and generate FIVE (5) distinct, high-quality promotional cover images. Each of the five images should be a unique and professional composition.

**For EACH of the five images, your creative process must follow these steps:**

1.  **Analyze & Synthesize:** Deeply analyze all provided screenshots to understand the application's core purpose, aesthetic, and key UI components.

2.  **Design a Unique & Dynamic Composition:** Artfully arrange ALL the provided screenshots into a visually appealing composition. Each of the five final images must have a different layout. Use professional graphic design techniques:
    *   **Perspective & Depth:** Apply subtle perspective transforms and shadows to make the screenshots look like they are floating in a 3D space.
    *   **Overlapping Layout:** Overlap the screenshots strategically to create a sense of depth.
    *   **Focus & Hierarchy:** Vary the focus and arrangement in each of the five designs.

3.  **Create a Professional Background:** For each of the five images, design a clean, modern, and non-distracting background that complements the screenshots. The backgrounds can be different for each image (e.g., a mix of light themes, dark themes, gradients, abstract shapes).

4.  **Add Contextual Title & Branding:** For each of the five images, add:
    *   A prominent, well-designed title. Infer a suitable name from the content (e.g., "BankCo Admin Dashboard", "Davis Personal Portfolio").
    *   You may add a simple, clean, abstract logo that fits the theme.
    *   Include subtitle text like "Tailwind CSS Template" or "UI/UX Kit".

5.  **Final Polish:** Each of the five images must be a polished, high-resolution image ready for a digital marketplace. They should look professional, modern, and enticing.

**Critical Constraint:** You must generate exactly FIVE distinct promotional images. Each image must contain a composition of the provided screenshots. Do not output the original screenshots separately.
`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    ...imageParts,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const images: string[] = [];
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    images.push(part.inlineData.data);
                }
            }
        }

        if (images.length === 0) {
            throw new Error("AI failed to generate any images. The response did not contain image data.");
        }
        
        return images;

    } catch (error) {
        console.error("Error generating UI redesign mockup:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
             throw new Error("The request was blocked due to safety policies. Please try with a different screenshot or URL.");
        }
        throw new Error("Failed to generate the UI mockup. The model may be temporarily unavailable.");
    }
};

export const generateMockupFromScreenshots = async (imageParts: Part[]): Promise<string[]> => {
    try {
        const prompt = `
You are a world-class UI/UX designer and digital artist, specializing in creating stunning, marketable presentation images for website templates, like those seen on ThemeForest or Dribbble.

Your task is to take the provided collection of website screenshots and generate FIVE (5) distinct, high-quality promotional cover images. Each of the five images should be a unique and professional composition.

**For EACH of the five images, your creative process must follow these steps:**

1.  **Analyze & Synthesize:** Deeply analyze all provided screenshots to understand the application's core purpose, aesthetic, and key UI components.

2.  **Design a Unique & Dynamic Composition:** Artfully arrange ALL the provided screenshots into a visually appealing composition. Each of the five final images must have a different layout. Use professional graphic design techniques:
    *   **Perspective & Depth:** Apply subtle perspective transforms and shadows to make the screenshots look like they are floating in a 3D space.
    *   **Overlapping Layout:** Overlap the screenshots strategically to create a sense of depth.
    *   **Focus & Hierarchy:** Vary the focus and arrangement in each of the five designs.

3.  **Create a Professional Background:** For each of the five images, design a clean, modern, and non-distracting background that complements the screenshots. The backgrounds can be different for each image (e.g., a mix of light themes, dark themes, gradients, abstract shapes).

4.  **Add Contextual Title & Branding:** For each of the five images, add:
    *   A prominent, well-designed title. Infer a suitable name from the content (e.g., "BankCo Admin Dashboard", "Davis Personal Portfolio").
    *   You may add a simple, clean, abstract logo that fits the theme.
    *   Include subtitle text like "Tailwind CSS Template" or "UI/UX Kit".

5.  **Final Polish:** Each of the five images must be a polished, high-resolution image ready for a digital marketplace. They should look professional, modern, and enticing.

**Critical Constraint:** You must generate exactly FIVE distinct promotional images. Each image must contain a composition of the provided screenshots. Do not output the original screenshots separately.
`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    ...imageParts,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const images: string[] = [];
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    images.push(part.inlineData.data);
                }
            }
        }

        if (images.length === 0) {
            throw new Error("AI failed to generate any images. The response did not contain image data.");
        }
        
        return images;

    } catch (error) {
        console.error("Error generating UI mockup from screenshots:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
             throw new Error("The request was blocked due to safety policies. Please try with different screenshots.");
        }
        throw new Error("Failed to generate the UI mockup. The model may be temporarily unavailable.");
    }
};