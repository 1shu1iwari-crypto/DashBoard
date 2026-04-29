import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, PenTool, Link2, FileText, Trash2, MoreVertical, Settings, Folder } from 'lucide-react';
import { cn, calculateGoalProgress } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { habits, toggleHabitDay, files, folders, goals } = useAppContext();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleOpenAsset = (item: any) => {
    if (item.isFolder) {
      navigate('/resources', { state: { folderId: item.id } });
    } else {
      if (item.url) {
        window.open(item.url, '_blank');
      } else if (item.dataUrl) {
        const win = window.open('', '_blank');
        if (win) {
           fetch(item.dataUrl).then(res => res.blob()).then(blob => {
               win.location.href = URL.createObjectURL(blob);
           });
        }
      } else if (item.fileBlob) {
        const objectUrl = URL.createObjectURL(item.fileBlob);
        window.open(objectUrl, '_blank');
      }
    }
  };

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

  const todayIndex = (new Date().getDay() + 6) % 7; // 0 = Monday

  // Calculate some stats for the welcome banner
  const activeGoalsCount = goals.filter(g => g.progress < 100).length;
  // Calculate a mock "goal velocity" based on progress average
  const goalVelocity = goals.length > 0 ? Math.round(goals.reduce((acc, gov) => acc + gov.progress, 0) / goals.length) : 0;

  const combinedAssets = [...folders.map((f: any) => ({...f, isFolder: true})), ...files.map((f: any) => ({...f, isFolder: false}))];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Welcome Banner (Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 p-10 sketchy-border bg-surface-container-lowest ghost-offset">
          <h2 className="text-4xl md:text-5xl font-headline font-black mb-1 tracking-tighter uppercase">Welcome to Notebook</h2>
          <div className="font-label uppercase tracking-widest text-outline mb-4 font-bold text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <p className="text-lg text-on-surface-variant max-w-xl font-light">The ink is fresh, and the pages are waiting. You have {activeGoalsCount} active projects planned for today.</p>
          <div className="mt-8 flex gap-4">
            <div className="p-4 border border-black/20 rounded-lg">
              <span className="block text-2xl font-black font-headline">{habits.length}</span>
              <span className="text-xs uppercase font-label">Active Rituals</span>
            </div>
            <div className="p-4 border border-black/20 rounded-lg">
              <span className="block text-2xl font-black font-headline">{goalVelocity}%</span>
              <span className="text-xs uppercase font-label">Goal Velocity</span>
            </div>
          </div>
        </div>

        {/* Custom Deep Focus */}
        <div className="p-8 border-2 border-[#111] dark:border-[#ffffff] bg-[#111] text-[#ffffff] dark:bg-[#1a1a1a] flex flex-col items-center justify-center text-center relative rounded-[4px_2px_5px_3px]">
          <div className="absolute top-4 right-4 flex gap-2">
             <button 
               onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }}
               className="text-[#ffffff]/50 hover:text-[#ffffff] transition-colors"
               title="Reset Timer"
             >
               <RotateCcw size={16} />
             </button>
          </div>
          <div className="w-24 h-24 sketch-circle border-[#ffffff] flex flex-col items-center justify-center mb-4 relative group">
            {!isRunning ? (
              <div className="flex flex-col items-center">
                 <input 
                   type="number" 
                   value={Math.ceil(timeLeft / 60)}
                   onChange={(e) => {
                     let m = parseInt(e.target.value);
                     if (isNaN(m) || m < 1) m = 1;
                     if (m > 120) m = 120;
                     setTimeLeft(m * 60);
                   }}
                   className="w-12 bg-transparent text-center font-headline font-black text-3xl border-b-2 border-[#ffffff]/30 focus:border-[#ffffff] outline-none p-0 appearance-none m-0 focus:ring-0 leading-none h-8 -mt-2 text-[#ffffff]"
                   min="1" max="120"
                 />
                 <span className="text-[9px] uppercase font-label mt-1 text-[#ffffff]/70">Minutes</span>
              </div>
            ) : (
              <span className="text-3xl font-headline font-black">{formatTime(timeLeft)}</span>
            )}
          </div>
          <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Deep Focus</h3>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="mt-4 px-6 py-2 bg-[#ffffff] text-[#111] font-black uppercase text-xs rounded-sm hover:-translate-y-1 transition-transform"
          >
            {isRunning ? 'Pause Flow' : 'Start Ink Flow'}
          </button>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Habit Tracker (Col 4) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-2xl font-headline font-black uppercase tracking-tighter underline decoration-black decoration-2 underline-offset-8">Daily Rituals</h3>
            <Link to="/habits">
              <PenTool size={20} className="cursor-pointer text-outline hover:text-black transition-colors" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {habits.length > 0 ? (
              habits.slice(0, 5).map((habit) => {
                const isCompletedToday = habit.days[todayIndex];
                return (
                  <div key={habit.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => toggleHabitDay(habit.id, todayIndex)}>
                    <div className={cn("w-5 h-5 border-2 border-black rounded-[3px] relative flex items-center justify-center transition-all", isCompletedToday ? "bg-black/5" : "")}>
                       {isCompletedToday && <span className="absolute -top-1 left-0 text-xl font-black text-black leading-none font-headline">✓</span>}
                    </div>
                    <div>
                      <span className={cn("text-lg font-medium group-hover:italic transition-all", isCompletedToday && "line-through text-outline")}>{habit.name}</span>
                    </div>
                  </div>
                );
              })
            ) : (
                <p className="text-sm text-outline italic">No rituals added yet.</p>
            )}
          </div>
          
          <Link to="/habits" className="block w-full py-4 mt-4 border-2 border-dashed border-black/30 font-label uppercase text-xs tracking-widest text-center hover:border-black transition-colors text-black">
            Manage Rituals
          </Link>
        </section>

        {/* Resource Manager (Col 8) */}
        <section className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-headline font-black uppercase tracking-tighter">Resource Manager</h3>
            <div className="flex gap-2">
              <Link to="/resources" className="text-xs uppercase font-label tracking-widest font-bold underline decoration-2 underline-offset-4 hover:text-primary-fixed-dim transition-colors">
                View All
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {combinedAssets.length > 0 ? (
              combinedAssets.slice(0, 2).map((item: any) => (
                <div 
                  key={`${item.isFolder ? 'folder' : 'file'}-${item.id}`} 
                  onClick={() => handleOpenAsset(item)}
                  className="p-6 sketchy-border bg-white group hover:-translate-y-1 transition-transform relative cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    {item.isFolder ? <Folder size={32} strokeWidth={1} className="text-black fill-black/10" /> : <FileText size={32} strokeWidth={1} />}
                  </div>
                  <h4 className="font-headline font-bold text-lg leading-tight mb-2 pr-8 truncate" title={item.name}>{item.name}</h4>
                  <p className="text-[10px] text-outline uppercase font-label">
                    {item.isFolder ? (
                       `${files.filter((f: any) => f.folderId === item.id).length} items • Folder`
                    ) : (
                       `${item.size} • ${item.type}${item.folderId ? ` • ${folders.find((f: any) => f.id === item.folderId)?.name || 'Folder'}` : ''}`
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-outline italic sketchy-border bg-white ghost-offset">
                No resources uploaded.
              </div>
            )}
            
            {/* Add Resource Card */}
            <Link to="/resources" className="p-6 bg-surface-container-low border-2 border-black border-dashed flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-surface-container transition-colors sketch-dashed">
              <Link2 size={32} strokeWidth={1} className="mb-2" />
              <span className="font-label uppercase text-xs tracking-tighter font-bold">Add new asset</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Grid: Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        
        {/* Goal Countdown */}
        <section className="lg:col-span-12 p-8 sketchy-border bg-white ghost-offset">
           <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-headline font-black uppercase tracking-tighter">Goal Countdowns</h3>
            <Link to="/goals" className="text-xs uppercase font-label tracking-widest font-bold underline decoration-2 underline-offset-4 hover:text-primary-fixed-dim transition-colors">
              Manage
            </Link>
          </div>
          <div className="space-y-10">
            {goals.length > 0 ? (
              goals.slice(0, 3).map((goal: any) => {
                const stats = calculateGoalProgress(goal);
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between items-end mb-3">
                      <h4 className="font-headline font-bold text-xl">{goal.title}</h4>
                      <span className="font-label text-sm">{goal.deadline || 'No Deadline'}</span>
                    </div>
                    <div className="h-4 w-full border-2 border-black relative overflow-hidden bg-surface-container">
                      <div className="absolute top-0 left-0 h-full hatch-pattern transition-all duration-500 border-r-2 border-black bg-black/10" style={{ width: `${stats.progress}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase text-outline">{stats.progress}% complete ({stats.daysPassed} / {Math.round(stats.totalDays)} days)</p>
                  </div>
                );
              })
            ) : (
              <p className="text-outline italic">No active goals to track.</p>
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}
