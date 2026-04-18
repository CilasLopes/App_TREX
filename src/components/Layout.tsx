import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, Trophy, LineChart, CircleDot, Settings, LogOut, User, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useState, useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, notifications, simulateRole } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  // Redirecionar para login se não estiver logado
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null; // Não renderiza nada enquanto redireciona

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/agenda', icon: CalendarDays, label: 'Agenda' },
    { path: '/tabela', icon: Trophy, label: 'Tabela' },
    { path: '/estatisticas', icon: LineChart, label: 'Estatísticas' },
    { path: '/elenco', icon: User, label: 'Elenco' },
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="bg-surface text-textPrimary antialiased min-h-screen pb-20 md:pb-0" onClick={() => showNotifications && setShowNotifications(false)}>
      <header className="fixed top-0 w-full z-50 bg-[#131313] bg-gradient-to-b from-[#1c1b1b] to-transparent shadow-none">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-2">
            <CircleDot className="text-orange-600 w-8 h-8" />
            <h1 className="font-headings font-black uppercase tracking-tighter text-2xl italic text-orange-600">SEM TALENTOS</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-headings font-bold text-xs uppercase tracking-widest cursor-pointer transition-opacity ${
                    location.pathname === item.path ? 'text-primary' : 'text-gray-400 hover:opacity-80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                }}
                className={`p-2 rounded-lg transition-all ${showNotifications ? 'bg-primary text-[#4b1b00]' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#131313] rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div 
                  className="absolute right-0 mt-3 w-72 md:w-80 bg-[#1c1b1b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-white/5 bg-[#2a2a2a]/50">
                    <h3 className="font-headings font-black text-xs uppercase tracking-widest text-gray-400">Notificações</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${n.type === 'push' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                              {n.type === 'push' ? 'ALERTA' : 'SISTEMA'}
                            </span>
                            <span className="text-[8px] text-gray-500 font-bold">{n.date}</span>
                          </div>
                          <p className="text-xs text-gray-200 font-medium leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2 opacity-20" />
                        <p className="text-[10px] text-gray-600 font-bold uppercase">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 bg-[#131313]/50 text-center">
                       <button className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline">Marcar todas como lidas</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Toggle: Only visible if is admin */}
            {isAdmin && (
              <Link to="/admin" className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-primary transition-colors text-gray-400 hover:text-[#4b1b00]" title="Painel Admin">
                <Settings className="w-5 h-5" />
              </Link>
            )}

            {/* Profile Simulator: Only during development or for testing RBAC */}
            <button 
              onClick={() => simulateRole(currentUser?.role === 'admin' ? 'player' : 'admin')}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-primary hidden md:block"
              title="Alternar entre Admin e Atleta"
            >
              Simular {currentUser?.role === 'admin' ? 'Atleta' : 'Admin'}
            </button>

            <div className="flex items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 ${isAdmin ? 'border-primary' : 'border-gray-600'} flex items-center justify-center bg-[#2a2a2a] cursor-pointer hover:opacity-80 transition-opacity`}
                title={currentUser?.name || 'Perfil'}
              >
                {isAdmin ? (
                  <img
                    className="w-full h-full object-cover"
                    alt="Admin Profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT5gxIcbpjHg-biUKOllcDQnwmlQOhLf1fmbLJY_K6GTm0USlTPeJoZgz1zuJQKIFfiTD9hqpork01vJPhi1vaoIw9ZCxU0-V71KDUj4ITJNcYaUTxNE0wNASVmt7_dut-dWgvq0hueKf1oQs_L0b_wgZjiIoco9zZIEFwr8Afh_94Uu1pFjOXfqpNUsagR_imd1wn9jInF1yJRhTAN_YklrUU-Uv3Lq2Gba1tfkpa6BfHwnN6ihoXv2hy0xN838OYt9BWV1OOirug"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Outlet />

      <nav className="fixed bottom-0 w-full z-50 bg-[#131313]/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] md:hidden">
        <div className="flex justify-around items-center h-20 pb-safe px-4">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center rounded-lg px-3 py-1 active:translate-y-0.5 transition-transform ${
                  isActive ? 'text-primary bg-[#2a2a2a]' : 'text-gray-500 hover:text-orange-400'
                }`}
              >
                <div className="mb-1 transition-transform group-hover:scale-110">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-headings font-bold text-[10px] uppercase tracking-widest mt-1">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  );
}
