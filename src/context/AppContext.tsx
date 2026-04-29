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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    get(key).then(val => {
      if (val !== undefined && val !== null) {
        if (Array.isArray(initialValue) && !Array.isArray(val)) return;
        setState(val);
      } else {
        // Fallback to migrate legacy localStorage data
        const localVal = localStorage.getItem(key);
        if (localVal) {
          try {
            const parsed = JSON.parse(localVal);
            if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
              // Expected array but didn't get one
            } else {
              setState(parsed);
              // Migrate it to IndexedDB so it's only loading from IDB next time
              set(key, parsed).catch(e => console.error("Migration to IDB failed:", e));
            }
          } catch (e) {
            console.error('Failed to parse localStorage legacy data for', key, e);
          }
        }
      }
    }).catch(e => console.error(e)).finally(() => {
       setIsLoaded(true);
    });
  }, [key]);

  const setPersistedState = (value: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof value === 'function' ? (value as any)(prev) : value;
      set(key, nextValue).catch(e => console.error(e));
      return nextValue;
    });
  };

  return [state, setPersistedState, isLoaded] as const;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits, habitsLoaded] = usePersistedState<any[]>('notebook-habits', initialHabits);
  const [files, setFiles, filesLoaded] = usePersistedState<any[]>('notebook-files', initialFiles);
  const [folders, setFolders, foldersLoaded] = usePersistedState<any[]>('notebook-folders', initialFolders);
  const [goals, setGoals, goalsLoaded] = usePersistedState<any[]>('notebook-goals', initialGoals);
  const [milestones, setMilestones, milestonesLoaded] = usePersistedState<any[]>('notebook-milestones', initialMilestones);

  const isFullyHydrated = habitsLoaded && filesLoaded && foldersLoaded && goalsLoaded && milestonesLoaded;
  
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

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
    if (isLink && typeof file === 'string') {
      let url = file;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      const newFile = { 
        id: Date.now(),
        name: customName || url, 
        type: 'Link', 
        size: '1 KB', 
        url: url,
        folderId: folderId
      };
      setFiles((prev: any) => [newFile, ...prev]);
    } else if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = { 
          id: Date.now(),
          name: customName || file.name, 
          type: file.type || 'Document', 
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
          dataUrl: reader.result,
          folderId: folderId
        };
        setFiles((prev: any) => [newFile, ...prev]);
      };
      reader.readAsDataURL(file);
    }
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

  if (!isFullyHydrated) {
    return (
      <div className="flex bg-[#fdfcf9] items-center justify-center h-screen w-screen relative">
         <div className="animate-pulse flex flex-col items-center">
            <span className="font-headline font-black text-2xl uppercase tracking-widest text-[#111]">Loading Atelier...</span>
         </div>
      </div>
    );
  }

  const forceSetAllData = (data: any) => {
    if (data.habits) setHabits(data.habits);
    if (data.files) setFiles(data.files);
    if (data.folders) setFolders(data.folders);
    if (data.goals) setGoals(data.goals);
    if (data.milestones) setMilestones(data.milestones);
  };

  return (
    <AppContext.Provider value={{
      isDarkMode, toggleDarkMode,
      habits, toggleHabitDate, addHabit, removeHabit,
      files, addFile, deleteFile, updateFileName,
      folders, addFolder, deleteFolder, updateFolderName,
      goals, addGoal, deleteGoal, updateGoal,
      milestones, toggleMilestone,
      heatmapData, forceSetAllData,
      lastSynced, setLastSynced
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
