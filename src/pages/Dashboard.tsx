import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, CheckCircle, Target, Timer, Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { habits, toggleHabitDay, files, goals } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const todayDateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayIndex = (new Date().getDay() + 6) % 7; // 0 = Monday, 6 = Sunday

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your workspace today.</p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700/50">
          {todayDateString}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Resource Manager Widget */}
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <FolderOpen size={20} />
                </div>
                <h2 className="text-lg font-semibold">Recent Resources</h2>
              </div>
              <Link to="/resources" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.length > 0 ? (
                files.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", item.bg, item.color)}>
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{item.type}</span>
                        <span>&bull;</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No resources uploaded yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Habit Tracker Widget */}
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle size={20} />
                </div>
                <h2 className="text-lg font-semibold">Today's Habits</h2>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Flame size={16} className="text-orange-500" />
                <span>12 Day Streak</span>
              </div>
            </div>

            <div className="space-y-3">
              {habits.length > 0 ? (
                habits.slice(0, 3).map((habit: any) => {
                  const isCompletedToday = habit.days[todayIndex];
                  
                  return (
                    <div key={habit.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleHabitDay(habit.id, todayIndex)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                            isCompletedToday 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-500"
                          )}
                        >
                          {isCompletedToday && <CheckCircle size={14} />}
                        </button>
                        <div>
                          <h3 className={cn("text-sm font-medium", isCompletedToday && "text-slate-500 dark:text-slate-400 line-through")}>{habit.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{habit.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No habits tracked yet.</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Pomodoro Timer */}
          <section className="bg-indigo-600 dark:bg-indigo-500 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Timer size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 opacity-90">
                <Timer size={18} />
                <span className="text-sm font-medium uppercase tracking-wider">Focus Session</span>
              </div>
              
              <div className="text-5xl font-bold tracking-tight mb-8 font-mono">
                {formatTime(timeLeft)}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button 
                  onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }}
                  className="w-12 h-12 bg-indigo-700 dark:bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-800 dark:hover:bg-indigo-700 transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* Goal Countdowns */}
          <section className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <Target size={20} />
              </div>
              <h2 className="text-lg font-semibold">Active Goals</h2>
            </div>

            <div className="space-y-5">
              {goals.length > 0 ? (
                goals.slice(0, 2).map((goal: any) => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{goal.title}</span>
                      <span className="text-slate-500 dark:text-slate-400">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-500", goal.color)} style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No active goals.</p>
                </div>
              )}
            </div>
            <Link to="/goals" className="w-full mt-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
              View All Goals
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
}
