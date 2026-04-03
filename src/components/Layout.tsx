import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, PenTool, Target, Timer, Settings, Search, Plus, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/resources', icon: FolderOpen, label: 'Resources' },
    { path: '/habits', icon: PenTool, label: 'Habits' },
    { path: '/goals', icon: Target, label: 'Goals' },
  ];

  return (
    <div className="flex bg-surface font-body text-on-surface selection:bg-primary-container selection:text-white">
      {/* TopNavBar Shell */}
      <header className="flex justify-between items-center px-6 py-4 w-full border-b-2 border-black bg-surface fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tighter uppercase text-primary font-headline">The Notebook</span>
          <div className="hidden md:flex ml-8 items-center bg-surface-container-low border-b-2 border-primary px-3 py-1 sketch-underline">
            <Search className="text-primary mr-2" size={16} strokeWidth={1.5} />
            <input 
              type="text"
              placeholder="Search resources..." 
              className="bg-transparent border-none focus:outline-none focus:ring-0 font-label text-sm placeholder:text-outline italic w-64 uppercase"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="font-headline tracking-tight text-primary font-black underline decoration-2 underline-offset-4 hover:bg-surface-container-high transition-colors px-2 py-1 uppercase text-sm">Add New</button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            {isDarkMode ? (
              <Sun size={20} strokeWidth={1.5} className="text-primary" />
            ) : (
              <Moon size={20} strokeWidth={1.5} className="text-primary" />
            )}
          </button>
        </div>
      </header>

      <div className="flex min-h-screen w-full pt-[74px]">
        {/* SideNavBar */}
        <aside className="fixed left-0 top-[74px] h-[calc(100vh-74px)] w-64 bg-surface border-r-2 border-primary flex-col p-4 pb-8 space-y-6 hidden md:flex z-40">
          <div className="mb-2">
            <h2 className="text-xl font-black text-primary font-headline uppercase tracking-tighter">Workspace</h2>
            <p className="text-[10px] uppercase tracking-widest text-outline font-label font-medium">Hand-drawn Productivity</p>
          </div>
          
          <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto hide-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 font-label font-medium uppercase text-sm tracking-widest flex items-center gap-3 transition-all",
                    isActive 
                      ? "bg-primary text-white hand-drawn-border active:-rotate-1 scale-98" 
                      : "text-primary border border-transparent hover:border-primary hand-drawn-border"
                  )}
                >
                  <item.icon size={20} className={cn(isActive && "text-white")} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto">
            <button className="w-full bg-primary text-white py-3 font-label font-bold uppercase tracking-widest hand-drawn-border flex items-center justify-center gap-2 hover:scale-95 transition-transform active:-rotate-1">
              <Plus size={18} strokeWidth={2} /> New Entry
            </button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 md:ml-64 p-8 min-h-full">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t-2 border-primary flex justify-around p-3 z-50">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} className={cn("flex flex-col items-center gap-1", isActive ? "text-primary font-black" : "text-outline")}>
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className={cn("text-[10px] font-label uppercase", isActive && "underline")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
