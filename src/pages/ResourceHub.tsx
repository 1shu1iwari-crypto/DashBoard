import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, Link as LinkIcon, FileText, Image as ImageIcon, X, ArrowRight, PlusCircle, PenTool, Folder, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export default function ResourceHub() {
  const { files, addFile, deleteFile, updateFileName, folders, addFolder, deleteFolder, updateFolderName } = useAppContext();
  const [linkInput, setLinkInput] = useState('');
  const [linkNameInput, setLinkNameInput] = useState('');
  const [folderNameInput, setFolderNameInput] = useState('');
  const location = useLocation();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(location.state?.folderId || null);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editingFileName, setEditingFileName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFile(e.target.files[0], false, undefined, currentFolderId);
    }
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      addFile(linkInput.trim(), true, linkNameInput.trim(), currentFolderId);
      setLinkInput('');
      setLinkNameInput('');
    }
  };

  const handleAddFolder = () => {
    if (folderNameInput.trim()) {
      addFolder(folderNameInput.trim());
      setFolderNameInput('');
    }
  };

  const startEditing = (e: React.MouseEvent, file: any) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditingFileName(file.name);
  };

  const saveEditing = (id: number) => {
    if (editingFileName.trim()) {
      updateFileName(id, editingFileName.trim());
    }
    setEditingFileId(null);
  };

  const startEditingFolder = (e: React.MouseEvent, folder: any) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const saveEditingFolder = (id: number) => {
    if (editingFolderName.trim()) {
      updateFolderName(id, editingFolderName.trim());
    }
    setEditingFolderId(null);
  };

  const handleOpenAsset = (file: any) => {
    if (file.url) {
      window.open(file.url, '_blank');
    } else if (file.fileBlob) {
      const objectUrl = URL.createObjectURL(file.fileBlob);
      window.open(objectUrl, '_blank');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddLink();
  };

  // Map file types to sketchy styles/icons
  const getFileIcon = (type: string) => {
    if (type.includes('image') || type.includes('Image')) return <ImageIcon className="text-black" size={24} strokeWidth={1.5} />;
    if (type.includes('Link') || type.includes('url')) return <LinkIcon className="text-black" size={24} strokeWidth={1.5} />;
    return <FileText className="text-black" size={24} strokeWidth={1.5} />;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Header & Filters Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {currentFolderId ? (
              <button 
                onClick={() => setCurrentFolderId(null)}
                className="flex items-center gap-2 mb-4 font-label font-bold uppercase tracking-widest text-sm hover:underline decoration-2 underline-offset-4"
              >
                <ArrowLeft size={16} /> Back to Main Workspace
              </button>
            ) : null}
            <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-black uppercase">
              {currentFolderId ? folders.find((f: any) => f.id === currentFolderId)?.name || 'Folder' : 'Resource Hub'}
            </h1>
            <p className="font-body text-outline mt-2 max-w-md">Your curated archive of knowledge. Drag, drop, and organize your digital thoughts.</p>
          </div>
        </div>
      </section>

      {/* Input Zone: Bento Style */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        {/* Drag & Drop */}
        <div 
          onClick={triggerFileInput} 
          className="sketch-dashed bg-surface p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors group"
        >
          <Upload size={48} strokeWidth={1} className="text-black mb-4 group-hover:-translate-y-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-headline text-xl font-bold uppercase tracking-tight">Drop files</h3>
          <p className="font-body text-outline text-sm mt-1">PDFs, images, or documents</p>
        </div>

        {/* Paste URL */}
        <div className="sketch-border p-8 bg-surface-container-lowest flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <LinkIcon size={20} /> Add Link
            </h3>
            <p className="font-body text-outline text-sm mt-2">Paste a URL to automatically clip the content.</p>
          </div>
          <div className="mt-8 relative space-y-4">
            <input 
              type="text" 
              value={linkNameInput}
              onChange={(e) => setLinkNameInput(e.target.value)}
              placeholder="Resource Name (Optional)" 
              className="w-full bg-transparent border-none sketch-underline focus:ring-0 font-label px-0 py-2 placeholder:text-outline-variant outline-none"
            />
            <div className="relative">
              <input 
                type="text" 
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Paste URL here" 
                className="w-full bg-transparent border-none sketch-underline focus:ring-0 font-label px-0 py-2 placeholder:text-outline-variant outline-none"
              />
              <button onClick={handleAddLink} className="absolute right-0 bottom-3 hover:scale-110 transition-transform">
                <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Create Folder (Only in root) */}
        {!currentFolderId && (
          <div className="sketch-border p-8 bg-surface-container flex flex-col justify-between">
            <div>
              <h3 className="font-headline text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Folder size={20} /> Create Folder
              </h3>
              <p className="font-body text-outline text-sm mt-2">Group related resources together.</p>
            </div>
            <div className="mt-8 relative space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                  placeholder="Folder Name" 
                  className="w-full bg-transparent border-none sketch-underline focus:ring-0 font-label px-0 py-2 placeholder:text-outline-variant outline-none"
                />
                <button onClick={handleAddFolder} className="absolute right-0 bottom-3 hover:scale-110 transition-transform">
                  <PlusCircle size={20} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Resource Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="font-headline font-bold text-lg uppercase tracking-widest text-black">
            {currentFolderId ? 'Folder Contents' : 'Recent Assets & Folders'}
          </span>
          <div className="h-[2px] bg-black flex-1 opacity-10"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Render Folders (only at Root) */}
          {!currentFolderId && folders.map((folder: any) => (
            <div 
              key={folder.id} 
              onClick={() => setCurrentFolderId(folder.id)}
              className="sketch-border bg-black/5 p-5 flex flex-col gap-4 ghost-shadow group transition-transform hover:-translate-y-1 hover:bg-black/10 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white sketch-border-sm flex items-center justify-center">
                  <Folder className="text-black fill-black/10" size={24} strokeWidth={1.5} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => startEditingFolder(e, folder)}
                    className="text-outline hover:text-black p-2"
                  >
                    <PenTool size={16} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                    className="text-outline hover:text-error p-2"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>
              
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest bg-white px-2 py-0.5 sketch-border-sm w-fit inline-block mb-3">
                  Folder
                </span>
                
                {editingFolderId === folder.id ? (
                  <div className="mb-2" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editingFolderName} 
                      onChange={e => setEditingFolderName(e.target.value)} 
                      autoFocus
                      onBlur={() => saveEditingFolder(folder.id)}
                      onKeyDown={e => e.key === 'Enter' && saveEditingFolder(folder.id)}
                      className="font-headline font-bold text-lg w-full bg-transparent border-b-2 border-black sketch-underline focus:ring-0 px-0 py-1"
                    />
                  </div>
                ) : (
                  <h4 className="font-headline font-bold text-lg leading-tight uppercase truncate mb-1" title={folder.name}>{folder.name}</h4>
                )}
                
                <p className="font-body text-xs text-outline italic">
                  {files.filter((f: any) => f.folderId === folder.id).length} items
                </p>
              </div>
            </div>
          ))}

          {/* Render Files */}
          {files.filter((f: any) => currentFolderId ? f.folderId === currentFolderId : !f.folderId).map((file: any) => (
            <div 
              key={file.id} 
              onClick={() => handleOpenAsset(file)}
              className="sketch-border bg-white p-5 flex flex-col gap-4 ghost-shadow group transition-transform hover:-translate-y-1 hover:bg-surface-container-low cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-surface-container sketch-border-sm flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => startEditing(e, file)}
                    className="text-outline hover:text-black p-2"
                  >
                    <PenTool size={16} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                    className="text-outline hover:text-error p-2"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>
              
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest bg-surface-container-highest px-2 py-0.5 sketch-border-sm w-fit inline-block mb-3">
                  {file.type ? file.type.split(' ')[0] : 'Asset'}
                </span>
                
                {editingFileId === file.id ? (
                  <div className="mb-2" onClick={e => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editingFileName} 
                      onChange={e => setEditingFileName(e.target.value)} 
                      autoFocus
                      onBlur={() => saveEditing(file.id)}
                      onKeyDown={e => e.key === 'Enter' && saveEditing(file.id)}
                      className="font-headline font-bold text-lg w-full bg-transparent border-b-2 border-black sketch-underline focus:ring-0 px-0 py-1"
                    />
                  </div>
                ) : (
                  <h4 className="font-headline font-bold text-lg leading-tight uppercase truncate mb-1" title={file.name}>{file.name}</h4>
                )}
                
                <p className="font-body text-xs text-outline italic">{file.size}</p>
              </div>
            </div>
          ))}

          {/* Empty Placeholder Card for Quick Add */}
          <div 
            onClick={triggerFileInput}
            className="sketch-dashed bg-transparent p-5 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer min-h-[180px]"
          >
            <PlusCircle size={32} strokeWidth={1} />
            <span className="font-label text-xs uppercase font-bold">Quick Add</span>
          </div>

        </div>
      </section>

    </div>
  );
}
