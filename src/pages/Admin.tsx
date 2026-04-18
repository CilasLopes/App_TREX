import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  UserCheck, 
  Users, 
  Trophy, 
  Goal, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Unlock,
  BellRing,
  Calendar,
  Plus,
  Trash2,
  Check,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Star,
  Edit3,
  Wand2,
  CalendarRange,
  Printer,
  Crown,
  GripVertical
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Player, Match } from '../context/AppContext';

export default function Admin() {
  const navigate = useNavigate();
  const { 
    players, 
    currentUser,
    teams,
    matches,
    monthlyFee,
    courtFee,
    totalIncome,
    updatePlayerGoals, 
    assignTeam, 
    applyMonthlyFeeAll,
    registerPayment,
    updatePlayerDebt,
    updateMonthlyFee,
    updateCourtFee,
    triggerDebtNotification,
    addPlayer,
    addTeam,
    addMatch,
    addMatches,
    removeMatch,
    finishMatch,
    toggleAdminRole,
    deletePlayer,
    updatePlayer,
    reorderMatches,
    courtSettings,
    updateCourtSettings,
    toggleBlockStatus,
    toggleVipStatus,
    updateMatch,
    activeSortingTeam,
    clearAllData,
    removeTeam,
    resetSeason: contextResetSeason
  } = useAppContext();

  const handleResetSeason = () => {
    if (window.confirm('Deseja realmente finalizar esta temporada? Isso zerará a artilharia e limpará todos os jogos (passados e futuros). Os times e jogadores não serão alterados.')) {
      contextResetSeason();
      setPreviewMatches([]);
      setPlannerSelectedTeams([]);
      setToastMessage('Temporada finalizada! Artilharia e agenda resetadas.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const [confirmDeletePlayerId, setConfirmDeletePlayerId] = useState<number | null>(null);

  // Scroll automático para o time sendo sorteado
  useEffect(() => {
    if (activeSortingTeam) {
      const element = document.getElementById(`team-card-${activeSortingTeam}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeSortingTeam]);
  
  // Proteção de Rota: Redireciona se não for admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const [activeTab, setActiveTab] = useState<'finance' | 'league' | 'players' | 'agenda' | 'users'>('finance');
  const [toastMessage, setToastMessage] = useState('');
  const [selectingMVPFor, setSelectingMVPFor] = useState<number | null>(null);
  const [memberStatusEditing, setMemberStatusEditing] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editIsAthlete, setEditIsAthlete] = useState(true);
  const [editLevel, setEditLevel] = useState(3);
  
  
  // Local Form states
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerIsAthlete, setNewPlayerIsAthlete] = useState(true);
  const [newPlayerLevel, setNewPlayerLevel] = useState(3);
  const [newPlayerBirthDate, setNewPlayerBirthDate] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  
  // Court Settings states
  const [courtName, setCourtName] = useState(courtSettings.name);
  const [courtAddress, setCourtAddress] = useState(courtSettings.address);
  
  // Match Form states
  const [mTeamA, setMTeamA] = useState('');
  const [mTeamB, setMTeamB] = useState('');
  const [mDate, setMDate] = useState('HOJE');
  const [mTime, setMTime] = useState('20:30');
  const [mCourt, setMCourt] = useState('');
  const [mObservations, setMObservations] = useState('');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [plannerCourt, setPlannerCourt] = useState('');

  // Season Planner States
  const [plannerSelectedTeams, setPlannerSelectedTeams] = useState<string[]>([]);
  const [plannerStartDate, setPlannerStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannerGameDay, setPlannerGameDay] = useState(4); // Default: Quinta (4)
  const [plannerStartTime, setPlannerStartTime] = useState('20:30'); 
  const [plannerMatchDuration, setPlannerMatchDuration] = useState(60); // Novo: Duração em minutos
  const [previewMatches, setPreviewMatches] = useState<any[]>([]);

  // Finance Filter
  const [financeFilter, setFinanceFilter] = useState<'all' | 'pago' | 'pendente'>('all');

  // Finance Modal States
  const [paymentModal, setPaymentModal] = useState<{ player: any; amount: number } | null>(null);
  const [debtEditModal, setDebtEditModal] = useState<{ player: any; value: string } | null>(null);

  // Match Finish States
  const [mScoreA, setMScoreA] = useState<number>(0);
  const [mScoreB, setMScoreB] = useState<number>(0);
  
  useEffect(() => {
    if (memberStatusEditing) {
      setEditLevel(memberStatusEditing.level || 3);
    }
  }, [memberStatusEditing]);
  
  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [confirmDeleteMatchId, setConfirmDeleteMatchId] = useState<number | null>(null);

  const handleSortSaved = (toIndex: number) => {
    if (draggedIndex === null) return;
    const scheduled = matches.filter(m => m.status === 'scheduled');
    const finished = matches.filter(m => m.status === 'finished');
    const items = [...scheduled];
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(toIndex, 0, reorderedItem);
    reorderMatches([...items, ...finished]);
    setDraggedIndex(null);
  };

  const handleSortPreview = (toIndex: number) => {
    if (draggedIndex === null) return;
    const items = [...previewMatches];
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(toIndex, 0, reorderedItem);
    setPreviewMatches(items);
    setDraggedIndex(null);
  };

  const [draggedTeam, setDraggedTeam] = useState<{ matchId: number | string, side: 'teamA' | 'teamB' } | null>(null);

  const handleSwapTeamsSaved = (targetMatchId: number, targetSide: 'teamA' | 'teamB') => {
    if (!draggedTeam) return;
    const { matchId: sourceId, side: sourceSide } = draggedTeam;
    if (sourceId === targetMatchId && sourceSide === targetSide) return;

    const newMatches = [...matches];
    const sIdx = newMatches.findIndex(m => m.id === sourceId);
    const tIdx = newMatches.findIndex(m => m.id === targetMatchId);

    if (sIdx !== -1 && tIdx !== -1) {
      const temp = newMatches[sIdx][sourceSide as 'teamA' | 'teamB'];
      newMatches[sIdx][sourceSide as 'teamA' | 'teamB'] = newMatches[tIdx][targetSide];
      newMatches[tIdx][targetSide] = temp;
      reorderMatches(newMatches);
    }
    setDraggedTeam(null);
  };

  const handleSwapTeamsPreview = (targetIdx: number, targetSide: 'teamA' | 'teamB') => {
    if (!draggedTeam || typeof draggedTeam.matchId !== 'number') return;
    const sourceIdx = draggedTeam.matchId;
    const sourceSide = draggedTeam.side;
    if (sourceIdx === targetIdx && sourceSide === targetSide) return;

    const newPreview = [...previewMatches];
    const temp = newPreview[sourceIdx][sourceSide];
    newPreview[sourceIdx][sourceSide] = newPreview[targetIdx][targetSide];
    newPreview[targetIdx][targetSide] = temp;
    setPreviewMatches(newPreview);
    setDraggedTeam(null);
  };

  const generateSeasonTable = () => {
    if (plannerSelectedTeams.length < 2) {
      setToastMessage('Selecione pelo menos 2 times!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const t = [...plannerSelectedTeams];
    if (t.length % 2 !== 0) t.push('FOLGA'); // Dummy team for odd numbers

    const n = t.length;
    const rounds = n - 1;
    const matchesPerRound = n / 2;
    const generatedMatches: any[] = [];
    
    let currentDate = new Date(plannerStartDate + 'T' + plannerStartTime);
    // Ajustar para o primeiro dia de jogo selecionado
    while (currentDate.getDay() !== plannerGameDay) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const teamsList = [...t];

    for (let r = 0; r < rounds; r++) {
      let roundTime = new Date(currentDate); // Reinicia o horário para o início da rodada
      
      for (let m = 0; m < matchesPerRound; m++) {
        const teamA = teamsList[m];
        const teamB = teamsList[n - 1 - m];

        if (teamA !== 'FOLGA' && teamB !== 'FOLGA') {
          generatedMatches.push({
            date: currentDate.toLocaleDateString('pt-BR'),
            rawDate: new Date(currentDate),
            time: roundTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            teamA,
            teamB,
            scoreA: null,
            scoreB: null,
            court: plannerCourt || 'Quadra A',
            status: 'scheduled'
          });
          
          // Incrementa o horário para o próximo jogo da mesma rodada
          roundTime.setMinutes(roundTime.getMinutes() + plannerMatchDuration);
        }
      }
      
      // Rotacionar times
      teamsList.splice(1, 0, teamsList.pop()!);
      // Avançar uma semana
      currentDate.setDate(currentDate.getDate() + 7);
    }

    setPreviewMatches(prev => [...prev, ...generatedMatches]);
    setToastMessage(`Tabela com ${generatedMatches.length} jogos gerada e adicionada à prévia!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateCourtSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourtSettings({ name: courtName, address: courtAddress });
    setToastMessage('Local atualizado com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) {
      setToastMessage('Informe o nome!');
      return;
    }
    addPlayer(newPlayerName, newPlayerIsAthlete, newPlayerBirthDate, newPlayerLevel);
    setNewPlayerName('');
    setNewPlayerBirthDate('');
    setNewPlayerLevel(3);
    setToastMessage(newPlayerIsAthlete ? 'Atleta contratado!' : 'Usuário cadastrado!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    addTeam(newTeamName);
    setNewTeamName('');
    setToastMessage('Time cadastrado!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTeamA || !mTeamB || mTeamA === mTeamB) {
      setToastMessage('Selecione times diferentes!');
      return;
    }
    addMatch({
      date: mDate,
      time: mTime,
      teamA: mTeamA,
      teamB: mTeamB,
      scoreA: null,
      scoreB: null,
      court: mCourt,
      status: 'scheduled',
      observations: mObservations
    });
    setMObservations('');
    setToastMessage('Jogo agendado!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const totals = {
    expected: players.length * monthlyFee, // Mensalidades apenas do mês atual (estimativa)
    paid: totalIncome, // Receita total histórica guardada no contexto
    debt: players.reduce((acc, p) => acc + p.totalDebt, 0) // Soma de todos os débitos pendentes
  };

  return (
    <main className="pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto font-sans">
      
      {/* Page Header */}
      <section className="mb-8 relative overflow-hidden rounded-xl bg-[#1c1b1b] p-8 border-l-4 border-gray-600 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-headings font-bold text-gray-400 uppercase tracking-[0.2em] text-xs mb-2">Central do Organizador</p>
            <h2 className="font-headings font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white">
              Painel Admin
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'finance', icon: CreditCard, label: 'Financeiro' },
              { id: 'agenda', icon: Calendar, label: 'Agenda' },
              { id: 'players', icon: Users, label: 'Elencos' },
              { id: 'league', icon: Trophy, label: 'Liga' },
              { id: 'users', icon: Shield, label: 'Usuários' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 md:px-6 py-3 rounded-lg font-headings font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-primary text-[#4b1b00] scale-105 shadow-lg shadow-primary/20' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FINANCE TAB */}
      {activeTab === 'finance' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">Gestão Financeira</h3>
              <p className="text-gray-400 text-sm font-medium">Controle de mensalidades, despesas da quadra e saldo.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Mensalidade</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary">R$</span>
                  <input 
                    type="number" 
                    value={monthlyFee} 
                    onChange={(e) => updateMonthlyFee(parseInt(e.target.value) || 0)}
                    className="bg-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-lg font-headings font-bold w-32 outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Custo Quadra</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-red-400">R$</span>
                  <input 
                    type="number" 
                    value={courtFee} 
                    onChange={(e) => updateCourtFee(parseInt(e.target.value) || 0)}
                    className="bg-[#2a2a2a] text-white pl-10 pr-4 py-2.5 rounded-lg font-headings font-bold w-32 outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Lançamento</label>
                <button 
                  onClick={() => {
                    if (window.confirm('Deseja lançar a mensalidade de R$ ' + monthlyFee + ' para TODOS os atletas?')) {
                      applyMonthlyFeeAll();
                      setToastMessage('Mensalidades lançadas!');
                      setTimeout(() => setToastMessage(''), 3000);
                    }
                  }}
                  className="bg-orange-500/10 text-orange-400 p-2.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase h-[42px]"
                >
                  <Wand2 className="w-4 h-4" /> Lançar Mês
                </button>
              </div>
              <div className="flex flex-col gap-1 h-full justify-end">
                <button 
                  onClick={() => window.print()}
                  className="bg-white text-black px-6 py-2.5 rounded-lg hover:bg-primary hover:text-[#341100] transition-all flex items-center gap-2 font-black text-xs uppercase shadow-lg mb-[2px]"
                >
                  <Printer className="w-4 h-4" /> Relatório
                </button>
              </div>
              <div className="flex flex-col gap-1 h-full justify-end">
                <button 
                  onClick={handleResetSeason}
                  className="bg-primary/10 text-primary p-2.5 rounded-lg hover:bg-primary hover:text-[#4b1b00] transition-all flex items-center gap-2 font-black text-[10px] uppercase h-[42px]"
                  title="Zerar gols e agenda para nova temporada"
                >
                  <Trophy className="w-4 h-4" /> Finalizar Temporada 
                </button>
              </div>
              <div className="flex flex-col gap-1 h-full justify-end">
                <button 
                  onClick={clearAllData}
                  className="bg-red-500/10 text-red-500 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase h-[42px]"
                  title="Reset Total do Sistema"
                >
                  <Trash2 className="w-4 h-4" /> Reset 
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1c1b1b] p-5 rounded-xl border border-white/5 shadow-xl">
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] mb-1">Entrada Total</p>
              <p className="text-2xl font-black text-white">R$ {totals.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[#1c1b1b] p-5 rounded-xl border border-white/5 shadow-xl">
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] mb-1">Custo Quadra</p>
              <p className="text-2xl font-black text-red-400">R$ {courtFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-[#1c1b1b] p-5 rounded-xl border-2 border-primary shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rotate-45 translate-x-8 -translate-y-8"></div>
              <p className="text-primary font-bold text-[9px] uppercase tracking-[0.2em] mb-1">Saldo Líquido (Caixa)</p>
              <p className={`text-2xl font-black ${totalIncome - courtFee >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                R$ {(totalIncome - courtFee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-[#1c1b1b] p-5 rounded-xl border border-white/5 shadow-xl opacity-60">
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] mb-1">A Receber</p>
              <p className="text-2xl font-black text-yellow-400">R$ {totals.debt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 print:hidden">
            <button 
              onClick={() => setFinanceFilter('all')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${financeFilter === 'all' ? 'bg-primary text-[#341100]' : 'bg-[#1c1b1b] text-gray-500 hover:text-white border border-white/5'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFinanceFilter('pago')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${financeFilter === 'pago' ? 'bg-green-500 text-[#0a250d]' : 'bg-[#1c1b1b] text-gray-500 hover:text-white border border-white/5'}`}
            >
              Pagos
            </button>
            <button 
              onClick={() => setFinanceFilter('pendente')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${financeFilter === 'pendente' ? 'bg-red-500 text-white' : 'bg-[#1c1b1b] text-gray-500 hover:text-white border border-white/5'}`}
            >
              Devedores
            </button>
          </div>

          <div className="bg-[#1c1b1b] rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <div className="overflow-x-auto text-nowrap">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2a2a2a] border-b border-white/10">
                    <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Membro</th>
                    <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Valor Devido</th>
                    <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Status</th>
                    <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-right text-gray-500">Controle</th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .filter(p => !p.isVip) // VIPs estão isentos — não aparecem na cobrança
                    .filter(p => {
                      if (financeFilter === 'all') return true;
                      if (financeFilter === 'pago') return p.totalDebt === 0;
                      if (financeFilter === 'pendente') return p.totalDebt > 0;
                      return true;
                    })
                    .map(player => (
                    <tr key={player.id} className="border-b border-white/5 hover:bg-[#201f1f] transition-colors group">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-white/10 group-hover:border-primary/50">
                          {player.isAthlete 
                            ? <UserCheck className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            : <User className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                          }
                        </div>
                        <div>
                          <span className="font-bold text-sm uppercase">{player.name}</span>
                          <span className={`block text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                            player.isAthlete ? 'text-primary/70' : 'text-blue-400/70'
                          }`}>
                            {player.isAthlete ? '⚽ Atleta' : '👤 Usuário'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => setDebtEditModal({ player, value: player.totalDebt.toString() })}
                          className="text-sm text-gray-300 font-medium hover:text-primary transition-all flex items-center gap-1"
                        >
                          R$ {player.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <Edit3 className="w-3 h-3 text-gray-600" />
                        </button>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full border ${
                          player.totalDebt === 0 ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                          player.totalDebt > monthlyFee ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {player.totalDebt === 0 ? 'pago' : player.totalDebt > monthlyFee ? 'atrasado' : 'pendente'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        {player.totalDebt > 0 && (
                          <>
                            <button 
                              onClick={() => triggerDebtNotification(player.name, player.totalDebt)}
                              title="Enviar notificação de cobrança"
                              className="p-2 rounded-lg bg-[#2a2a2a] text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all"
                            >
                              <BellRing className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setPaymentModal({ player, amount: Math.min(player.totalDebt, monthlyFee) })}
                              className="p-2 rounded-lg bg-green-500 text-[#0a250d] hover:bg-green-400 transition-all flex items-center gap-1 font-black text-[9px] uppercase pr-3"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Pagar 01 Mês
                            </button>
                          </>
                        )}
                        {player.totalDebt === 0 && <CheckCircle2 className="w-5 h-5 text-green-500/30" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Modal: Confirmar Pagamento */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Confirmar Pagamento</p>
                <p className="text-white font-bold">{paymentModal.player.name}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Registrar pagamento de <span className="text-green-400 font-bold">R$ {paymentModal.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> (1 mensalidade)?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#2a2a2a] text-gray-400 font-bold text-sm hover:bg-[#333] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  registerPayment(paymentModal.player.id, paymentModal.amount);
                  setToastMessage('Pagamento registrado!');
                  setTimeout(() => setToastMessage(''), 3000);
                  setPaymentModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-green-500 text-[#0a250d] font-black text-sm hover:bg-green-400 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Dívida */}
      {debtEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ajustar Dívida</p>
                <p className="text-white font-bold">{debtEditModal.player.name}</p>
              </div>
            </div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Novo valor da dívida (R$)</label>
            <input
              type="number"
              min="0"
              value={debtEditModal.value}
              onChange={(e) => setDebtEditModal({ ...debtEditModal, value: e.target.value })}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl p-3 text-white font-bold text-lg mb-4 focus:outline-none focus:border-primary"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDebtEditModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#2a2a2a] text-gray-400 font-bold text-sm hover:bg-[#333] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  updatePlayerDebt(debtEditModal.player.id, parseFloat(debtEditModal.value) || 0);
                  setToastMessage('Dívida atualizada!');
                  setTimeout(() => setToastMessage(''), 3000);
                  setDebtEditModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-[#341100] font-black text-sm hover:opacity-90 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AGENDA TAB */}
      {activeTab === 'agenda' && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Gestão de Rodadas</h3>
              <p className="text-gray-400 text-sm font-medium">Agende as partidas semanais ou mensais.</p>
            </div>
          </div>

          {/* NOVO: Configurações do Local */}
          <div className="bg-[#1c1b1b] p-6 rounded-xl border border-white/5 shadow-xl">
             <h4 className="font-headings font-black text-xl uppercase italic mb-4 flex items-center gap-2 text-primary">
                Configurações do Local
             </h4>
             <form onSubmit={handleUpdateCourtSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-1">
                   <label className="text-[10px] font-bold uppercase text-gray-500">Nome da Quadra / Arena</label>
                   <input 
                      type="text" 
                      value={courtName} 
                      onChange={(e) => setCourtName(e.target.value)}
                      placeholder="Ex: Arena Suburbana"
                      className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white uppercase focus:ring-1 focus:ring-primary outline-none"
                   />
                </div>
                <div className="md:col-span-1 space-y-1">
                   <label className="text-[10px] font-bold uppercase text-gray-500">Endereço / Referência</label>
                   <input 
                      type="text" 
                      value={courtAddress} 
                      onChange={(e) => setCourtAddress(e.target.value)}
                      placeholder="Rua, Número, Bairro..."
                      className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white focus:ring-1 focus:ring-primary outline-none"
                   />
                </div>
                <div className="flex items-end">
                   <button type="submit" className="w-full h-[42px] bg-primary text-[#4b1b00] rounded-lg font-headings font-black uppercase text-[10px] tracking-widest hover:scale-95 transition-all">
                      Atualizar Local
                   </button>
                </div>
             </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleAddMatchSubmit} className="lg:col-span-1 bg-[#1c1b1b] p-6 rounded-xl border border-white/5 space-y-4 shadow-xl">
              <h4 className="font-headings font-black text-xl uppercase italic flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Novo Jogo
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <input 
                      list="teams-list"
                      value={mTeamA} 
                      onChange={(e) => setMTeamA(e.target.value)} 
                      placeholder="Mandante"
                      className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold uppercase text-white outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Visitante (Opcional)</label>
                    <input 
                      list="teams-list"
                      value={mTeamB} 
                      onChange={(e) => setMTeamB(e.target.value)} 
                      placeholder="Visitante"
                      className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold uppercase text-white outline-none focus:ring-1 focus:ring-primary"
                    />
                    <datalist id="teams-list">
                      {teams.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Data (Texto)</label>
                    <input type="text" value={mDate} onChange={(e) => setMDate(e.target.value)} className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white uppercase" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Horário</label>
                    <input type="text" value={mTime} onChange={(e) => setMTime(e.target.value)} className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white uppercase" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Local / Quadra</label>
                  <input 
                    type="text"
                    value={mCourt} 
                    onChange={(e) => setMCourt(e.target.value)}
                    placeholder="Ex: Quadra A, Arena..."
                    className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white uppercase outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Observações (Opcional)</label>
                  <input 
                    type="text" 
                    value={mObservations} 
                    onChange={(e) => setMObservations(e.target.value)} 
                    placeholder="Ex: Jogo da Amizade, Final, etc..."
                    className="w-full bg-[#131313] border-none rounded-lg p-3 text-xs font-bold text-white uppercase placeholder:text-gray-700 focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-[#4b1b00] py-3 rounded-lg font-headings font-black uppercase tracking-tighter hover:scale-95 transition-all mt-2">
                  Agendar Partida
                </button>
              </div>
            </form>

            <div className="lg:col-span-2 bg-[#1c1b1b] rounded-xl border border-white/5 overflow-hidden shadow-xl">
              <div className="p-4 bg-[#2a2a2a] border-b border-white/10">
                <h4 className="font-headings font-black text-sm uppercase tracking-widest text-gray-400">Jogos Programados</h4>
              </div>
              <div className="divide-y divide-white/5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {matches.filter(m => m.status === 'scheduled').map((match, idx) => (
                  <div 
                    key={match.id} 
                    draggable
                    onDragStart={() => setDraggedIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleSortSaved(idx)}
                    className={`p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-[#201f1f] transition-all cursor-move active:opacity-50 ${draggedIndex === idx ? 'opacity-20 bg-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="text-gray-700 group-hover:text-primary transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-center md:items-start flex-1">
                        <div className="flex items-center gap-2 bg-[#131313] p-1 rounded-lg border border-white/5">
                          <input 
                            type="date"
                            value={match.date ? match.date.split('/').reverse().join('-') : ''}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const [y, m, d] = e.target.value.split('-');
                              const formattedDate = `${d}/${m}/${y}`;
                              const newMatches = [...matches];
                              const mIdx = newMatches.findIndex(m => m.id === match.id);
                              if (mIdx !== -1) {
                                newMatches[mIdx].date = formattedDate;
                                reorderMatches(newMatches);
                              }
                            }}
                            className="bg-transparent border-none text-[10px] font-black text-primary uppercase focus:ring-0 p-1 h-auto w-24 cursor-pointer"
                          />
                          <span className="text-gray-700 text-[10px]">—</span>
                          <input 
                            type="time"
                            value={match.time}
                            onChange={(e) => {
                              const newMatches = [...matches];
                              const mIdx = newMatches.findIndex(m => m.id === match.id);
                              if (mIdx !== -1) {
                                newMatches[mIdx].time = e.target.value;
                                reorderMatches(newMatches);
                              }
                            }}
                            className="bg-transparent border-none text-[10px] font-black text-primary uppercase focus:ring-0 p-1 h-auto w-16 cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedTeam({ matchId: match.id, side: 'teamA' });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleSwapTeamsSaved(match.id, 'teamA');
                            }}
                            className="font-headings font-black text-sm md:text-lg uppercase cursor-grab active:cursor-grabbing hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary/30"
                          >
                            {match.teamA}
                          </span>
                          <span className="text-gray-600 italic font-black text-xs">VS</span>
                          <span 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedTeam({ matchId: match.id, side: 'teamB' });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleSwapTeamsSaved(match.id, 'teamB');
                            }}
                            className="font-headings font-black text-sm md:text-lg uppercase cursor-grab active:cursor-grabbing hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary/30"
                          >
                            {match.teamB}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                          {match.court} {match.observations && <span className="text-primary/60 ml-2 italic">— {match.observations}</span>}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingMatch(match)}
                        className="p-2 text-gray-400 hover:bg-white/5 rounded-lg transition-all"
                        title="Editar Detalhes"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const matchToFinish = matches.find(m => m.id === match.id);
                          if (matchToFinish) {
                            setSelectingMVPFor(match.id);
                            setMScoreA(0);
                            setMScoreB(0);
                          }
                        }}
                        className="flex items-center gap-2 bg-[#2a2a2a] text-green-400 px-4 py-2 rounded-lg font-bold text-[10px] uppercase hover:bg-green-500 hover:text-[#0a250d] transition-all"
                      >
                        <Check className="w-3 h-3" /> Finalizar
                      </button>
                      <button 
                         onClick={() => removeMatch(match.id)}
                         className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* USERS MANAGEMENT TAB (NEW) */}
      {activeTab === 'users' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="mb-4">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Gestão de Administradores</h3>
            <p className="text-gray-400 font-medium text-sm">Promova outros membros para ajudar na organização.</p>
          </div>

          <div className="bg-[#1c1b1b] rounded-xl overflow-x-auto shadow-2xl border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-white/10">
                  <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Membro</th>
                  <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500 text-center">Niver</th>
                  <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500 text-center">Tipo</th>
                  <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500 text-center">Papel</th>
                  <th className="p-4 font-headings font-bold text-[10px] uppercase tracking-widest text-right text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id} className={`border-b border-white/5 transition-colors ${currentUser?.id === player.id ? 'bg-primary/5' : 'hover:bg-[#201f1f]'}`}>
                    <td className="p-4 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[#131313] flex items-center justify-center border border-white/10 overflow-hidden relative">
                          {player.isVip 
                            ? <Crown className="w-5 h-5 text-yellow-400" />
                            : player.role === 'admin' 
                              ? <ShieldCheck className="w-5 h-5 text-primary" /> 
                              : <User className="w-5 h-5 text-gray-500" />
                          }
                          {currentUser?.id === player.id && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                               <span className="text-[8px] font-black uppercase text-primary">EU</span>
                            </div>
                          )}
                       </div>
                       <div>
                         <span className="font-bold text-sm uppercase flex items-center gap-2">
                           {player.name}
                           
                         </span>
                         {player.isVip && (
                           <span className="block text-[9px] font-black uppercase tracking-wider text-yellow-400 mt-0.5">👑 VIP — Isento</span>
                         )}
                       </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className="text-[10px] font-black uppercase text-gray-500 italic">
                         {player.birthDate ? new Date(player.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '--/--'}
                       </span>
                    </td>
                    <td className="p-4 text-center">
                       <button 
                         onClick={() => {
                           setMemberStatusEditing(player);
                           setEditName(player.name);
                           setEditBirthDate(player.birthDate || '');
                           setEditIsAthlete(player.isAthlete);
                         }}
                         className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter transition-all ${
                           player.isAthlete ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'bg-gray-800 text-gray-500 border border-white/5'
                         }`}
                       >
                         {player.isAthlete ? 'Atleta' : 'Usuário'}
                       </button>
                    </td>
                    <td className="p-4 text-center">
                       <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-widest ${
                         player.role === 'admin' ? 'bg-primary text-[#341100]' : 'bg-gray-800 text-gray-400'
                       }`}>
                         {player.role}
                       </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                       {currentUser?.id !== player.id && (
                         <>
                           <button
                             onClick={() => {
                               toggleVipStatus(player.id);
                               setToastMessage(player.isVip ? 'VIP removido!' : 'Membro marcado como VIP!');
                               setTimeout(() => setToastMessage(''), 3000);
                             }}
                             className={`p-2 rounded-lg transition-all ${
                               player.isVip
                                 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                                 : 'bg-[#2a2a2a] text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'
                             }`}
                             title={player.isVip ? 'Remover VIP' : 'Tornar VIP (isento de mensalidade)'}
                           >
                             <Crown className="w-4 h-4" />
                           </button>


                           <button 
                              onClick={() => {
                                toggleBlockStatus(player.id);
                                setToastMessage(player.isBlocked ? 'Usuário desbloqueado!' : 'Usuário bloqueado!');
                                setTimeout(() => setToastMessage(''), 3000);
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                player.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                              }`}
                              title={player.isBlocked ? 'Desbloquear' : 'Bloquear'}
                           >
                              {player.isBlocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                           </button>

                           <button 
                              onClick={() => {
                                toggleAdminRole(player.id);
                                setToastMessage(player.role === 'admin' ? 'Acesso Admin removido!' : 'Novo Admin promovido!');
                                setTimeout(() => setToastMessage(''), 3000);
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                player.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400 hover:text-white'
                              }`}
                              title={player.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                           >
                              {player.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                           </button>

                           <button 
                              onClick={() => setConfirmDeletePlayerId(player.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="Excluir"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </>
                       )}
                       {currentUser?.id === player.id && <span className="text-[10px] text-gray-600 italic font-bold pr-2">Sua Conta</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PLAYERS MANAGEMENT TAB */}
      {activeTab === 'players' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">Gestor de Elencos</h3>
            <p className="text-gray-400 font-medium text-xs uppercase tracking-widest">Selecione jogadores e mova-os para os times abaixo.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedPlayerIds(players.filter(p => p.isAthlete).map(p => p.id))}
              className="whitespace-nowrap bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase border border-white/5"
            >
              Selecionar Todos
            </button>
            <button 
              onClick={() => setSelectedPlayerIds([])}
              className="whitespace-nowrap bg-[#2a2a2a] text-gray-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase border border-white/5"
            >
              Limpar Seleção
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.filter(p => p.isAthlete).map(player => {
              const isSelected = selectedPlayerIds.includes(player.id);
              return (
                <div 
                  key={player.id}
                  onClick={() => {
                    if (isSelected) setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== player.id));
                    else setSelectedPlayerIds([...selectedPlayerIds, player.id]);
                  }}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,107,0,0.1)]' 
                      : 'border-white/5 bg-[#1c1b1b] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-white/20'}`}>
                      {isSelected && <Check className="w-4 h-4 text-[#341100]" />}
                    </div>
                    <div>
                      <h4 className={`font-black uppercase text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {player.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          player.team === '' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {player.team || 'Sem Time'}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({length: player.level}).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BARRA FLUTUANTE DE ATRIBUIÇÃO */}
          {selectedPlayerIds.length > 0 && (
            <div className="fixed bottom-24 left-4 right-4 bg-[#1c1b1b] border-2 border-primary/30 rounded-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-[60] animate-in slide-in-from-bottom-10 flex flex-col gap-4 max-w-2xl mx-auto backdrop-blur-xl bg-opacity-95">
               <div className="flex items-center justify-between">
                  <span className="text-white font-black text-xs uppercase tracking-tighter italic">
                    {selectedPlayerIds.length} selecionado(s) • Mover para:
                  </span>
                  <button onClick={() => setSelectedPlayerIds([])} className="text-gray-500 hover:text-white transition-colors">
                     <AlertCircle className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      selectedPlayerIds.forEach(id => assignTeam(id, ''));
                      setSelectedPlayerIds([]);
                      setToastMessage('Jogadores movidos para Sem Time!');
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="bg-[#2a2a2a] hover:bg-red-500/20 text-red-400 font-headings font-black text-[10px] uppercase py-3 rounded-xl border border-white/5 transition-all active:scale-95"
                  >
                    Remover Time
                  </button>
                  {teams.map(team => (
                    <button 
                      key={team}
                      onClick={() => {
                        selectedPlayerIds.forEach(id => assignTeam(id, team));
                        setSelectedPlayerIds([]);
                        setToastMessage(`Jogadores adicionados ao ${team}!`);
                        setTimeout(() => setToastMessage(''), 3000);
                      }}
                      className="bg-primary/10 hover:bg-primary hover:text-[#341100] text-primary font-headings font-black text-[10px] uppercase py-3 rounded-xl border border-primary/20 transition-all active:scale-95"
                    >
                      {team}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </section>
      )}

      {/* LEAGUE MANAGEMENT TAB */}
      {activeTab === 'league' && (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Controle da Liga</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleAddTeamSubmit} className="bg-[#1c1b1b] p-6 md:p-8 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-xl">
              <Users className="absolute -right-6 -top-6 w-32 h-32 text-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-headings font-black text-2xl uppercase italic text-white/90">Novo Time</h4>
                <div className="space-y-4 pt-2">
                  <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Nome: Ex Barca" className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary" />
                  <button type="submit" className="w-full bg-primary text-[#4b1b00] py-3 rounded-lg font-headings font-black uppercase tracking-tighter hover:scale-95 transition-all">Criar Time</button>
                </div>
              </div>
            </form>

            <form onSubmit={handleAddPlayerSubmit} className="bg-[#1c1b1b] p-6 md:p-8 rounded-xl border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-xl">
              <UserCheck className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-headings font-black text-2xl uppercase italic text-white/90">Novo Membro</h4>
                <div className="space-y-4 pt-2">
                  <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Nome ou Apelido" className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none" />
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Data de Nascimento (Opcional)</label>
                    <input 
                      type="date" 
                      value={newPlayerBirthDate} 
                      onChange={(e) => setNewPlayerBirthDate(e.target.value)} 
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs" 
                    />
                  </div>
                  
                  <div className="flex bg-[#131313] p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setNewPlayerIsAthlete(true)}
                      className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${newPlayerIsAthlete ? 'bg-primary text-[#341100]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Atleta
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewPlayerIsAthlete(false)}
                      className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${!newPlayerIsAthlete ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Usuário
                    </button>
                  </div>

                  {newPlayerIsAthlete && (
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Nível Técnico (Estrelas)</label>
                       <div className="flex items-center gap-2 bg-[#131313] p-2 rounded-lg">
                          {[1,2,3,4,5].map(star => (
                             <button
                                key={star}
                                type="button"
                                onClick={() => setNewPlayerLevel(star)}
                                className={`flex-1 py-1 px-2 rounded-md transition-all ${newPlayerLevel >= star ? 'text-primary' : 'text-gray-700'}`}
                             >
                                <Star className={`w-5 h-5 mx-auto ${newPlayerLevel >= star ? 'fill-primary' : ''}`} />
                             </button>
                          ))}
                       </div>
                    </div>
                  )}

                  <button type="submit" className="w-full bg-primary text-[#4b1b00] py-3 rounded-lg font-headings font-black uppercase tracking-tighter hover:scale-95 transition-all mt-2">Cadastrar</button>
                </div>
              </div>
            </form>

            <div className="bg-[#1c1b1b] p-6 md:p-8 rounded-xl border border-white/5 relative overflow-hidden flex flex-col h-full shadow-xl">
              <Goal className="absolute -right-6 -top-6 w-32 h-32 text-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-4 flex-1 flex flex-col">
                <h4 className="font-headings font-black text-2xl uppercase italic text-white/90">Gols da Rodada</h4>
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                  {players.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-[#131313] rounded-lg border border-white/5">
                      <span className="font-bold text-xs uppercase truncate w-24">{player.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updatePlayerGoals(player.id, -1)} className="w-7 h-7 bg-[#2a2a2a] rounded hover:bg-red-500 text-white">-</button>
                        <span className="font-black text-sm text-white">{player.goals}</span>
                        <button onClick={() => updatePlayerGoals(player.id, 1)} className="w-7 h-7 bg-[#2a2a2a] rounded hover:bg-green-500 text-white">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1c1b1b] rounded-2xl border border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-700">
            <div className="p-6 md:p-8 bg-gradient-to-r from-primary/10 to-transparent border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CalendarRange className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Planejador de Temporada</h3>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Gere o mês inteiro de confrontos em segundos</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-primary"></span> 1. Selecione os Times Participantes
                  </h4>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {teams.map(team => {
                      const teamPlayers = players.filter(p => p.team === team && p.isAthlete);
                      const avgLevel = teamPlayers.length > 0 
                        ? (teamPlayers.reduce((acc, p) => acc + p.level, 0) / teamPlayers.length).toFixed(1) 
                        : '0.0';

                      return (
                        <label 
                          key={team} 
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden group ${
                            plannerSelectedTeams.includes(team) ? 'border-primary bg-primary/5 shadow-inner' : 'border-white/5 bg-[#131313] hover:border-white/10'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={plannerSelectedTeams.includes(team)}
                            onChange={(e) => {
                              if (e.target.checked) setPlannerSelectedTeams([...plannerSelectedTeams, team]);
                              else setPlannerSelectedTeams(plannerSelectedTeams.filter(t => t !== team));
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${plannerSelectedTeams.includes(team) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                              {plannerSelectedTeams.includes(team) && <Check className="w-3 h-3 text-[#341100]" />}
                            </div>
                            <span className={`font-headings font-black text-sm uppercase italic ${plannerSelectedTeams.includes(team) ? 'text-white' : 'text-gray-500'}`}>{team}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-1">
                             {teamPlayers.slice(0, 3).map(p => (
                               <span key={p.id} className="text-[7px] font-bold uppercase py-0.5 px-1 bg-white/5 text-gray-400 rounded">
                                 {p.name.split(' ')[0]}
                               </span>
                             ))}
                             {teamPlayers.length > 3 && <span className="text-[7px] text-gray-600 font-bold">+{teamPlayers.length - 3}</span>}
                             {teamPlayers.length === 0 && <span className="text-[7px] text-red-500 font-bold uppercase italic">Sem Jogadores</span>}
                          </div>

                          {teamPlayers.length > 0 && (
                            <div className="absolute bottom-2 right-2 flex flex-col items-end opacity-40">
                               <div className="flex gap-0.5 mb-0.5">
                                 {Array.from({length: 5}).map((_, i) => (
                                   <div key={i} className={`w-1 h-1 rounded-full ${i < Math.round(Number(avgLevel)) ? 'bg-primary' : 'bg-gray-800'}`}></div>
                                 ))}
                               </div>
                               <span className="text-[6px] font-black text-gray-500 uppercase">Nível {avgLevel}</span>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (window.confirm(`Deseja realmente excluir o time "${team}"?`)) {
                                removeTeam(team);
                                setPlannerSelectedTeams(prev => prev.filter(t => t !== team));
                              }
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100"
                            title="Excluir Time"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Data de Início</label>
                    <input 
                      type="date" 
                      value={plannerStartDate} 
                      onChange={(e) => setPlannerStartDate(e.target.value)}
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Dia de Jogo Principal</label>
                    <select 
                      value={plannerGameDay} 
                      onChange={(e) => setPlannerGameDay(parseInt(e.target.value))}
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                    >
                      <option value={1}>Segunda</option>
                      <option value={2}>Terça</option>
                      <option value={3}>Quarta</option>
                      <option value={4}>Quinta</option>
                      <option value={5}>Sexta</option>
                      <option value={6}>Sábado</option>
                      <option value={0}>Domingo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Local da Partida (Opcional)</label>
                    <input 
                      type="text"
                      value={plannerCourt} 
                      onChange={(e) => setPlannerCourt(e.target.value)}
                      placeholder="Ex: Quadra A, Sede, etc..."
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Hora do 1º Jogo</label>
                    <input 
                      type="time" 
                      value={plannerStartTime} 
                      onChange={(e) => setPlannerStartTime(e.target.value)}
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1">Duração (Minutos)</label>
                    <input 
                      type="number" 
                      value={plannerMatchDuration} 
                      onChange={(e) => setPlannerMatchDuration(parseInt(e.target.value))}
                      className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={generateSeasonTable}
                    className="flex-1 bg-[#2a2a2a] text-primary py-4 rounded-xl font-headings font-black text-sm uppercase tracking-tighter hover:bg-primary hover:text-[#341100] transition-all shadow-lg flex items-center justify-center gap-3"
                  >
                    <Wand2 className="w-5 h-5" /> Adicionar à Tabela
                  </button>
                  {previewMatches.length > 0 && (
                    <button 
                      onClick={() => setPreviewMatches([])}
                      className="px-6 bg-red-500/10 text-red-500 py-4 rounded-xl font-headings font-black text-sm uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center justify-center"
                      title="Limpar Prévia"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#131313] rounded-2xl border border-white/5 flex flex-col min-h-[400px]">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pré-visualização da Tabela</span>
                   <span className="text-[9px] font-bold text-gray-600 uppercase">{previewMatches.length} Partidas</span>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[500px] p-4 space-y-3 custom-scrollbar">
                  {previewMatches.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                      <CalendarRange className="w-12 h-12 mb-4" />
                      <p className="text-xs font-bold uppercase tracking-widest">Nenhum jogo gerado ainda.<br/>Configure à esquerda!</p>
                    </div>
                  ) : (
                    previewMatches.map((m, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={() => setDraggedIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleSortPreview(idx)}
                        className={`bg-[#1c1b1b] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all animate-in slide-in-from-right-4 duration-300 cursor-move active:opacity-50 ${draggedIndex === idx ? 'opacity-20 bg-primary/20' : ''}`} 
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
                          <div className="flex flex-col">
                            <input 
                              type="date" 
                              value={m.rawDate ? new Date(m.rawDate).toISOString().split('T')[0] : ''} 
                              onChange={(e) => {
                                const newPreview = [...previewMatches];
                                const selectedDate = new Date(e.target.value + 'T00:00:00');
                                newPreview[idx].rawDate = selectedDate;
                                newPreview[idx].date = selectedDate.toLocaleDateString('pt-BR');
                                setPreviewMatches(newPreview);
                              }}
                              className="bg-transparent border-none text-[10px] font-black text-primary uppercase focus:ring-0 p-0 h-auto w-24"
                            />
                            <input 
                              type="time" 
                              value={m.time} 
                              onChange={(e) => {
                                const newPreview = [...previewMatches];
                                newPreview[idx].time = e.target.value;
                                setPreviewMatches(newPreview);
                              }}
                              className="bg-transparent border-none text-[8px] font-bold text-gray-500 uppercase focus:ring-0 p-0 h-auto w-20"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedTeam({ matchId: idx, side: 'teamA' });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleSwapTeamsPreview(idx, 'teamA');
                            }}
                            className="text-xs font-headings font-black uppercase italic w-20 text-right truncate cursor-grab active:cursor-grabbing hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary/30"
                          >
                            {m.teamA}
                          </span>
                          <span className="bg-primary/20 text-primary p-1 rounded font-black text-[8px]">VS</span>
                          <span 
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              setDraggedTeam({ matchId: idx, side: 'teamB' });
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.stopPropagation();
                              handleSwapTeamsPreview(idx, 'teamB');
                            }}
                            className="text-xs font-headings font-black uppercase italic w-20 text-left truncate cursor-grab active:cursor-grabbing hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary/30"
                          >
                            {m.teamB}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {previewMatches.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <button 
                      onClick={() => {
                        addMatches(previewMatches);
                        setPreviewMatches([]);
                        setPlannerSelectedTeams([]);
                        setToastMessage('Temporada gerada! Agora visível na Dashboard.');
                        setTimeout(() => setToastMessage(''), 4000);
                        setActiveTab('agenda');
                      }}
                      className="w-full bg-green-500 text-[#0a250d] py-5 rounded-2xl font-headings font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 border-b-4 border-green-700"
                    >
                      <CalendarRange className="w-6 h-6" /> PUBLICAR TEMPORADA NA DASHBOARD
                    </button>
                    <p className="text-center text-[9px] font-bold text-gray-500 uppercase mt-4 tracking-widest opacity-60">
                      Ao clicar, todos os jogadores poderão ver e marcar presença nos jogos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HISTÓRICO DE PARTIDAS (STATS) */}
          <div className="bg-[#1c1b1b] rounded-2xl border border-white/5 overflow-hidden shadow-2xl mt-12 mb-20 animate-in slide-in-from-bottom-8 duration-700">
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-red-500/5 to-transparent">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Histórico de Resultados</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Jogos finalizados e arquivados</p>
              </div>
              <span className="bg-[#131313] text-gray-500 px-3 py-1 rounded-full text-[10px] font-black border border-white/5">
                {matches.filter(m => m.status === 'finished').length} JOGOS
              </span>
            </div>

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
              {matches.filter(m => m.status === 'finished').length > 0 ? (
                matches
                  .filter(m => m.status === 'finished')
                  .sort((a, b) => {
                    const dateA = a.date ? a.date.split('/').reverse().join('-') : '';
                    const dateB = b.date ? b.date.split('/').reverse().join('-') : '';
                    return dateB.localeCompare(dateA);
                  })
                  .map(match => (
                    <div key={match.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-[#201f1f] transition-all">
                      <div className="flex flex-col items-center md:items-start flex-1 gap-1">
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{match.date} — {match.time}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-headings font-black text-xs md:text-sm uppercase italic w-24 md:w-32 text-center md:text-right truncate">{match.teamA}</span>
                          <div className="bg-[#131313] px-4 py-2 rounded-xl border border-white/5 font-headings font-black text-lg md:text-xl text-primary italic shadow-inner min-w-[100px] text-center">
                            {match.scoreA} x {match.scoreB}
                          </div>
                          <span className="font-headings font-black text-xs md:text-sm uppercase italic w-24 md:w-32 text-center md:text-left truncate">{match.teamB}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setConfirmDeleteMatchId(match.id!)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        title="Excluir partida do histórico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
              ) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-gray-800" />
                   </div>
                   <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">Nenhuma partida registrada até o momento</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* MVP SELECTION MODAL */}
      {selectingMVPFor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="bg-[#131313] p-4 rounded-xl border border-white/5 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <p className="text-[9px] font-black uppercase text-gray-500 mb-2 truncate">
                    {matches.find(m => m.id === selectingMVPFor)?.teamA}
                  </p>
                  <input 
                    type="number" 
                    value={mScoreA}
                    onChange={(e) => setMScoreA(parseInt(e.target.value) || 0)}
                    className="w-16 h-16 bg-[#1c1b1b] border-2 border-primary/20 rounded-2xl text-center font-headings font-black text-3xl text-white outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="font-headings font-black text-xl text-gray-700 mt-6">X</div>
                <div className="flex-1 text-center">
                  <p className="text-[9px] font-black uppercase text-gray-500 mb-2 truncate">
                    {matches.find(m => m.id === selectingMVPFor)?.teamB}
                  </p>
                  <input 
                    type="number" 
                    value={mScoreB}
                    onChange={(e) => setMScoreB(parseInt(e.target.value) || 0)}
                    className="w-16 h-16 bg-[#1c1b1b] border-2 border-primary/20 rounded-2xl text-center font-headings font-black text-3xl text-white outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Quem foi o Craque do Jogo?</p>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {players
                .filter(p => {
                  // Se os times do sorteio estão definidos no jogador
                  return p.isAthlete && !p.isBlocked;
                })
                .map(player => (
                <button 
                  key={player.id}
                  onClick={() => {
                    finishMatch(selectingMVPFor, mScoreA, mScoreB, player.id);
                    setSelectingMVPFor(null);
                    setToastMessage('Partida finalizada com sucesso!');
                    setTimeout(() => setToastMessage(''), 3000);
                  }}
                  className="w-full bg-[#131313] hover:bg-primary hover:text-[#341100] p-4 rounded-xl flex items-center justify-between group transition-all border border-white/5"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-headings font-black uppercase text-sm italic">{player.name}</span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase">{player.team || 'Titular'}</span>
                  </div>
                  <Trophy className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-[#341100] transition-opacity" />
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setSelectingMVPFor(null)}
              className="w-full mt-6 py-3 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {memberStatusEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#1c1b1b] w-full max-w-sm rounded-2xl border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <h4 className="font-headings font-black text-xl uppercase italic leading-none">Editar Membro</h4>
                  <p className="text-[9px] font-bold uppercase text-gray-500 tracking-widest mt-1">Atualize as informações do perfil</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Nome ou Apelido</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-sm font-bold"
                  />
               </div>

               <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Data de Nascimento</label>
                  <input 
                    type="date" 
                    value={editBirthDate} 
                    onChange={(e) => setEditBirthDate(e.target.value)} 
                    className="w-full bg-[#131313] border-none rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary outline-none text-xs"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Tipo de Perfil</label>
                  <div className="flex bg-[#131313] p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setEditIsAthlete(true)}
                      className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${editIsAthlete ? 'bg-primary text-[#341100]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Atleta
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditIsAthlete(false)}
                      className={`flex-1 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${!editIsAthlete ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Usuário
                    </button>
                  </div>
               </div>

               {editIsAthlete && (
                  <div className="space-y-2 mb-4">
                     <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Nível Técnico (Estrelas)</label>
                     <div className="flex items-center gap-2 bg-[#131313] p-2 rounded-lg border border-white/5">
                        {[1,2,3,4,5].map(star => (
                           <button
                              key={star}
                              type="button"
                              onClick={() => setEditLevel(star)}
                              className={`flex-1 py-2 rounded-md transition-all ${editLevel >= star ? 'text-primary' : 'text-gray-800'}`}
                           >
                              <Star className={`w-5 h-5 mx-auto ${editLevel >= star ? 'fill-primary' : ''}`} />
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               <div className="pt-4 flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      updatePlayer(memberStatusEditing.id, {
                        name: editName,
                        birthDate: editBirthDate,
                        isAthlete: editIsAthlete,
                        level: editLevel
                      });
                      setMemberStatusEditing(null);
                      setToastMessage('Perfil atualizado!');
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="w-full bg-primary text-[#341100] py-4 rounded-xl font-headings font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-lg"
                  >
                    Salvar Alterações
                  </button>
                  <button 
                    onClick={() => setMemberStatusEditing(null)}
                    className="w-full py-3 text-gray-500 font-bold uppercase text-[9px] tracking-widest hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       {confirmDeletePlayerId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#1c1b1b] w-full max-w-sm rounded-2xl border border-red-500/20 p-8 shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-headings font-black text-2xl uppercase italic text-center mb-2">Excluir Membro?</h3>
              <p className="text-gray-400 text-xs text-center mb-8 uppercase font-bold leading-relaxed px-4">
                Esta ação apagará permanentemente o perfil e o histórico financeiro deste membro.
              </p>
              <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => {
                      deletePlayer(confirmDeletePlayerId);
                      setConfirmDeletePlayerId(null);
                      setToastMessage('Usuário excluído!');
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-headings font-black uppercase tracking-tighter hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                 >
                    Sim, Excluir Agora
                 </button>
                 <button 
                    onClick={() => setConfirmDeletePlayerId(null)}
                    className="w-full bg-transparent text-gray-500 py-4 rounded-xl font-headings font-black uppercase tracking-tighter hover:text-white transition-all"
                 >
                    Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}

      {confirmDeleteMatchId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-[#1c1b1b] w-full max-w-sm rounded-3xl border border-red-500/20 p-8 shadow-2xl animate-in zoom-in-95">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="font-headings font-black text-2xl uppercase italic text-center mb-2">Excluir Jogo?</h3>
              <p className="text-gray-400 text-xs text-center mb-8 uppercase font-bold leading-relaxed px-4">
                 O registro desta partida será apagado do histórico. Esta ação não poderá ser desfeita.
              </p>
              <div className="flex flex-col gap-3">
                 <button 
                    onClick={() => {
                      removeMatch(confirmDeleteMatchId);
                      setConfirmDeleteMatchId(null);
                      setToastMessage('Partida removida do histórico!');
                      setTimeout(() => setToastMessage(''), 3000);
                    }}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-headings font-black uppercase tracking-tighter hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
                 >
                    Sim, Excluir Registro
                 </button>
                 <button 
                    onClick={() => setConfirmDeleteMatchId(null)}
                    className="w-full bg-transparent text-gray-500 py-4 rounded-xl font-headings font-black uppercase tracking-tighter hover:text-white transition-all"
                 >
                    Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-primary text-[#4b1b00] px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 z-50 min-w-[300px] justify-center">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-black text-xs uppercase tracking-widest">{toastMessage}</span>
        </div>
      )}
      {/* MODAL: EDITAR JOGO (OBSERVAÇÕES E DETALHES) */}
      {editingMatch && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] w-full max-w-lg rounded-3xl border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Editar Partida</h3>
                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Altere os detalhes do confronto</p>
                </div>
                <button onClick={() => setEditingMatch(null)} className="p-2 bg-[#2a2a2a] rounded-xl text-gray-400 hover:text-white transition-all">
                   <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Time A</label>
                      <select 
                        value={editingMatch.teamA} 
                        onChange={(e) => setEditingMatch({...editingMatch, teamA: e.target.value})}
                        className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold uppercase text-white focus:ring-2 focus:ring-primary"
                      >
                         {teams.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Time B</label>
                      <select 
                        value={editingMatch.teamB} 
                        onChange={(e) => setEditingMatch({...editingMatch, teamB: e.target.value})}
                        className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold uppercase text-white focus:ring-2 focus:ring-primary"
                      >
                         {teams.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Data</label>
                      <input 
                        type="text" 
                        value={editingMatch.date} 
                        onChange={(e) => setEditingMatch({...editingMatch, date: e.target.value})}
                        className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold uppercase text-white focus:ring-2 focus:ring-primary"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Horário</label>
                      <input 
                        type="text" 
                        value={editingMatch.time} 
                        onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                        className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold uppercase text-white focus:ring-2 focus:ring-primary"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Local</label>
                   <input 
                     type="text" 
                     value={editingMatch.court} 
                     onChange={(e) => setEditingMatch({...editingMatch, court: e.target.value})}
                     placeholder="Ex: QUADRA A, ARENA CENTRAL, ETC..."
                     className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold uppercase text-white focus:ring-2 focus:ring-primary"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Observações (Opcional)</label>
                   <textarea 
                     value={editingMatch.observations || ''} 
                     onChange={(e) => setEditingMatch({...editingMatch, observations: e.target.value})}
                     placeholder="Ex: Jogo valendo churrasco, Final do Torneio, etc..."
                     className="w-full bg-[#131313] border-none rounded-2xl p-4 text-xs font-bold text-white uppercase placeholder:text-gray-700 focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                   />
                </div>

                <button 
                  onClick={() => {
                    updateMatch(editingMatch.id, editingMatch);
                    setToastMessage('Partida atualizada com sucesso!');
                    setTimeout(() => setToastMessage(''), 3000);
                    setEditingMatch(null);
                  }}
                  className="w-full bg-primary text-[#341100] py-5 rounded-2xl font-headings font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  Salvar Alterações
                </button>
             </div>
          </div>
        </div>
      )}
    </main>
  );
}
