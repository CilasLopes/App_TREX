import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfaces
export interface Player {
  id: number;
  name: string;
  email?: string;
  password?: string;
  role: 'admin' | 'player';
  team: string;
  goals: number;
  status: 'pago' | 'pendente' | 'atrasado';
  level: number; // 1-5 estrelas
  isAthlete: boolean; // Se participa dos jogos e sorteios
  isBlocked?: boolean; // Se o acesso está suspenso
  birthDate?: string; // Data de nascimento (YYYY-MM-DD)
  totalDebt: number; // Saldo devedor total acumulado
  isVip?: boolean; // Isento de mensalidade
  isGoalkeeper?: boolean; // Se é goleiro
}

export interface CourtSettings {
  name: string;
  address: string;
}

export interface Match {
  id: number;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  court: string;
  status: 'scheduled' | 'finished';
  attendance: number[]; // Lista de IDs dos jogadores confirmados
  mvpId?: number; // ID do Craque do Jogo
  observations?: string; // Observações personalizadas (opcional)
}

interface Notification {
  id: number;
  message: string;
  type: 'push' | 'system';
  show: boolean;
  date?: string;
}

interface AppContextType {
  players: Player[];
  currentUser: Player | null;
  teams: string[];
  matches: Match[];
  monthlyFee: number;
  courtFee: number;
  notification: Notification;
  notifications: Notification[]; // Histórico
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  updatePlayerGoals: (id: number, delta: number) => void;
  assignTeam: (id: number, team: string) => void;
  togglePaymentStatus: (id: number) => void;
  totalIncome: number;
  updateMonthlyFee: (value: number) => void;
  updateCourtFee: (value: number) => void;
  applyMonthlyFeeAll: () => void;
  registerPayment: (id: number, amount: number) => void;
  updatePlayerDebt: (id: number, amount: number) => void;
  triggerPush: (playerName?: string) => void;
  triggerDebtNotification: (playerName: string, debtAmount: number) => void;
  addPlayer: (name: string, isAthlete: boolean, birthDate?: string, level?: number) => void;
  addTeam: (name: string) => void;
  addMatch: (match: Omit<Match, 'id' | 'attendance'>) => void;
  addMatches: (matches: Omit<Match, 'id' | 'attendance'>[]) => void;
  removeMatch: (id: number) => void;
  updateMatchTeams: (id: number, teamA: string, teamB: string) => void;
  finishMatch: (id: number, scoreA: number, scoreB: number, mvpId?: number) => void;
  toggleAthleteStatus: (id: number) => void;
  setAthleteStatus: (id: number, status: boolean) => void;
  toggleBlockStatus: (id: number) => void;
  toggleVipStatus: (id: number) => void;
  toggleGoalkeeperStatus: (id: number) => void;
  deletePlayer: (id: number) => void;
  updatePlayer: (id: number, updates: Partial<Player>) => void;
  togglePresence: (matchId: number) => void;
  updatePlayerLevel: (id: number, level: number) => void;
  autoBalanceTeams: () => void;
  applyLiveSorteio: (assignments: Player[], newMatches: Omit<Match, 'id' | 'attendance'>[]) => void;
  isLiveSorting: boolean;
  setIsLiveSorting: (val: boolean) => void;
  liveSortingResults: {[key: string]: Player[]};
  setLiveSortingResults: (val: {[key: string]: Player[]}) => void;
  activeSortingTeam: string | null;
  setActiveSortingTeam: (val: string | null) => void;
  slotMachineName: string;
  setSlotMachineName: (val: string) => void;
  toggleAdminRole: (id: number) => void;
  lastBilledPeriod: string;
  reorderMatches: (newMatches: Match[]) => void;
  courtSettings: CourtSettings;
  updateCourtSettings: (settings: CourtSettings) => void;
  clearAllData: () => void;
  updateMatch: (id: number, updates: Partial<Match>) => void;
  removeTeam: (name: string) => void;
  resetSeason: () => void;
  simulateRole: (role: 'admin' | 'player') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dados iniciais (Limpos para Produção)
const initialPlayers: Player[] = [
  { id: 1, name: 'Admin Principal', email: 'admin@futsal.com', password: '123', role: 'admin', team: '', goals: 0, status: 'pago', level: 5, isAthlete: true, totalDebt: 0, isGoalkeeper: false },
];

const initialTeams: string[] = [];
const initialMatches: Match[] = [];

const initialCourtSettings: CourtSettings = {
  name: 'Arena Suburbana',
  address: 'Rua do Asfalto, 402 - Setor Industrial. Ponto de encontro habitual nas reuniões semanais.'
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('futsal_players');
      if (!saved) return initialPlayers;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialPlayers;
    } catch (e) {
      return initialPlayers;
    }
  });
  
  const [teams, setTeams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('futsal_teams');
      if (!saved) return initialTeams;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialTeams;
    } catch (e) {
      return initialTeams;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem('futsal_matches');
      if (!saved) return initialMatches;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialMatches;
    } catch (e) {
      return initialMatches;
    }
  });
  
  const [courtSettings, setCourtSettings] = useState<CourtSettings>(() => {
    try {
      const saved = localStorage.getItem('futsal_court_settings');
      return saved ? JSON.parse(saved) : initialCourtSettings;
    } catch (e) {
      return initialCourtSettings;
    }
  });
  
  const [monthlyFee, setMonthlyFee] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('futsal_monthlyFee');
      if (!saved) return 100;
      const parsed = JSON.parse(saved);
      return typeof parsed === 'number' && !isNaN(parsed) ? parsed : 100;
    } catch (e) {
      return 100;
    }
  });

  const [courtFee, setCourtFee] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('futsal_courtFee');
      if (!saved) return 500;
      const parsed = JSON.parse(saved);
      return typeof parsed === 'number' && !isNaN(parsed) ? parsed : 500;
    } catch (e) {
      return 500;
    }
  });

  const [currentUser, setCurrentUser] = useState<Player | null>(() => {
    try {
      const saved = localStorage.getItem('futsal_currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }); 
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLiveSorting, setIsLiveSorting] = useState(false);
  const [liveSortingResults, setLiveSortingResults] = useState<{[key: string]: Player[]}>({});
  const [activeSortingTeam, setActiveSortingTeam] = useState<string | null>(null);
  const [slotMachineName, setSlotMachineName] = useState<string>('');
  const [totalIncome, setTotalIncome] = useState<number>(() => {
    const saved = localStorage.getItem('totalIncome');
    return saved ? parseFloat(saved) : 0;
  });
  const [lastBilledPeriod, setLastBilledPeriod] = useState<string>(() => {
    // Inicializa com o período salvo ou vazio
    return localStorage.getItem('lastBilledPeriod') || '';
  });
  const [notification, setNotification] = useState<Notification>({
    id: 0,
    message: '',
    type: 'push',
    show: false
  });

  // Cross-Tab Sync e Persistência
  useEffect(() => {
    localStorage.setItem('futsal_players', JSON.stringify(players));
    localStorage.setItem('futsal_teams', JSON.stringify(teams));
    localStorage.setItem('futsal_matches', JSON.stringify(matches));
    localStorage.setItem('futsal_monthlyFee', JSON.stringify(monthlyFee));
    localStorage.setItem('futsal_courtFee', JSON.stringify(courtFee));
    localStorage.setItem('futsal_court_settings', JSON.stringify(courtSettings));
    if (currentUser) {
      localStorage.setItem('futsal_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('futsal_currentUser');
    }
  }, [players, teams, matches, monthlyFee, courtFee, courtSettings, currentUser]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'futsal_players' && e.newValue) {
          const p = JSON.parse(e.newValue);
          if(Array.isArray(p)) setPlayers(p);
        }
        if (e.key === 'futsal_teams' && e.newValue) {
          const t = JSON.parse(e.newValue);
          if(Array.isArray(t)) setTeams(t);
        }
        if (e.key === 'futsal_matches' && e.newValue) {
          const m = JSON.parse(e.newValue);
          if(Array.isArray(m)) setMatches(m);
        }
        if (e.key === 'futsal_monthlyFee' && e.newValue) {
          const f = JSON.parse(e.newValue);
          if(typeof f === 'number') setMonthlyFee(f);
        }
        if (e.key === 'futsal_courtFee' && e.newValue) {
          const c = JSON.parse(e.newValue);
          if(typeof c === 'number') setCourtFee(c);
        }
      } catch (error) {
        console.error("Storage sync parse error:", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (email: string, pass: string) => {
    const user = players.find(p => p.email === email && p.password === pass);
    if (user) {
      if (user.isBlocked) return false;
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const updatePlayerGoals = (id: number, delta: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, goals: Math.max(0, p.goals + delta) } : p));
  };

  const assignTeam = (id: number, team: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, team } : p));
  };

  const togglePaymentStatus = (id: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'pago' ? 'pendente' 
          : p.status === 'pendente' ? 'atrasado' 
          : 'pago';
        return { ...p, status: nextStatus as any };
      }
      return p;
    }));
  };

  const updateMonthlyFee = (value: number) => setMonthlyFee(value);
  const updateCourtFee = (value: number) => setCourtFee(value);

  const applyMonthlyFeeAll = () => {
    // Cobra mensalidade de TODOS os membros, exceto VIPs
    setPlayers(prev => prev.map(p => p.isVip ? p : { ...p, totalDebt: Number((p.totalDebt + monthlyFee).toFixed(2)) }));
    const period = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    setLastBilledPeriod(period);
    localStorage.setItem('lastBilledPeriod', period);
  };

  const registerPayment = (id: number, amount: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, totalDebt: Math.max(0, Number((p.totalDebt - amount).toFixed(2))) } : p));
    setTotalIncome(prev => {
      const newIncome = Number((prev + amount).toFixed(2));
      localStorage.setItem('totalIncome', newIncome.toString());
      return newIncome;
    });
  };

  const updatePlayerDebt = (id: number, amount: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, totalDebt: Number(amount.toFixed(2)) } : p));
  };

  // Auto-Billing Check — roda apenas uma vez ao montar, verifica o mês no localStorage
  React.useEffect(() => {
    const currentPeriod = new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    const savedPeriod = localStorage.getItem('lastBilledPeriod') || '';
    if (savedPeriod !== currentPeriod) {
      // Lança cobrança para TODOS os membros, exceto VIPs
      setPlayers(prev => prev.map(p => p.isVip ? p : { ...p, totalDebt: Number((p.totalDebt + monthlyFee).toFixed(2)) }));
      setLastBilledPeriod(currentPeriod);
      localStorage.setItem('lastBilledPeriod', currentPeriod);
    }
  }, [monthlyFee]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerPush = (playerName?: string) => {
    const notifyMsg = playerName ? `${playerName} confirmou presença!` : 'O sorteio inteligente começou! Acompanhe no seu painel.';
    const notification = { 
      id: Date.now(), 
      message: notifyMsg, 
      type: 'push' as const, 
      show: true,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotification(notification);
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
  };

  const triggerDebtNotification = (playerName: string, debtAmount: number) => {
    const msg = `⚠️ ${playerName} está com R$ ${debtAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em aberto. Regularize sua mensalidade!`;
    const notification = {
      id: Date.now(),
      message: msg,
      type: 'push' as const,
      show: true,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotification(notification);
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
  };

  const addPlayer = (name: string, isAthlete: boolean, birthDate?: string, level: number = 3) => {
    const newPlayer: Player = {
      id: players.length + 1,
      name,
      role: 'player',
      team: '', 
      goals: 0, 
      status: 'pendente',
      level,
      isAthlete,
      birthDate,
      totalDebt: monthlyFee // Já entra devendo o mês atual
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const toggleAthleteStatus = (id: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, isAthlete: !p.isAthlete } : p));
  };

  const setAthleteStatus = (id: number, isAthlete: boolean) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, isAthlete } : p));
  };

  const toggleBlockStatus = (id: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, isBlocked: !p.isBlocked } : p));
  };

  const toggleVipStatus = (id: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        const becomingVip = !p.isVip;
        // Se virar VIP, zerar a dívida automaticamente
        return { ...p, isVip: becomingVip, totalDebt: becomingVip ? 0 : p.totalDebt };
      }
      return p;
    }));
  };

  const toggleGoalkeeperStatus = (id: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, isGoalkeeper: !p.isGoalkeeper } : p));
  };

  const deletePlayer = (id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayer = (id: number, updates: Partial<Player>) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addTeam = (name: string) => {
    if (!teams.includes(name)) setTeams(prev => [...prev, name]);
  };

  const addMatch = (match: Omit<Match, 'id' | 'attendance'>) => {
    setMatches(prev => [...prev, { ...match, id: Date.now(), attendance: [] }]);
  };

  const addMatches = (newMatches: Omit<Match, 'id' | 'attendance'>[]) => {
    const startId = Date.now();
    const matchesWithIds: Match[] = newMatches.map((m, idx) => ({
      ...m,
      id: startId + idx,
      attendance: []
    }));
    setMatches(prev => [...prev, ...matchesWithIds]);
  };

  const removeMatch = (id: number) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const updateMatchTeams = (id: number, teamA: string, teamB: string) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, teamA, teamB } : m));
  };

  const finishMatch = (id: number, scoreA: number, scoreB: number, mvpId?: number) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, scoreA, scoreB, status: 'finished', mvpId } : m));
  };

  const togglePresence = (matchId: number) => {
    if (!currentUser) return;
    setMatches(prev => {
      const isSelected = prev.find(m => m.id === matchId)?.attendance.includes(currentUser.id);
      if (!isSelected) triggerPush(currentUser.name);
      
      return prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            attendance: isSelected 
              ? m.attendance.filter(id => id !== currentUser.id)
              : [...m.attendance, currentUser.id]
          };
        }
        return m;
      });
    });
  };

  const updatePlayerLevel = (id: number, level: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, level } : p));
  };

  const autoBalanceTeams = () => {
    if (teams.length < 2) return;
    
    const sorted = [...players].sort((a, b) => b.level - a.level);
    const newPlayers = [...players];
    
    sorted.forEach((player, index) => {
      const teamIndex = index % teams.length;
      const targetPlayerIndex = newPlayers.findIndex(p => p.id === player.id);
      newPlayers[targetPlayerIndex] = { ...newPlayers[targetPlayerIndex], team: teams[teamIndex] };
    });
    
    setPlayers(newPlayers);
    const notification = {
      id: Date.now(),
      message: 'Sorteio inteligente realizado com sucesso!',
      type: 'system' as const,
      show: true,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotification(notification);
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const applyLiveSorteio = (assignments: Player[], newMatches: Omit<Match, 'id' | 'attendance'>[]) => {
    // Atualiza os jogadores
    setPlayers(assignments);
    
    // Adiciona as novas partidas
    const matchesToAdd: Match[] = newMatches.map(m => ({
      ...m,
      id: Date.now() + Math.random(),
      attendance: []
    }));
    setMatches(prev => [...prev, ...matchesToAdd]);
    
    // Notifica
    const notification = {
      id: Date.now(),
      message: 'Sorteio confirmado e jogos agendados!',
      type: 'system' as const,
      show: true,
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setNotification(notification);
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setIsLiveSorting(false);
    
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const toggleAdminRole = (id: number) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, role: p.role === 'admin' ? 'player' : 'admin' } : p));
    // Se o usuário logado teve seu papel alterado, atualiza o currentUser também
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, role: prev.role === 'admin' ? 'player' : 'admin' } : null);
    }
  };

  const simulateRole = (role: 'admin' | 'player') => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
      const msg = `Papel simulado: ${role === 'admin' ? 'Administrador' : 'Atleta'}`;
      const notification = {
        id: Date.now(),
        message: msg,
        type: 'system' as const,
        show: true,
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setNotification(notification);
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
    }
  };

  return (
    <AppContext.Provider value={{ 
      players, 
      currentUser,
      teams,
      matches,
      monthlyFee,
      courtFee,
      totalIncome,
      lastBilledPeriod,
      updateMonthlyFee,
      updateCourtFee,
      applyMonthlyFeeAll,
      registerPayment,
      updatePlayerDebt,
      triggerPush,
      triggerDebtNotification,
      logout,
      updatePlayerGoals, 
      assignTeam, 
      togglePaymentStatus, 
      notification, 
      notifications,
      login,
      addPlayer,
      addTeam,
      addMatch,
      addMatches,
      removeMatch,
      updateMatchTeams,
      finishMatch,
      toggleAdminRole,
      togglePresence,
      updatePlayerLevel,
      autoBalanceTeams,
      applyLiveSorteio,
      isLiveSorting,
      setIsLiveSorting,
      liveSortingResults,
      setLiveSortingResults,
      activeSortingTeam,
      setActiveSortingTeam,
      slotMachineName,
      setSlotMachineName,
      toggleAthleteStatus,
      setAthleteStatus,
      toggleBlockStatus,
      toggleVipStatus,
      toggleGoalkeeperStatus,
      deletePlayer,
      updatePlayer,
      reorderMatches: (newList: Match[]) => setMatches(newList),
      courtSettings,
      updateCourtSettings: (settings: CourtSettings) => setCourtSettings(settings),
      clearAllData: () => {
        if (window.confirm('⚠️ ATENÇÃO: Isso apagará TODOS os dados salvos localmente (jogadores, partidas, financeiro) e resetará o sistema. Deseja continuar?')) {
          localStorage.clear();
          window.location.href = '/';
        }
      },
      updateMatch: (id: number, updates: Partial<Match>) => {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
      },
      removeTeam: (name: string) => {
        setTeams(prev => prev.filter(t => t !== name));
      },
      resetSeason: () => {
        if (window.confirm('🏆 FINALIZAR TEMPORADA: Isso zerará a artilharia (gols) e limpará todos os jogos da agenda. Seus jogadores e times continuarão salvos. Deseja continuar?')) {
          setPlayers(prev => prev.map(p => ({ ...p, goals: 0 })));
          setMatches([]);
        }
      },
      simulateRole
    }}>
      {children}
      
      {notification.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="bg-[#1c1b1b]/95 backdrop-blur-md border-l-4 border-primary p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">!</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">SEM TALENTOS | PWA</p>
              <p className="text-sm font-bold text-white">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
