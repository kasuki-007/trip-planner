import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/AppLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TripOverviewPage } from '../pages/TripOverviewPage';
import { ItineraryPage } from '../pages/ItineraryPage';
import { ChecklistsPage } from '../pages/ChecklistsPage';
import { FilesPage } from '../pages/FilesPage';
import { BudgetPage } from '../pages/BudgetPage';
import { MembersPage } from '../pages/MembersPage';
import { TripSettingsPage } from '../pages/TripSettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/trips/:id', element: <TripOverviewPage /> },
          { path: '/trips/:id/itinerary', element: <ItineraryPage /> },
          { path: '/trips/:id/checklists', element: <ChecklistsPage /> },
          { path: '/trips/:id/files', element: <FilesPage /> },
          { path: '/trips/:id/budget', element: <BudgetPage /> },
          { path: '/trips/:id/members', element: <MembersPage /> },
          { path: '/trips/:id/settings', element: <TripSettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
