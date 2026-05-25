import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OTPVerificationPage } from './pages/OTPVerificationPage';
import { DashboardHomePage } from './pages/DashboardHomePage';
import { InboxPage } from './pages/InboxPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { DraftsPage } from './pages/DraftsPage';
import { ViewsPage } from './pages/ViewsPage';
import { SprintPage } from './pages/SprintPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BoardPage } from './pages/BoardPage';
import { CalendarPage } from './pages/CalendarPage';
import { TeamPage } from './pages/TeamPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-otp" element={<OTPVerificationPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="boards" element={<BoardPage />} />
          <Route path="tasks" element={<BoardPage />} /> {/* Forward tasks to board for now */}
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="my-tasks" element={<MyTasksPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="views" element={<ViewsPage />} />
          <Route path="sprints" element={<SprintPage />} />
          <Route path="roadmaps" element={<RoadmapPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
