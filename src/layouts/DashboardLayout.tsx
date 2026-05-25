import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { TopNavbar } from '../components/TopNavbar';
import { TaskModal } from '../components/board/TaskModal';
import { ProjectModal } from '../components/modals/ProjectModal';
import { InviteMemberModal } from '../components/modals/InviteMemberModal';
import { CreateTaskModal } from '../components/modals/CreateTaskModal';
import { CreateColumnModal } from '../components/modals/CreateColumnModal';
import { SearchModal } from '../components/modals/SearchModal';
import { useUIStore } from '../store/useUIStore';
import { FAB } from '../components/ui/FAB';
import { ToastContainer } from '../components/ui/ToastContainer';
import { initTheme } from '../store/useThemeStore';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSearchModal, openCreateTaskModal } = useUIStore();

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (
        e.key === 'c' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !(e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')
      ) {
        e.preventDefault();
        openCreateTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearchModal, openCreateTaskModal]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-20 flex transform transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>

      <TaskModal />
      <ProjectModal />
      <InviteMemberModal />
      <CreateTaskModal />
      <CreateColumnModal />
      <SearchModal />
      <FAB onClick={() => openCreateTaskModal()} />
      <ToastContainer />
    </div>
  );
}
