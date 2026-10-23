import { Navigate, Route, Routes } from 'react-router-dom';
import Demo from './pages/Demo';
import { CopilotPage, DriverPage, NotFound, PanelPage, PosPage } from './pages/RolePages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/demo" replace />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/conductor" element={<DriverPage />} />
      <Route path="/copiloto/:id" element={<CopilotPage />} />
      <Route path="/caja" element={<PosPage />} />
      <Route path="/panel" element={<PanelPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
