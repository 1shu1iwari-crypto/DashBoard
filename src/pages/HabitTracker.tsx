import { CheckCircle, Flame, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function HabitTracker() {
  const { habits, toggleHabitDay, addHabit, heatmapData } = useAppContext();
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 = Monday, 6 = Sunday

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-slate-100 dark:bg-slate-800/50';
      case 1: return 'bg-emerald-200 dark:bg-emerald-900/40';
      case 2: return 'bg-emerald-300 dark:bg-emerald-700/60';
      case 3: return 'bg-emerald-400 dark:bg-emerald-500/80';
      case 4: return 'bg-emerald-500 dark:bg-emerald-400';
      default: return 'bg-slate-100 dark:bg-slate-800/50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Habit Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400">Build consistency and track your daily rhythms.</p>
        </div>
        <button 
          onClick={addHabit}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Habit
        </button>
      </header>

      {/* Consistency Heatmap */}
      <section className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-1">Consistency Map</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your activity over the last 12 weeks.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-slate-400">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className={cn("w-3 h-3 rounded-sm", getIntensityColor(i))} />
                ))}
              </div>
              <span className="text-slate-400">More</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {/* Simplified heatmap grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1.5">
            {heatmapData.map((intensity: number, i: number) => (
              <div 
                key={i} 
                className={cn("w-4 h-4 rounded-sm transition-colors hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 cursor-pointer", getIntensityColor(intensity))}
                title={`Activity level: ${intensity}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Active Rhythms */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Active Rhythms</h2>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><ChevronLeft size={18}/></button>
            <span className="text-sm font-medium px-2">This Week</span>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><ChevronRight size={18}/></button>
          </div>
        </div>

        <div className="space-y-4">
          {habits.length > 0 ? (
            habits.map((habit: any) => (
              <div key={habit.id} className="bg-white dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                
                <div className="flex items-center gap-4 min-w-[250px]">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", habit.bg, habit.color)}>
                    <habit.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{habit.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="uppercase tracking-wider">{habit.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-orange-500">
                        <Flame size={12} /> {habit.streak} Day Streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, j) => (
                    <div key={j} className="flex flex-col items-center gap-2">
                      <span className={cn(
                        "text-xs font-medium",
                        j === todayIndex ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"
                      )}>{day}</span>
                      <button 
                        onClick={() => toggleHabitDay(habit.id, j)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                          habit.days[j] 
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20" 
                            : j === todayIndex 
                              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400"
                              : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                        )}
                      >
                        {habit.days[j] && <CheckCircle size={18} />}
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
              <p className="text-slate-500 dark:text-slate-400">No habits created yet. Click "New Habit" to get started.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
