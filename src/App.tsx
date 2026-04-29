/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ResourceHub from './pages/ResourceHub';
import HabitTracker from './pages/HabitTracker';
import GoalCenter from './pages/GoalCenter';
import Settings from './pages/Settings';
import { AppProvider } from './context/AppContext';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="resources" element={<ResourceHub />} />
              <Route path="habits" element={<HabitTracker />} />
              <Route path="goals" element={<GoalCenter />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<div className="p-8 text-center text-slate-500">Page not found or under construction.</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
