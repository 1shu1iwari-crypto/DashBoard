import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { FileText, Image as ImageIcon, FileArchive, Flame, CheckCircle, Target } from 'lucide-react';
import { get, set } from 'idb-keyval';

// Initial Data
const initialHabits: any[] = [];
const initialFiles: any[] = [];
const initialFolders: any[] = [];
const initialGoals: any[] = [];
const initialMilestones: any[] = [];

const AppContext = createContext<any>(null);

function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    get(key).then(val => {
      if (val !== undefined && val !== null) {
        if (Array.isArray(initialValue) && !Array.isArray(val)) return;
        setState(val);
      }
    }).catch(e => console.error(e));
  }, [key]);

  const setPersistedState = (value: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof value === 'function' ? (value as any)(prev) : value;
      set(key, nextValue).catch(e => console.error(e));
      return nextValue;
    });
  };

  return [state, setPersistedState] as const;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = usePersistedState<any[]>('notebook-habits', initialHabits);
  const [files, setFiles] = usePersistedState<any[]>('notebook-files', initialFiles);
  const [folders, setFolders] = usePersistedState<any[]>('notebook-folders', initialFolders);
  const [goals, setGoals] = usePersistedState<any[]>('notebook-goals', initialGoals);
  const [milestones, setMilestones] = usePersistedState<any[]>('notebook-milestones', initialMilestones);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Generate a totally literal calendar heatmap synchronized to actual YYYY-MM-DD
  const heatmapData = useMemo(() => {
    const totalDays = 52 * 7; // 364 days
    const days = new Array(totalDays).fill(0);
    
    const d = new Date();
    d.setHours(0,0,0,0);
    const dayOfWeek = d.getDay(); 
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const sundayOfThisWeek = new Date(d);
    sundayOfThisWeek.setDate(d.getDate() + diffToSunday);

    for (let i = 0; i < totalDays; i++) {
        const offset = i - (totalDays - 1);
        const cellDate = new Date(sundayOfThisWeek);
        cellDate.setDate(sundayOfThisWeek.getDate() + offset);
        
        const dateStr = `${cellDate.getFullYear()}-${String(cellDate.getMonth()+1).padStart(2,'0')}-${String(cellDate.getDate()).padStart(2,'0')}`;

        let completedCount = 0;
        habits.forEach((habit: any) => {
            if (habit.dates && habit.dates[dateStr]) {
                completedCount++;
            }
        });
        
        days[i] = Math.min(completedCount, 4) as 0 | 1 | 2 | 3 | 4;
    }
    
    return days;
  }, [habits]);

  // Actions
  const toggleHabitDate = (habitId: number, dateStr: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const safeDates = h.dates || {};
        const isCompleted = !safeDates[dateStr];
        
        return {
          ...h,
          dates: { ...safeDates, [dateStr]: isCompleted },
          // Convert legacy property format automatically so it doesn't break
          days: h.days || [false, false, false, false, false, false, false]
        };
      }
      return h;
    }));
  };

  const addHabit = (name?: string, time?: string, startDate?: string) => {
    const defaultStart = new Date().toISOString().split('T')[0];
    const newHabit = { 
      id: Date.now(),
      name: name || `New Habit ${habits.length + 1}`, 
      time: time || '15 mins',
      category: 'General', 
      startDate: startDate || defaultStart,
      dates: {}, 
      streak: 0, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10'
    };
    setHabits([newHabit, ...habits]);
  };

  const removeHabit = (id: number) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const updateFileName = (id: number, newName: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const addFolder = (name: string) => {
    const newFolder = { id: Date.now(), name };
    setFolders([newFolder, ...folders]);
  };

  const deleteFolder = (id: number) => {
    setFolders(folders.filter(f => f.id !== id));
    // Optional: Also delete files within that folder, or move them to root
    setFiles(files.filter(f => f.folderId !== id));
  };

  const updateFolderName = (id: number, newName: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const addFile = (file: File | string, isLink: boolean = false, customName?: string, folderId: number | null = null) => {
    let newFile: any;
    
    if (isLink && typeof file === 'string') {
      let url = file;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      newFile = { 
        id: Date.now(),
        name: customName || url, 
        type: 'Link', 
        size: '1 KB', 
        url: url,
        folderId: folderId
      };
    } else if (file instanceof File) {
      newFile = { 
        id: Date.now(),
        name: customName || file.name, 
        type: file.type || 'Document', 
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
        fileBlob: file,
        folderId: folderId
      };
    } else {
      return;
    }
    
    setFiles([newFile, ...files]);
  };

  const deleteFile = (id: number) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const addGoal = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const newGoal = { 
      id: Date.now(),
      title: `New Goal ${goals.length + 1}`, 
      description: '',
      createdAt: today.toISOString(),
      deadline: nextMonth.toISOString().split('T')[0], // yyyy-mm-dd format for input type="date"
      category: 'General', 
      color: 'bg-purple-500', 
    };
    setGoals([newGoal, ...goals]);
  };

  const updateGoal = (id: number, updates: any) => {
    setGoals(goals.map((g: any) => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((g: any) => g.id !== id));
  };

  const toggleMilestone = (id: number) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <AppContext.Provider value={{
      isDarkMode, toggleDarkMode,
      habits, toggleHabitDate, addHabit, removeHabit,
      files, addFile, deleteFile, updateFileName,
      folders, addFolder, deleteFolder, updateFolderName,
      goals, addGoal, deleteGoal, updateGoal,
      milestones, toggleMilestone,
      heatmapData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
