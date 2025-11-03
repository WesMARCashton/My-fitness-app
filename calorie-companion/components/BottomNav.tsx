
import React from 'react';
import { Tab } from '../types';
import HomeIcon from './icons/HomeIcon';
import FoodIcon from './icons/FoodIcon';
import ExerciseIcon from './icons/ExerciseIcon';
import WeightIcon from './icons/WeightIcon';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

interface NavItemProps {
    tab: Tab;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
    const activeClass = 'text-teal-400';
    const inactiveClass = 'text-gray-400 hover:text-teal-300';

    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}>
            {icon}
            <span className={`text-xs mt-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    )
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-800 border-t border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavItem 
            tab={Tab.Dashboard}
            label="Dashboard"
            icon={<HomeIcon />}
            isActive={activeTab === Tab.Dashboard}
            onClick={() => setActiveTab(Tab.Dashboard)}
        />
        <NavItem 
            tab={Tab.DailyLog}
            label="Food"
            icon={<FoodIcon />}
            isActive={activeTab === Tab.DailyLog}
            onClick={() => setActiveTab(Tab.DailyLog)}
        />
        <NavItem 
            tab={Tab.Exercise}
            label="Exercise"
            icon={<ExerciseIcon />}
            isActive={activeTab === Tab.Exercise}
            onClick={() => setActiveTab(Tab.Exercise)}
        />
        <NavItem 
            tab={Tab.Weight}
            label="Weight"
            icon={<WeightIcon />}
            isActive={activeTab === Tab.Weight}
            onClick={() => setActiveTab(Tab.Weight)}
        />
      </div>
    </div>
  );
};

export default BottomNav;
