import React, { useState, useRef } from 'react';
import { Meal } from '../types';
import { getFoodNutrition } from '../services/geminiService';

interface DailyLogProps {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'date' | 'id'>) => void;
}

const DailyLog: React.FC<DailyLogProps> = ({ meals, addMeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Omit<Meal, 'date' | 'id'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScannerActive, setIsScannerActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setSearchResults(null);
    try {
      const nutritionData = await getFoodNutrition(query);
      setSearchResults(nutritionData);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };
  
  const stopScanner = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
    }
    setIsScannerActive(false);
  };

  const startScanner = async () => {
    // @ts-ignore
    if (!('BarcodeDetector' in window) || typeof window.BarcodeDetector.getSupportedFormats !== 'function') {
        setError('Barcode scanner is not supported on this device.');
        return;
    }
    setIsScannerActive(true);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            
            // @ts-ignore
            const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13', 'upc_a', 'upc_e'] });

            scanIntervalRef.current = window.setInterval(async () => {
                if (videoRef.current && !videoRef.current.paused && streamRef.current?.active) {
                    try {
                        const barcodes = await barcodeDetector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                            const barcodeValue = barcodes[0].rawValue;
                            stopScanner();
                            setSearchQuery(barcodeValue);
                            performSearch(barcodeValue);
                        }
                    } catch (e) {
                        console.error("Barcode detection failed:", e);
                    }
                }
            }, 300);
        }
    } catch (err) {
        console.error("Camera access error:", err);
        setError('Could not access camera. Please grant permission in your browser settings.');
        stopScanner();
    }
  };


  const handleAddMeal = () => {
    if (searchResults) {
      addMeal(searchResults);
      setSearchResults(null);
      setSearchQuery('');
    }
  };
  
  const totalMacros = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      carbs: acc.carbs + meal.carbohydrates_g,
      fat: acc.fat + meal.fat_g,
      fiber: acc.fiber + meal.fiber_g,
  }), { calories: 0, carbs: 0, fat: 0, fiber: 0 });

  const ScannerOverlay = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 z-10">
            <button onClick={stopScanner} className="bg-gray-800 bg-opacity-70 text-white rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold" aria-label="Close scanner">
                &times;
            </button>
        </div>
        <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay></video>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11/12 h-2/3 border-4 border-dashed border-teal-400 rounded-lg opacity-75"></div>
            </div>
        </div>
        <p className="text-white mt-4 text-center">Position a barcode inside the rectangle.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {isScannerActive && <ScannerOverlay />}
      <h1 className="text-3xl font-bold text-center text-sky-400">Daily Food Log</h1>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g., '1 cup oatmeal' or scan"
          className="flex-grow bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <button type="button" onClick={startScanner} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex-shrink-0 disabled:bg-gray-600" aria-label="Scan barcode">
          <i className="fas fa-barcode"></i>
        </button>
        <button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex-shrink-0 disabled:bg-gray-600" aria-label="Search food">
          {isLoading && !isScannerActive ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {searchResults && (
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <h3 className="font-bold text-lg">{searchResults.name}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-gray-700 p-2 rounded"><p className="font-bold text-sky-400">{Math.round(searchResults.calories)}</p><p className="text-xs">Calories</p></div>
              <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(searchResults.carbohydrates_g)}g</p><p className="text-xs">Carbs</p></div>
              <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(searchResults.fat_g)}g</p><p className="text-xs">Fat</p></div>
              <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(searchResults.fiber_g)}g</p><p className="text-xs">Fiber</p></div>
          </div>
          <button onClick={handleAddMeal} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg">
            Add to Log
          </button>
        </div>
      )}
      
      {isLoading && !searchResults && (
        <div className="text-center p-4">
          <i className="fas fa-spinner fa-spin fa-2x text-sky-400"></i>
          <p className="mt-2 text-gray-400">Looking up food...</p>
        </div>
      )}


      <div className="space-y-3">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No meals logged yet today.</p>
        ) : (
          <>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-lg mb-2 text-center">Daily Totals</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-gray-700 p-2 rounded"><p className="font-bold text-sky-400">{Math.round(totalMacros.calories)}</p><p className="text-xs">Calories</p></div>
                    <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(totalMacros.carbs)}g</p><p className="text-xs">Carbs</p></div>
                    <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(totalMacros.fat)}g</p><p className="text-xs">Fat</p></div>
                    <div className="bg-gray-700 p-2 rounded"><p className="font-bold">{Math.round(totalMacros.fiber)}g</p><p className="text-xs">Fiber</p></div>
                </div>
            </div>
            {meals.map((meal) => (
              <div key={meal.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">{meal.name}</p>
                  <p className="text-sm text-gray-400">
                    {Math.round(meal.carbohydrates_g)}g C / {Math.round(meal.fat_g)}g F / {Math.round(meal.fiber_g)}g Fib
                  </p>
                </div>
                <p className="text-lg font-bold text-sky-400">{Math.round(meal.calories)} kcal</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DailyLog;