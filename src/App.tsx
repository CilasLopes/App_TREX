import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Agenda from './pages/Agenda';
import Tabela from './pages/Tabela';
import Estatisticas from './pages/Estatisticas';
import Admin from './pages/Admin';
import Elenco from './pages/Elenco';
import InstallPrompt from './components/InstallPrompt';

import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <InstallPrompt />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="tabela" element={<Tabela />} />
            <Route path="estatisticas" element={<Estatisticas />} />
            <Route path="elenco" element={<Elenco />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
