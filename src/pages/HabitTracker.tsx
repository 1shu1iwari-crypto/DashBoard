import { ChevronLeft, ChevronRight, Plus, X, AlignLeft } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function HabitTracker() {
  const { habits, toggleHabitDate, addHabit, removeHabit, heatmapData } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTime, setNewHabitTime] = useState("");
  
  const defaultStart = new Date().toISOString().split('T')[0];
  const [newHabitStartDate, setNewHabitStartDate] = useState(defaultStart);

  const getWeekDates = () => {
    const d = new Date(); d.setHours(0,0,0,0);
    const dayOfWeek = d.getDay(); 
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);
    
    return [0,1,2,3,4,5,6].map(i => {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      return `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
    });
  };
  const weekDatesStr = getWeekDates();

  const getOverallStats = () => {
    const allActiveDates = new Set<string>();
    habits.forEach((h: any) => {
      Object.keys(h.dates || {}).forEach(k => {
        if (h.dates[k]) allActiveDates.add(k);
      });
    });
    
    const sortedDates = Array.from(allActiveDates).sort();
    let currentStreak = 0; let maxStreak = 0; let tempStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
       if (i === 0) { tempStreak = 1; maxStreak = 1; continue; }
       const d1 = new Date(sortedDates[i-1]); const d2 = new Date(sortedDates[i]);
       const diffDays = Math.round(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
       if (diffDays === 1) tempStreak++; else tempStreak = 1;
       maxStreak = Math.max(maxStreak, tempStreak);
    }
    
    const d = new Date(); d.setHours(0,0,0,0);
    const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const yesterday = new Date(d); yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
    
    let checkDate = allActiveDates.has(todayStr) ? new Date(d) : (allActiveDates.has(yestStr) ? yesterday : null);
    if (checkDate) {
       currentStreak = 1;
       while(true) {
         checkDate.setDate(checkDate.getDate() - 1);
         const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth()+1).padStart(2,'0')}-${String(checkDate.getDate()).padStart(2,'0')}`;
         if (allActiveDates.has(checkStr)) currentStreak++; else break;
       }
    }
    return { activeDays: allActiveDates.size, maxStreak, currentStreak };
  };
  const stats = getOverallStats();

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-transparent';
    if (intensity === 1) return 'bg-black/20';
    if (intensity === 2) return 'bg-black/45';
    if (intensity === 3) return 'bg-black/75';
    return 'bg-black';
  };

  const getDayLetter = (index: number) => {
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index];
  };

  // Intentionally blank hook space
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black font-headline tracking-tighter uppercase mb-2">Habit Tracker</h2>
          <div className="flex items-center gap-4">
            <span className="font-label text-sm uppercase tracking-widest text-outline">Active Rhythms</span>
            <div className="h-[2px] w-24 bg-black"></div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-6 mb-4">
            <button className="hover:scale-110 transition-transform"><ChevronLeft size={24} strokeWidth={1.5} /></button>
            <span className="font-headline text-2xl font-bold uppercase tracking-widest">{new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
            <button className="hover:scale-110 transition-transform"><ChevronRight size={24} strokeWidth={1.5} /></button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="group flex items-center gap-2 border-b-2 border-black pb-1 hover:pr-4 transition-all"
          >
            <Plus size={20} className="text-black" strokeWidth={2} />
            <span className="font-label font-bold uppercase tracking-tight">Add Habit</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Bento Grid Full Width: GitHub-Style Consistency Heatmap */}
        <section className="col-span-12 bg-surface-container-lowest hand-drawn-border p-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <div>
              <span className="font-headline text-lg font-bold">
                {heatmapData.filter(i => i > 0).length} submissions in the past one year
              </span>
            </div>
            <div className="flex gap-6 items-center text-sm font-label text-outline">
              <span>Total active days: <strong className="text-on-surface">{stats.activeDays}</strong></span>
              <span>Max streak: <strong className="text-on-surface">{stats.maxStreak}</strong></span>
              <div className="flex items-center gap-2 border border-outline-variant px-3 py-1 rounded">
                <span>Current: <strong className="text-black">{stats.currentStreak}</strong></span>
                <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto hide-scrollbar pb-4">
            <div className="inline-block min-w-max">
              <div className="flex gap-2">
                <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                  {heatmapData.map((intensity: number, i: number) => (
                    <div 
                      key={i} 
                      className={cn("w-3 h-3 rounded-[2px] transition-transform hover:scale-125 cursor-pointer", getIntensityColor(intensity))}
                      title={`Activity level: ${intensity} on Day ${i}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Dynamic Month Labels perfectly matched to grid width */}
              <div className="flex justify-between mt-2 text-xs font-label text-outline pl-2 w-full">
                {Array.from({ length: 12 }).map((_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - (11 - i));
                  return <span key={i}>{d.toLocaleString('default', { month: 'short' })}</span>;
                })}
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-outline flex justify-end">
            <div className="flex gap-2 items-center">
              <span className="text-[10px] font-label uppercase text-outline">Less Ink</span>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={cn("w-3 h-3 rounded-[2px] border border-outline-variant", getIntensityColor(i))} />
              ))}
              <span className="text-[10px] font-label uppercase text-outline">More Ink</span>
            </div>
          </div>
        </section>
        
        {/* Active Rhythms List */}
        <section className="col-span-12 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-headline text-2xl font-bold uppercase tracking-tight">Active Rhythms</h3>
            <div className="flex-grow h-[1.5px] bg-outline-variant"></div>
          </div>

          {isAdding && (
            <div className="group bg-surface-container-lowest p-6 hand-drawn-border flex flex-col gap-4 relative animate-in fade-in duration-300 ghost-shadow mt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-headline font-bold text-lg uppercase">Draft New Rhythm</h4>
                <button 
                  onClick={() => setIsAdding(false)} 
                  className="text-outline hover:text-error transition-colors"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-label uppercase text-outline mb-1">Habit Detail/Name</label>
                  <input 
                    type="text" 
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g. Morning Pages"
                    className="bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-black border-dashed font-headline focus:ring-0 focus:border-solid px-0 py-2 placeholder:text-outline/40 shadow-none focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-label uppercase text-outline mb-1">Time Element</label>
                  <input 
                    type="text" 
                    value={newHabitTime}
                    onChange={(e) => setNewHabitTime(e.target.value)}
                    placeholder="e.g. 20 Mins"
                    className="bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-black border-dashed font-label focus:ring-0 focus:border-solid px-0 py-2 placeholder:text-outline/40 shadow-none focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-label uppercase text-outline mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={newHabitStartDate}
                    onChange={(e) => setNewHabitStartDate(e.target.value)}
                    className="bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-black border-dashed font-label focus:ring-0 focus:border-solid px-0 py-2 text-black shadow-none focus:outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (newHabitName.trim() === '') return;
                  addHabit(newHabitName, newHabitTime, newHabitStartDate);
                  setIsAdding(false);
                  setNewHabitName("");
                  setNewHabitTime("");
                }}
                className="mt-4 bg-black text-white font-headline font-bold uppercase py-2 px-8 hand-drawn-border hover:scale-95 transition-transform w-fit self-end"
              >
                Commit to Ink
              </button>
            </div>
          )}

          {habits.length > 0 ? (
            habits.map((habit) => {
              const safeDates = habit.dates || {};
              const weeklyCompletions = weekDatesStr.filter(d => safeDates[d]).length;
              
              return (
                <div key={habit.id} className="group bg-surface hover:bg-surface-container transition-colors p-6 hand-drawn-border flex flex-col md:flex-row md:items-center gap-8 relative">
                  <button 
                    onClick={() => removeHabit(habit.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-error"
                    title="Remove Habit"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold font-headline mb-1 uppercase tracking-tight">{habit.name}</h4>
                    <div className="flex items-center gap-2 text-outline">
                      <AlignLeft size={16} strokeWidth={1.5} />
                      <span className="text-xs font-label uppercase tracking-widest">{habit.time || 'Daily Flow'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-center">
                    {[0,1,2,3,4,5,6].map((dayIndex) => {
                       const dateStr = weekDatesStr[dayIndex];
                       // Only allow checking if date is >= startDate
                       const isBeforeStart = dateStr < (habit.startDate || defaultStart);
                       const isCompleted = safeDates[dateStr];
                       
                       return (
                         <div key={dayIndex} className="flex flex-col items-center">
                           <span className="text-[9px] font-label uppercase text-outline mb-1">{getDayLetter(dayIndex)}</span>
                           <button 
                             disabled={isBeforeStart}
                             onClick={() => toggleHabitDate(habit.id, dateStr)}
                             className={cn(
                               "w-10 h-10 border-2 flex items-center justify-center transition-colors hand-drawn-border",
                               isBeforeStart ? "border-outline border-dashed opacity-30 cursor-not-allowed bg-transparent" : "border-black",
                               isCompleted ? "bg-black text-white" : (!isBeforeStart && "bg-surface hover:bg-black/10")
                             )}
                           >
                             {isCompleted && <span className="text-xl font-black font-headline leading-none">✓</span>}
                           </button>
                         </div>
                       )
                    })}
                  </div>
                  <div className="pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-outline-variant md:text-right min-w-[100px] pt-4 md:pt-0 mt-4 md:mt-0">
                    <span className="text-[10px] font-label uppercase text-outline block">This Week</span>
                    <span className="text-2xl font-black font-headline">{weeklyCompletions}/7</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-outline italic sketchy-border bg-white ghost-offset">
              <p>No habits present in the atelier. Begin your first rhythm.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
