import { GoogleGenAI, Type } from "@google/genai";
import { CharacterInfo, Settings } from "../types";

// --- Gemini AI Configuration ---
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("Gemini API_KEY environment variable not set. Gemini functionality will be disabled.");
}

const SETTINGS_KEY = 'ai_settings';

const getSettings = (): Settings => {
    const defaultSettings = { useCustomApi: false, apiUrl: '', apiKey: '', model: '' };
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    return defaultSettings;
};

// --- Custom OpenAI-Compatible API Functions ---

/**
 * Fetches the list of available models from a custom OpenAI-compatible endpoint.
 * @param apiUrl The base URL of the custom API.
 * @param apiKey The API key for the custom service.
 * @returns A promise that resolves to an array of model IDs.
 */
export const fetchCustomModels = async (apiUrl: string, apiKey: string): Promise<string[]> => {
    const cleanApiUrl = apiUrl.trim().replace(/\/$/, '');
    const response = await fetch(`${cleanApiUrl}/models`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to fetch models:", response.status, response.statusText, errorBody);
        throw new Error(`请求失败 (${response.status}): ${response.statusText}. 请检查 API 地址和 Key。`);
    }

    const data = await response.json();
    let modelsList: any[] = [];

    // Standard OpenAI format: { data: [...] }
    if (data && Array.isArray(data.data)) {
        modelsList = data.data;
    } 
    // Fallback for root array format: [...]
    else if (Array.isArray(data)) {
        modelsList = data;
    }

    if (modelsList.length > 0 && typeof modelsList[0]?.id === 'string') {
        // The list contains objects with an 'id' property
        return modelsList.map((model: any) => model.id);
    }
    // No compatible models found or unexpected format
    return [];
};


const callCustomApi = async (base64ImageDataUrl: string, settings: Settings): Promise<CharacterInfo[]> => {
    const cleanApiUrl = settings.apiUrl.trim().replace(/\/$/, '');
    const response = await fetch(`${cleanApiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
            model: settings.model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: "Identify the main subject in this image. Respond with ONLY a JSON array where each object contains a 'character' and its corresponding 'pinyin' with tone marks. The name should be simple and common, between 2 to 4 characters. For example, for 'apple', respond with `[{\"character\":\"苹\",\"pinyin\":\"píng\"},{\"character\":\"果\",\"pinyin\":\"guǒ\"}]`. Do not include any other text, explanation, or markdown formatting.",
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: base64ImageDataUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Custom API Error:", errorBody);
        throw new Error(`Custom API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("Invalid response structure from custom API.");
    }

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```|(\[[\s\S]*\])/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : content;

    const parsedResult = JSON.parse(jsonText.trim());

    if (!Array.isArray(parsedResult)) {
        console.warn("API response was not an array, returning empty.", parsedResult);
        return [];
    }

    // Normalize the response to ensure one character per object, fixing layout issues.
    const normalizedResult: CharacterInfo[] = [];
    for (const item of parsedResult) {
        if (item.character && typeof item.character === 'string' && item.character.length > 1) {
            // If one item contains a whole word, split it into individual characters.
            const characters = [...item.character]; // Use spread operator to handle unicode correctly
            const pinyins = item.pinyin && typeof item.pinyin === 'string' ? item.pinyin.split(/\s+/) : [];
            characters.forEach((char, index) => {
                normalizedResult.push({
                    character: char,
                    pinyin: pinyins[index] || '', // Match pinyin or provide empty string
                });
            });
        } else if (item.character && typeof item.character === 'string' && item.character.length === 1) {
            // This is the expected format, add it directly.
            normalizedResult.push({
                character: item.character,
                pinyin: item.pinyin || ''
            });
        }
        // Silently ignore any malformed items in the array.
    }
    return normalizedResult;
};


// --- Gemini API Function ---

const callGeminiApi = async (base64ImageDataUrl: string): Promise<CharacterInfo[]> => {
  if (!ai) {
    throw new Error("Gemini AI is not initialized. Please set API_KEY.");
  }

  const base64Data = base64ImageDataUrl.split(',')[1];
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };

  const textPart = {
    text: "Identify the main subject in this image. Respond with ONLY a JSON array where each object contains a 'character' and its corresponding 'pinyin' with tone marks. The name should be simple and common, between 2 to 4 characters. For example, for 'apple', respond with `[{\"character\":\"苹\",\"pinyin\":\"píng\"},{\"character\":\"果\",\"pinyin\":\"guǒ\"}]`. Do not include any other text or explanation.",
  };

  const response = await ai.models.generateContent({
    // FIX: Updated model to gemini-2.5-flash to align with current recommendations for multimodal tasks.
    model: 'gemini-2.5-flash',
    contents: [{ parts: [imagePart, textPart] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            character: { type: Type.STRING },
            pinyin: { type: Type.STRING },
          },
          required: ["character", "pinyin"],
        },
      },
    },
  });

  const jsonText = response.text.trim();
  if (!jsonText) {
    throw new Error("Gemini returned an empty response.");
  }
  return JSON.parse(jsonText);
};

// --- Unified Identification Function ---

/**
 * Identifies the main subject in an image using either the default Gemini model or a custom API.
 * @param base64ImageDataUrl The base64 encoded data URL of the image.
 * @returns A promise that resolves to an array of objects, each containing a character and its pinyin.
 */
export const identifyImageInChinese = async (base64ImageDataUrl: string): Promise<CharacterInfo[]> => {
    const settings = getSettings();
    
    try {
        let result: CharacterInfo[];
        if (settings.useCustomApi && settings.apiUrl && settings.apiKey && settings.model) {
            console.log(`Using Custom API: ${settings.model}`);
            result = await callCustomApi(base64ImageDataUrl, settings);
        } else {
            console.log('Using Gemini API');
            result = await callGeminiApi(base64ImageDataUrl);
        }

        if (!Array.isArray(result) || result.length === 0 || result.some(item => typeof item.character !== 'string' || typeof item.pinyin !== 'string')) {
            throw new Error("Invalid JSON structure from AI response.");
        }
        return result;

    } catch (error) {
        console.error("Error calling AI API or parsing response:", error);
        
        let friendlyMessage = '识别失败，请稍后重试。';
        if (error instanceof Error) {
            const lowerCaseMessage = error.message.toLowerCase();
            if (lowerCaseMessage.includes('quota')) {
                friendlyMessage = 'API 调用超出配额，请检查您的账户用量或稍后再试。';
            } else if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('invalid api key')) {
                friendlyMessage = 'API Key 无效或不正确，请在设置中检查并更正。';
            } else if (lowerCaseMessage.includes('fetch') || lowerCaseMessage.includes('network')) {
                 friendlyMessage = '网络请求失败，请检查您的网络连接和API地址。';
            } else if (lowerCaseMessage.includes('invalid json structure')) {
                friendlyMessage = 'AI模型返回了无效的数据格式，请稍后重试。';
            } else {
                 friendlyMessage = `识别出错，请检查设置并重试。`;
            }
        }
        
        throw new Error(friendlyMessage);
    }
};