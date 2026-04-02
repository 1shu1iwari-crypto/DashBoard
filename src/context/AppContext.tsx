import React, { createContext, useContext, useState, useMemo } from 'react';
import { FileText, Image as ImageIcon, FileArchive, Flame, CheckCircle, Target } from 'lucide-react';

// Initial Data
const initialHabits: any[] = [];
const initialFiles: any[] = [];
const initialGoals: any[] = [];
const initialMilestones: any[] = [];

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState(initialHabits);
  const [files, setFiles] = useState(initialFiles);
  const [goals, setGoals] = useState(initialGoals);
  const [milestones, setMilestones] = useState(initialMilestones);

  // Generate heatmap once so it doesn't flash on re-renders
  const heatmapData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7 * 12; i++) {
      days.push(0); // Empty heatmap
    }
    return days;
  }, []);

  // Actions
  const toggleHabitDay = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        const isCompleted = !newDays[dayIndex];
        newDays[dayIndex] = isCompleted;
        return {
          ...h,
          days: newDays,
          streak: isCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const addHabit = () => {
    const newHabit = { 
      id: Date.now(),
      name: `New Habit ${habits.length + 1}`, 
      time: '15 mins',
      category: 'General', 
      streak: 0, 
      icon: CheckCircle, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10', 
      days: [false, false, false, false, false, false, false] 
    };
    setHabits([newHabit, ...habits]);
  };

  const addFile = () => {
    const newFile = { 
      id: Date.now(),
      name: `New Upload ${files.length + 1}.pdf`, 
      type: 'PDF', 
      size: `${(Math.random() * 10).toFixed(1)} MB`, 
      icon: FileText, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10' 
    };
    setFiles([newFile, ...files]);
  };

  const deleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const addGoal = () => {
    const newGoal = { 
      id: Date.now(),
      title: `New Goal ${goals.length + 1}`, 
      category: 'General', 
      progress: 0, 
      total: '100', 
      current: '0', 
      color: 'bg-purple-500', 
      iconColor: 'text-purple-500', 
      iconBg: 'bg-purple-50 dark:bg-purple-500/10' 
    };
    setGoals([newGoal, ...goals]);
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const toggleMilestone = (id: number) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <AppContext.Provider value={{
      habits, toggleHabitDay, addHabit,
      files, addFile, deleteFile,
      goals, addGoal, deleteGoal,
      milestones, toggleMilestone,
      heatmapData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
