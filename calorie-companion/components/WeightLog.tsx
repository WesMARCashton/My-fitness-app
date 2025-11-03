
import React, { useState, useMemo } from 'react';
import { WeightEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WeightLogProps {
  weightEntries: WeightEntry[];
  addWeightEntry: (weight: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-2 border border-gray-600 rounded">
        <p className="label text-sm">{`${label}`}</p>
        <p className="intro text-teal-400">{`Weight: ${payload[0].value} lbs`}</p>
      </div>
    );
  }
  return null;
};

const WeightLog: React.FC<WeightLogProps> = ({ weightEntries, addWeightEntry }) => {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      addWeightEntry(weightValue);
      setWeight('');
    }
  };

  const chartData = useMemo(() => {
    return weightEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: entry.weight,
    }));
  }, [weightEntries]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-teal-400">Weight Tracker</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Log Today's Weight</h2>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-400 mb-1">Weight (lbs)</label>
          <input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 174.5"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            required
          />
        </div>
        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg">
          Save Weight
        </button>
      </form>
      
      <div className="space-y-3">
         <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Progress</h2>
         {weightEntries.length > 1 ? (
             <div className="bg-gray-800 p-4 rounded-lg h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="date" stroke="#a0aec0" fontSize={12} />
                        <YAxis stroke="#a0aec0" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4, fill: '#2dd4bf' }} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
         ) : (
            <p className="text-gray-500 text-center py-4">Log at least two entries to see your progress chart.</p>
         )}
      </div>

       <div className="space-y-3">
        <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">History</h2>
        {weightEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No weight logged yet.</p>
        ) : (
          [...weightEntries].reverse().map((entry, index) => (
            <div key={index} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <p className="font-bold">{new Date(entry.date).toLocaleDateString()}</p>
              <p className="text-lg font-bold text-teal-400">{entry.weight.toFixed(1)} lbs</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeightLog;
