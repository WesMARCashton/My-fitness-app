
import React, { useState, useMemo, useEffect } from 'react';
import { Meal, Exercise, WeightEntry, Tab } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DAILY_CALORIE_GOAL, TDEE } from './constants';
import Dashboard from './components/Dashboard';
import DailyLog from './components/DailyLog';
import ExerciseLog from './components/ExerciseLog';
import WeightLog from './components/WeightLog';
import BottomNav from './components/BottomNav';
import { getMotivationalMessage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [meals, setMeals] = useLocalStorage<Meal[]>('meals', []);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('exercises', []);
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>('weightEntries', []);
  const [motivation, setMotivation] = useState<string>('');
  const [isLoadingMotivation, setIsLoadingMotivation] = useState<boolean>(false);

  const today = new Date().toLocaleDateString();

  const todaysMeals = useMemo(() => meals.filter(m => new Date(m.date).toLocaleDateString() === today), [meals, today]);
  const todaysExercises = useMemo(() => exercises.filter(e => new Date(e.date).toLocaleDateString() === today), [exercises, today]);

  const totalCaloriesConsumed = useMemo(() => todaysMeals.reduce((sum, meal) => sum + meal.calories, 0), [todaysMeals]);
  const totalCaloriesBurned = useMemo(() => todaysExercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0), [todaysExercises]);

  const remainingCalories = useMemo(() => DAILY_CALORIE_GOAL + totalCaloriesBurned - totalCaloriesConsumed, [totalCaloriesConsumed, totalCaloriesBurned]);

  const addMeal = (meal: Omit<Meal, 'date' | 'id'>) => {
    const newMeal: Meal = { ...meal, id: Date.now().toString(), date: new Date().toISOString() };
    setMeals(prev => [...prev, newMeal]);
  };

  const addExercise = (exercise: Omit<Exercise, 'date' | 'id'>) => {
    const newExercise: Exercise = { ...exercise, id: Date.now().toString(), date: new Date().toISOString() };
    setExercises(prev => [...prev, newExercise]);
  };

  const addWeightEntry = (weight: number) => {
    const newEntry: WeightEntry = { weight, date: new Date().toISOString() };
    setWeightEntries(prev => [...prev, newEntry]);
  };

  const checkAchievements = async () => {
    setIsLoadingMotivation(true);
    let message = '';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    const yesterdayMeals = meals.filter(m => new Date(m.date).toLocaleDateString() === yesterdayStr);
    const yesterdayExercises = exercises.filter(e => new Date(e.date).toLocaleDateString() === yesterdayStr);
    const yesterdayCaloriesConsumed = yesterdayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const yesterdayCaloriesBurned = yesterdayExercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);

    const yesterdayTotalBurn = TDEE + yesterdayCaloriesBurned;
    
    if (yesterdayCaloriesConsumed > 0 && yesterdayCaloriesConsumed < yesterdayTotalBurn) {
        message = await getMotivationalMessage('caloric_deficit');
    } else if (weightEntries.length > 1) {
        const lastTwoEntries = weightEntries.slice(-2);
        if (lastTwoEntries[1].weight < lastTwoEntries[0].weight) {
            message = await getMotivationalMessage('weight_loss');
        }
    }
    
    if (!message) {
      message = "Keep pushing forward, one step at a time. You've got this!";
    }
    
    setMotivation(message);
    setIsLoadingMotivation(false);
  };
  
  useEffect(() => {
    checkAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals, weightEntries]);


  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return (
          <Dashboard
            remainingCalories={remainingCalories}
            totalCaloriesConsumed={totalCaloriesConsumed}
            totalCaloriesBurned={totalCaloriesBurned}
            todaysMeals={todaysMeals}
            todaysExercises={todaysExercises}
            motivation={motivation}
            isLoadingMotivation={isLoadingMotivation}
          />
        );
      case Tab.DailyLog:
        return <DailyLog meals={todaysMeals} addMeal={addMeal} />;
      case Tab.Exercise:
        return <ExerciseLog exercises={todaysExercises} addExercise={addExercise} />;
      case Tab.Weight:
        return <WeightLog weightEntries={weightEntries} addWeightEntry={addWeightEntry} />;
      default:
        return <Dashboard 
            remainingCalories={remainingCalories}
            totalCaloriesConsumed={totalCaloriesConsumed}
            totalCaloriesBurned={totalCaloriesBurned}
            todaysMeals={todaysMeals}
            todaysExercises={todaysExercises}
            motivation={motivation}
            isLoadingMotivation={isLoadingMotivation}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24">
        {renderContent()}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
