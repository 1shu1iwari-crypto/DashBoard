import { Plus, X, Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { cn, calculateGoalProgress } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function GoalCenter() {
  const { goals, addGoal, deleteGoal, updateGoal } = useAppContext();
  const heroStats = goals.length > 0 ? calculateGoalProgress(goals[0]) : null;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Goal Center Header */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline text-5xl font-extrabold tracking-tighter uppercase mb-2">Goal Center</h2>
            <p className="font-label text-sm uppercase tracking-widest text-outline">Tracking Intentions & Milestones</p>
          </div>
          <div className="bg-surface-container-low p-3 hand-drawn-border sketch-border hidden md:block">
            <span className="font-headline font-bold text-xl">{goals.length} Active {goals.length === 1 ? 'Goal' : 'Goals'}</span>
          </div>
        </div>
        
        {/* If there are goals, show the primary goal at the top as the "Upcoming Next" milestone */}
        {goals.length > 0 && heroStats && (
          <div className="bg-surface-container-lowest sketch-border p-10 ghost-border relative overflow-hidden mt-8">
            <div className="absolute top-4 right-6 transform rotate-3 bg-black text-white px-4 py-1 font-headline font-bold uppercase text-xs hidden sm:block">Primary Focus</div>
            <h3 className="font-headline text-2xl font-bold uppercase mb-8">Upcoming Next: <span className="underline decoration-4">{goals[0].title}</span></h3>
            
            <div className="flex flex-wrap items-center gap-6 md:gap-12 mb-10">
              <div className="text-center">
                <div className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-none">{heroStats.daysLeft}</div>
                <div className="font-label uppercase text-xs tracking-widest mt-2">{heroStats.daysLeft === 1 ? 'Day Left' : 'Days Left'}</div>
              </div>
              <div className="font-headline text-4xl md:text-6xl font-thin opacity-30">:</div>
              <div className="text-center">
                <div className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-none">{heroStats.progress}%</div>
                <div className="font-label uppercase text-xs tracking-widest mt-2">Time Elapsed</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center font-label text-xs uppercase tracking-widest font-bold">
                <span>Timeline Progress</span>
                <span>{heroStats.daysPassed} days / {Math.round(heroStats.totalDays)} total</span>
              </div>
              
              {/* Sketchy Progress Bar */}
              <div className="h-10 w-full border-4 border-black relative bg-surface-container">
                <div className="h-full bg-black flex overflow-hidden transition-all duration-500" style={{ width: `${heroStats.progress}%` }}>
                  <div className="w-full h-full hatch-pattern opacity-40"></div>
                </div>
                {/* Hatch marks/Scale */}
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-px h-2 bg-black mt-auto mb-1"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Goals Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-xl font-black uppercase tracking-tight">Active Milestones</h3>
          <div className="h-px flex-grow mx-6 bg-outline-variant"></div>
        </div>

        {goals.length === 0 ? (
           <section className="bg-surface-container-low sketch-border border-dashed p-12 text-center ghost-offset">
             <div className="w-16 h-16 border-2 border-black border-dashed rounded-full flex items-center justify-center mx-auto mb-4 bg-surface">
               <span className="font-headline text-3xl font-black">!</span>
             </div>
             <h2 className="text-xl font-headline font-black uppercase tracking-widest mb-2">No Goals Set</h2>
             <p className="text-outline max-w-md mx-auto mb-6 italic">You haven't sketched out any milestones yet. Plant a seed for your future.</p>
             <button 
               onClick={addGoal}
               className="bg-black text-white px-6 py-3 font-headline font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:scale-105 transition-transform"
             >
               <Plus size={18} strokeWidth={2} />
               Draft First Goal
             </button>
           </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {goals.map((goal: any, index: number) => {
              // Creating varied rotation for sketchy feel
              const rotationClass = index % 3 === 0 ? '-rotate-3' : index % 3 === 1 ? 'rotate-2' : '-rotate-6';
              const stats = calculateGoalProgress(goal);
              return (
                <div key={goal.id} className="bg-surface-container-lowest sketch-border p-6 ghost-border group relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <input 
                        type="text" 
                        value={goal.title}
                        onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                        className="font-headline font-bold uppercase leading-tight w-full bg-transparent border-none p-0 sketch-underline focus:ring-0 text-lg"
                        placeholder="Goal Title"
                      />
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="text-outline hover:text-error transition-colors shrink-0"
                        title="Erase Goal"
                      >
                        <X size={20} strokeWidth={2} />
                      </button>
                    </div>

                    <textarea
                      value={goal.description || ''}
                      onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                      className="w-full bg-transparent border-none p-0 font-body text-sm text-outline-variant sketch-underline focus:ring-0 min-h-[80px] resize-none mb-6"
                      placeholder="Add bullet points, descriptions, or notes here..."
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-6 sketch-underline pb-2 w-[max-content]">
                      <CalendarIcon size={16} className="text-black/50" />
                      <input 
                        type="date" 
                        value={goal.deadline || ''}
                        onChange={(e) => updateGoal(goal.id, { deadline: e.target.value })}
                        className="font-label uppercase text-xs font-bold bg-transparent border-none p-0 focus:ring-0 tracking-widest text-black"
                      />
                    </div>
                    
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <span className="font-headline text-4xl font-black">{stats.daysLeft}</span>
                        <span className="font-label text-[10px] uppercase tracking-tighter ml-1">Days Left</span>
                      </div>
                      <div className={cn("w-16 h-16 border-2 border-black flex items-center justify-center bg-surface shrink-0", rotationClass)}>
                        <span className="font-headline font-black text-2xl">{stats.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="h-2 w-full bg-surface-container sketch-border overflow-hidden group-hover:h-4 transition-all">
                      <div className="h-full bg-black hatch-pattern opacity-60 transition-all duration-500" style={{ width: `${stats.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Goal Card */}
            <button 
              onClick={addGoal}
              className="bg-surface-container-low sketch-border border-dashed p-6 border-outline flex flex-col items-center justify-center space-y-4 hover:bg-surface-container transition-colors group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-black border-dashed flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} strokeWidth={2} />
              </div>
              <span className="font-headline font-black uppercase tracking-widest text-sm">Add New Goal</span>
            </button>
            
          </div>
        )}
      </section>
      
      {/* Bottom Visual Anchor */}
      {goals.length > 0 && (
        <section className="mt-20 flex justify-center">
          <div className="sketch-border p-8 max-w-2xl bg-white relative">
            <div className="absolute -top-4 -left-4 bg-black text-white p-2 font-headline font-black leading-none">
              !
            </div>
            <p className="font-body italic md:text-lg leading-relaxed text-center">
               "The pencil is but an extension of the mind. To plan is to see the future before it exists."
            </p>
            <div className="mt-4 flex justify-center">
               <div className="h-1 w-24 bg-black hatch-pattern opacity-20"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
