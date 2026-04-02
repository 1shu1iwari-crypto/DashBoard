import { Target, Flag, ArrowRight, Plus, MoreVertical, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function GoalCenter() {
  const { goals, addGoal, deleteGoal, milestones, toggleMilestone } = useAppContext();

  // Calculate overall progress for the hero goal based on milestones
  const completedMilestones = milestones.filter((m: any) => m.done).length;
  const heroProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Goal Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Set, track, and achieve your long-term objectives.</p>
        </div>
        <button 
          onClick={addGoal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Goal
        </button>
      </header>

      {/* Hero Goal */}
      {goals.length > 0 ? (
        <section className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-10 text-white shadow-xl">
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium uppercase tracking-widest text-purple-200">
                <Flag size={14} />
                Primary Focus
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Launch MVP by Q4</h2>
              <p className="text-slate-300 max-w-xl text-lg">
                Complete the core features, finalize the design system, and deploy the initial version to beta testers.
              </p>
              
              <div className="pt-4 flex items-center gap-6">
                <div>
                  <div className="text-3xl font-bold font-mono">14</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Days Left</div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-bold font-mono">{heroProgress}%</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-1">Completed</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Key Milestones
                <span className="text-xs bg-white/20 px-2 py-1 rounded-md">{completedMilestones}/{milestones.length}</span>
              </h3>
              <div className="space-y-3">
                {milestones.map((m: any) => (
                  <div 
                    key={m.id} 
                    onClick={() => toggleMilestone(m.id)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <CheckCircle2 size={18} className={cn("transition-colors", m.done ? "text-purple-400" : "text-white/30 group-hover:text-white/60")} />
                    <span className={cn("text-sm font-medium transition-colors", m.done ? "text-slate-200 line-through" : "text-white group-hover:text-slate-200")}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-slate-50 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={28} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Goals Set</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">You haven't created any goals yet. Start setting your objectives to track your progress over time.</p>
          <button 
            onClick={addGoal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create Your First Goal
          </button>
        </section>
      )}

      {/* Goal Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Other Objectives</h2>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1">
            View Archive <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: any) => (
            <div key={goal.id} className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl group hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer relative">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", goal.iconBg, goal.iconColor)}>
                  <Target size={24} />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Delete goal"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{goal.category}</div>
                <h3 className="text-lg font-semibold">{goal.title}</h3>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>{goal.current} / {goal.total}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", goal.color)} style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500">
              No active goals. Create one to get started!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
