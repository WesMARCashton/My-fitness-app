
// User Profile
const WEIGHT_LBS = 175;
const HEIGHT_INCHES = 68; // 5'8"
const AGE = 39;
const SEX = 'male';

// Conversions
const WEIGHT_KG = WEIGHT_LBS / 2.20462;
const HEIGHT_CM = HEIGHT_INCHES * 2.54;

// Mifflin-St Jeor Equation for BMR (Basal Metabolic Rate)
const BMR = (10 * WEIGHT_KG) + (6.25 * HEIGHT_CM) - (5 * AGE) + (SEX === 'male' ? 5 : -161);

// TDEE (Total Daily Energy Expenditure) - assuming sedentary lifestyle (x1.2)
export const TDEE = BMR * 1.2;

// Daily Calorie Goal for weight loss (approx. 1 lb/week deficit)
export const DAILY_CALORIE_GOAL = Math.round(TDEE - 500);
