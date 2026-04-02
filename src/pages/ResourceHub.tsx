import { FolderOpen, Upload, Search, Filter, MoreVertical, HardDrive, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function ResourceHub() {
  const { files, addFile, deleteFile } = useAppContext();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Resource Hub</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and organize your files, links, and assets.</p>
        </div>
        <button 
          onClick={addFile}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Upload size={18} />
          Upload Files
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources by name, tag, or type..." 
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm backdrop-blur-xl"
              />
            </div>
            <button className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {/* Upload Dropzone */}
          <div 
            onClick={addFile}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Drag & drop files here</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Click to simulate upload. Support for PDF, Images, Documents, and Archives up to 50MB per file.
            </p>
          </div>

          {/* Resource Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Uploads</h2>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"><FolderOpen size={16}/></button>
                <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><MoreVertical size={16}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {files.map((file: any) => (
                <div key={file.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", file.bg, file.color)}>
                      <file.icon size={24} />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete file"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="font-medium text-sm truncate mb-1" title={file.name}>{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{file.type}</span>
                    <span>{file.size}</span>
                  </div>
                </div>
              ))}
              {files.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500">
                  No files uploaded yet.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Storage Widget */}
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                <HardDrive size={20} />
              </div>
              <h3 className="font-semibold">Storage Usage</h3>
            </div>
            
            <div className="mb-2 flex justify-between items-end">
              <span className="text-2xl font-bold">0 GB</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">of 100 GB</span>
            </div>
            
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-indigo-500 rounded-full w-[0%]"></div>
            </div>

            <button className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors">
              Upgrade Plan
            </button>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-4">Quick Folders</h3>
            <div className="space-y-1">
              <p className="text-sm text-slate-500 dark:text-slate-400 py-2">No folders created yet.</p>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 py-2">No tags used yet.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
