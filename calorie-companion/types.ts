
export interface Meal {
  id: string;
  name: string;
  calories: number;
  carbohydrates_g: number;
  fiber_g: number;
  fat_g: number;
  date: string;
}

export interface Exercise {
  id: string;
  name: string;
  caloriesBurned: number;
  date: string;
}

export interface WeightEntry {
  weight: number;
  date: string;
}

export enum Tab {
    Dashboard = 'dashboard',
    DailyLog = 'daily-log',
    Exercise = 'exercise',
    Weight = 'weight'
}
