import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { TaskModal } from '../components/board/TaskModal';
import { ProjectModal } from '../components/modals/ProjectModal';
import { InviteMemberModal } from '../components/modals/InviteMemberModal';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { CreateColumnModal } from '../components/modals/CreateColumnModal';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-20 flex transform transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar 
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          toggleTheme={toggleTheme}
          isDark={isDark}
        />
        
        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <ProjectModal />
      <InviteMemberModal />
      <CreateTaskModal />
      <CreateColumnModal />
    </div>
  );
}
