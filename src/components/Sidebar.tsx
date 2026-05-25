import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, ListTodo, FileText, Target, LayoutGrid, CalendarDays, Map,
  ChevronRight, ChevronDown, MoreHorizontal, Search, Settings, Edit3, Plus, UserPlus,
  Laptop, ShieldAlert, LogOut, ChevronLeft,
  LucideGrid2x2Check,
  Users
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useSidebarStore } from '../store/useSidebarStore';
import { CustomizeSidebarModal } from './modals/CustomizeSidebarModal';
import { useUIStore } from '../store/useUIStore';

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean, onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { config, setCustomizeOpen } = useSidebarStore();
  const { openCreateTaskModal, openSearchModal, openInviteMemberModal, addToast } = useUIStore();

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [tryOpen, setTryOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWorkspaceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (collapsed) {
    return (
      <div className="w-16 flex flex-col h-screen border-r border-border bg-card items-center py-4 gap-4 text-foreground shrink-0">
        <button 
          onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
          className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold hover:bg-primary/30 transition-colors"
        >
          D
        </button>
        <button 
          onClick={openSearchModal}
          className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>
        <button 
          onClick={() => openCreateTaskModal()}
          className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
          title="New Task"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button onClick={onToggle} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
      </div>
    );
  }

  const renderItem = (name: string, icon: any, href: string, visibility: string) => {
    if (visibility === "Don't show") return null;
    const isActive = location.pathname === href;
    const Icon = icon;
    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors group",
          isActive 
            ? "bg-secondary text-foreground font-semibold border border-border/40 shadow-sm" 
            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        )}
      >
        <Icon className="w-4 h-4 opacity-75 group-hover:opacity-100 shrink-0 text-muted-foreground" />
        <span className="truncate">{name}</span>
        {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-primary shrink-0" />}
      </Link>
    );
  };

  return (
    <>
      <div className="w-64 flex flex-col h-screen border-r border-border bg-card text-foreground select-none shrink-0">
        
        {/* Workspace Dropdown Header */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="px-4 py-3 flex items-center justify-between hover:bg-secondary/70 cursor-pointer transition-colors group border-b border-border/40"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                D
              </div>
              <span className="font-semibold text-sm text-foreground truncate">devplug</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform group-hover:text-foreground" />
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openCreateTaskModal();
              }}
              className="p-1 hover:bg-secondary border border-border/20 rounded-md text-muted-foreground hover:text-foreground transition-all"
              title="New task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Workspace Dropdown Panel */}
          <AnimatePresence>
            {workspaceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-3 right-3 top-full mt-1.5 backdrop-blur-lg border border-gray-400 rounded-xl shadow-2xl z-50 py-1 flex flex-col"
              >
                <div className="px-3 py-2 border-b border-gray-200 shrink-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">devplug</p>
                </div>
                
                <div className="p-1 space-y-0.5">
                  <button 
                    onClick={() => {
                      setWorkspaceDropdownOpen(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-secondary text-foreground transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Settings</span>
                    </div>
                    <kbd className="text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100">G then S</kbd>
                  </button>

                  <button 
                    onClick={() => {
                      setWorkspaceDropdownOpen(false);
                      openInviteMemberModal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-secondary text-foreground transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Invite and manage members</span>
                  </button>

                  <button 
                    onClick={() => {
                      setWorkspaceDropdownOpen(false);
                      addToast({ title: 'Downloading installer...', type: 'success' });
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-secondary text-foreground transition-colors"
                  >
                    <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Download desktop app</span>
                  </button>

                  <div className="border-t border-gray-200 my-1" />

                  <button 
                    onClick={() => {
                      setWorkspaceDropdownOpen(false);
                      addToast({ title: 'Workspace switcher opened', type: 'default' });
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-secondary text-foreground transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Switch workspace</span>
                    </div>
                    <kbd className="text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100">O then W</kbd>
                  </button>

                  <button 
                    onClick={() => {
                      setWorkspaceDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-red-500/5 text-red-500 hover:text-red-400 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
                    </div>
                    <kbd className="text-[10px] text-red-500/70 group-hover:text-red-400">Alt + Q</kbd>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action icons */}
        <div className="px-3 py-2 flex gap-1.5 border-b border-border/20 shrink-0">
          <button 
            onClick={openSearchModal}
            className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg text-muted-foreground hover:text-foreground transition-all text-xs font-semibold"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          <button 
            onClick={onToggle} 
            className="px-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg text-muted-foreground hover:text-foreground transition-all"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          
          {/* Personal */}
          <div className="space-y-0.5">

            {renderItem('Dashboard', LucideGrid2x2Check, '/dashboard', config.dashboard)}
            {renderItem('Inbox', Inbox, '/dashboard/inbox', config.inbox)}
            {renderItem('My tasks', ListTodo, '/dashboard/my-tasks', config.myTasks)}
            {renderItem('Drafts', FileText, '/dashboard/drafts', config.drafts)}
          </div>

          {/* Workspace */}
          <div>
            <div 
              className="flex items-center justify-between px-2 py-1 group cursor-pointer" 
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 hover:text-foreground uppercase tracking-wider">
                <ChevronRight className={cn("w-3 h-3 transition-transform text-muted-foreground", workspaceOpen && "rotate-90")} />
                <span>Workspace</span>
              </div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setCustomizeOpen(true); 
                }} 
                className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-secondary border border-border/30 rounded"
              >
                <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            
            <AnimatePresence initial={false}>
              {workspaceOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden space-y-0.5 mt-1"
                >
                  {renderItem('Projects', Target, '/dashboard/projects', config.projects)}
                  {renderItem('Views', LayoutGrid, '/dashboard/views', config.views)}
                  {renderItem('Sprint Cycles', CalendarDays, '/dashboard/sprints', 'Always show')}
                  {renderItem('Roadmaps', Map, '/dashboard/roadmaps', 'Always show')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Your teams */}
          <div>
            <div 
              className="flex items-center justify-between px-2 py-1 group cursor-pointer" 
              onClick={() => setTeamsOpen(!teamsOpen)}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 hover:text-foreground uppercase tracking-wider">
                <ChevronRight className={cn("w-3 h-3 transition-transform text-muted-foreground", teamsOpen && "rotate-90")} />
                <span>Your teams</span>
              </div>
            </div>
            
            <AnimatePresence initial={false}>
              {teamsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden mt-1 space-y-1"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-semibold text-foreground/90 bg-secondary/25 border border-border/20">
                    <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-500 font-bold shrink-0">
                      D
                    </div>
                    <span className="truncate">devplug</span>
                  </div>
                  <div className="pl-6 space-y-0.5 border-l border-border/40 ml-5">
                    {renderItem('Tasks', ListTodo, '/dashboard/boards', 'Always show')}
                    {renderItem('Projects', Target, '/dashboard/projects', 'Always show')}
                    {renderItem('Views', LayoutGrid, '/dashboard/views', 'Always show')}
                    {renderItem('Teams', Users, '/dashboard/team', 'Always show')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Try */}
          <div>
            <div 
              className="flex items-center justify-between px-2 py-1 group cursor-pointer" 
              onClick={() => setTryOpen(!tryOpen)}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 hover:text-foreground uppercase tracking-wider">
                <ChevronRight className={cn("w-3 h-3 transition-transform text-muted-foreground", tryOpen && "rotate-90")} />
                <span>Invitations</span>
              </div>
            </div>
            
            <AnimatePresence initial={false}>
              {tryOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden mt-1 space-y-0.5"
                >
                  <button 
                    onClick={() => openInviteMemberModal()}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-left"
                  >
                    <Plus className="w-4 h-4 text-muted-foreground/75" />
                    <span>Invite people</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Footer Settings */}
        <div className="p-2 border-t border-border/40 shrink-0 bg-secondary/15">
          <Link 
            to="/dashboard/settings" 
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Settings</span>
          </Link>
        </div>

      </div>

      <CustomizeSidebarModal />
    </>
  );
}
