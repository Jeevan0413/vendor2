import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Procurement from './pages/Procurement';
import Contracts from './pages/Contracts';
import Invoices from './pages/Invoices';
import Performance from './pages/Performance';
import RiskCompliance from './pages/RiskCompliance';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="procurement" element={<Procurement />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="performance" element={<Performance />} />
          <Route path="risk-compliance" element={<RiskCompliance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
