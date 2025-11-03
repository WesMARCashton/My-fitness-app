
import React from 'react';
import { Meal, Exercise } from '../types';
import { DAILY_CALORIE_GOAL } from '../constants';

interface DashboardProps {
  remainingCalories: number;
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  todaysMeals: Meal[];
  todaysExercises: Exercise[];
  motivation: string;
  isLoadingMotivation: boolean;
}

const StatCard: React.FC<{ title: string; value: number; unit: string; icon: string; color: string }> = ({ title, value, unit, icon, color }) => (
  <div className={`bg-gray-800 p-4 rounded-xl flex items-center space-x-4 ${color}`}>
    <i className={`fas ${icon} fa-2x w-12 text-center`}></i>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}<span className="text-lg text-gray-400 ml-1">{unit}</span></p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ remainingCalories, totalCaloriesConsumed, totalCaloriesBurned, motivation, isLoadingMotivation }) => {
  const goalWithExercise = DAILY_CALORIE_GOAL + totalCaloriesBurned;
  const progress = goalWithExercise > 0 ? (totalCaloriesConsumed / goalWithExercise) * 100 : 0;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-teal-400">Dashboard</h1>
      
      <div className="relative flex justify-center items-center h-48">
        <svg className="transform -rotate-90" width="160" height="160" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="12" fill="transparent" />
          <circle
            cx="70"
            cy="70"
            r="60"
            stroke="url(#progressGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white">{Math.round(remainingCalories)}</span>
          <span className="text-gray-400">Remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <StatCard title="Consumed" value={Math.round(totalCaloriesConsumed)} unit="kcal" icon="fa-utensils" color="text-sky-400" />
        <StatCard title="Burned" value={Math.round(totalCaloriesBurned)} unit="kcal" icon="fa-fire" color="text-orange-400" />
      </div>

      {isLoadingMotivation ? (
        <div className="bg-gray-800 p-4 rounded-xl text-center">
            <i className="fas fa-spinner fa-spin mr-2"></i> Loading today's motivation...
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-center font-semibold text-teal-300">
            <i className="fas fa-quote-left mr-2 opacity-50"></i>
            {motivation}
            <i className="fas fa-quote-right ml-2 opacity-50"></i>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
