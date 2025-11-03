
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const foodNutritionSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The name of the food item, including portion size if specified.',
    },
    calories: {
      type: Type.NUMBER,
      description: 'Total calories in the food item.',
    },
    carbohydrates_g: {
      type: Type.NUMBER,
      description: 'Total carbohydrates in grams.',
    },
    fiber_g: {
      type: Type.NUMBER,
      description: 'Total dietary fiber in grams.',
    },
    fat_g: {
      type: Type.NUMBER,
      description: 'Total fat in grams.',
    },
  },
  required: ['name', 'calories', 'carbohydrates_g', 'fiber_g', 'fat_g'],
};

export const getFoodNutrition = async (foodQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide the nutritional information for: ${foodQuery}. Assume a standard single serving unless specified otherwise.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: foodNutritionSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error fetching food nutrition from Gemini:', error);
    throw new Error('Could not fetch nutritional data. Please try again.');
  }
};

export const getMotivationalMessage = async (achievementType: 'caloric_deficit' | 'weight_loss'): Promise<string> => {
    let prompt = '';
    if (achievementType === 'caloric_deficit') {
        prompt = "Generate a short, positive, and motivational message for someone who successfully stayed in a calorie deficit yesterday. Keep it under 25 words.";
    } else {
        prompt = "Generate a short, encouraging message for someone who lost weight. Keep it under 25 words.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error fetching motivational message:', error);
        return "Great job! Your hard work is paying off.";
    }
};
