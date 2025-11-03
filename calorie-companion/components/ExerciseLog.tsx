
import React, { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseLogProps {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'date' | 'id'>) => void;
}

const ExerciseLog: React.FC<ExerciseLogProps> = ({ exercises, addExercise }) => {
  const [exerciseName, setExerciseName] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = parseInt(caloriesBurned, 10);
    if (exerciseName.trim() && !isNaN(calories) && calories > 0) {
      addExercise({ name: exerciseName, caloriesBurned: calories });
      setExerciseName('');
      setCaloriesBurned('');
    }
  };

  const totalCaloriesBurned = exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-orange-400">Exercise Log</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Add Exercise</h2>
        <div>
          <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-400 mb-1">Exercise Description</label>
          <input
            id="exerciseName"
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="e.g., '30 minute run'"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-400 mb-1">Calories Burned</label>
          <input
            id="caloriesBurned"
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            placeholder="e.g., 300"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>
        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg">
          Log Exercise
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Today's Activity</h2>
        {exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No exercises logged yet today.</p>
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded-lg mb-4 text-center">
                <p className="text-gray-400">Total Burned Today</p>
                <p className="text-3xl font-bold text-orange-400">{Math.round(totalCaloriesBurned)} <span className="text-lg">kcal</span></p>
            </div>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                <p className="font-bold">{exercise.name}</p>
                <p className="text-lg font-bold text-orange-400">{Math.round(exercise.caloriesBurned)} kcal</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseLog;
