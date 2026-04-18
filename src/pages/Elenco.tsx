import { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Shield, Flame, Activity, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Elenco() {
  const { players, teams, matches } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedPlayerModal, setSelectedPlayerModal] = useState<number | null>(null);

  // Filter athletes
  const athletes = useMemo(() => players.filter(p => p.isAthlete), [players]);

  const filteredPlayers = useMemo(() => {
    return athletes.filter(p => {
      const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTeam = selectedTeam ? p.team.split(',').includes(selectedTeam) : true;
      return matchName && matchTeam;
    }).sort((a, b) => {
      // Prioridade 1: Gols
      if (b.goals !== a.goals) return b.goals - a.goals;
      
      // Prioridade 2: MVPs (Craque do Jogo)
      const mvpA = matches.filter(m => m.status === 'finished' && m.mvpId === a.id).length;
      const mvpB = matches.filter(m => m.status === 'finished' && m.mvpId === b.id).length;
      if (mvpB !== mvpA) return mvpB - mvpA;

      // Prioridade 3: Nível Técnico (Estrelas)
      return b.level - a.level;
    });
  }, [athletes, searchTerm, selectedTeam, matches]);

  // Get top 5 scorers of all time for visual highlighting (isTopTier)
  const topFiveScorerIds = useMemo(() => {
    return [...athletes]
      .sort((a, b) => {
        if (b.goals !== a.goals) return b.goals - a.goals;
        const mvpA = matches.filter(m => m.status === 'finished' && m.mvpId === a.id).length;
        const mvpB = matches.filter(m => m.status === 'finished' && m.mvpId === b.id).length;
        return mvpB - mvpA;
      })
      .slice(0, 5)
      .filter(p => p.goals > 0) // Only highlight if they actually have goals
      .map(p => p.id);
  }, [athletes, matches]);

  // Calculate MVP count
  const getMvpCount = (playerId: number) => {
    return matches.filter(m => m.status === 'finished' && m.mvpId === playerId).length;
  };

  // Calculate dynamic OVR based on performance only (Starts equal for all at 55)
  const calculateOVR = (player: typeof players[0]) => {
    const mvps = getMvpCount(player.id);
    // Base 55 for everyone + 2 points per goal + 4 points per MVP
    const performanceBonus = (player.goals * 2) + (mvps * 4);
    return Math.min(99, 55 + performanceBonus);
  };

  const handleCardClick = (player: typeof players[0]) => {
    setSelectedPlayerModal(player.id);
    const isTopScorer = topFiveScorerIds.includes(player.id);
    
    if (isTopScorer) {
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f06600', '#ffffff', '#eab308'],
          zIndex: 200
        });
      }, 1800);
    }
  };

  return (
    <main className="pt-24 pb-32 px-4 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <section className="relative">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-[#e3bfb2] leading-none opacity-20 absolute -z-10 select-none -top-4">ELENCO</h1>
        <div className="pt-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary">Nossos Atletas</h2>
          <p className="text-[#e3bfb2] font-medium tracking-wide uppercase text-sm mt-1">Conheça os talentos da liga urbana</p>
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-4 items-center bg-[#1c1b1b] p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="BUSCAR JOGADOR..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131313] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white font-bold uppercase text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-600"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-2 md:py-0">
          <button 
            onClick={() => setSelectedTeam(null)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${
              !selectedTeam ? 'bg-primary text-[#341100]' : 'bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]'
            }`}
          >
            Todos
          </button>
          {teams.map(team => (
            <button 
              key={team}
              onClick={() => setSelectedTeam(team)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border ${
                selectedTeam === team 
                  ? 'bg-[#2a2a2a] text-white border-primary shadow-[0_0_15px_rgba(240,102,0,0.3)]' 
                  : 'bg-[#131313] text-gray-500 border-white/5 hover:border-white/10'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Cards Estilo FIFA */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredPlayers.map(player => {
           const ovr = calculateOVR(player);
           const mvpCount = getMvpCount(player.id);
           
           // Identificar posição na artilharia total (Rank)
           const athleteRank = [...athletes]
             .sort((a, b) => b.goals - a.goals || getMvpCount(b.id) - getMvpCount(a.id))
             .findIndex(p => p.id === player.id) + 1;

           const hasGoals = player.goals > 0;
           
           // NOVA ESCADA DE PRESTÍGIO (DIFERENCIAÇÃO TOTAL DO TOP 5)
           let tierStyle = 'bg-gradient-to-br from-[#2c1a10] to-[#131211] border-[#4a2e1d] shadow-lg';
           let textColor = 'text-[#cd7f32]';
           let shimmerColor = 'bg-white/10';
           let labelColor = 'text-white/60';
           let starColor = 'text-[#cd7f32] fill-[#cd7f32]';

           if (hasGoals) {
             if (athleteRank === 1) { // 👑 OURO (1º LUGAR)
               tierStyle = 'bg-gradient-to-br from-[#ffd700] via-[#f06600] to-[#2a1300] border-[#ffd700]/70 shadow-[0_0_40px_rgba(240,102,0,0.5)]';
               textColor = 'text-white';
               shimmerColor = 'bg-gradient-to-r from-transparent via-white/60 to-transparent';
               labelColor = 'text-white/70';
               starColor = 'text-white fill-white';
             } else if (athleteRank === 2) { // 💎 SAFIRA (2º LUGAR)
               tierStyle = 'bg-gradient-to-br from-[#00d2ff] via-[#3a7bd5] to-[#000d1a] border-[#00d2ff]/50 shadow-[0_0_30px_rgba(0,210,255,0.4)]';
               textColor = 'text-white';
               shimmerColor = 'bg-gradient-to-r from-transparent via-white/40 to-transparent';
               labelColor = 'text-blue-200/60';
               starColor = 'text-blue-300 fill-blue-300';
             } else if (athleteRank === 3) { // 🧊 PLATINA (3º LUGAR)
               tierStyle = 'bg-gradient-to-br from-[#ffffff] via-[#a0a0a0] to-[#1a1c1e] border-[#ffffff]/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]';
               textColor = 'text-[#1a1c1e]';
               shimmerColor = 'bg-gradient-to-r from-transparent via-white/30 to-transparent';
               labelColor = 'text-black/50';
               starColor = 'text-black fill-black';
             } else if (athleteRank === 4) { // 🔮 AMETISTA (4º LUGAR)
               tierStyle = 'bg-gradient-to-br from-[#da70d6] via-[#8a2be2] to-[#1a0033] border-[#da70d6]/50 shadow-[0_0_30px_rgba(138,43,226,0.4)]';
               textColor = 'text-white';
               shimmerColor = 'bg-gradient-to-r from-transparent via-white/40 to-transparent';
               labelColor = 'text-purple-200/60';
               starColor = 'text-purple-300 fill-purple-300';
             } else if (athleteRank === 5) { // 🌿 ESMERALDA (5º LUGAR)
               tierStyle = 'bg-gradient-to-br from-[#2ecc71] via-[#27ae60] to-[#0a2f1a] border-[#2ecc71]/50 shadow-[0_0_25px_rgba(46,204,113,0.3)]';
               textColor = 'text-white';
               shimmerColor = 'bg-gradient-to-r from-transparent via-white/30 to-transparent';
               labelColor = 'text-green-200/60';
               starColor = 'text-green-300 fill-green-300';
             }
           }

           const isSpecial = hasGoals && athleteRank <= 5;

           return (
            <div 
              key={player.id} 
              onClick={() => handleCardClick(player)}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer animate-in zoom-in-95 duration-500 border-2 transition-all hover:scale-[1.05] active:scale-95 ${tierStyle}`}
            >
               {/* Efeitos de Luz */}
               {isSpecial && (
                 <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className={`absolute -inset-full top-0 h-full w-[200%] -skew-x-12 opacity-40 pointer-events-none animate-shimmer ${shimmerColor}`}></div>
                    {athleteRank === 1 && (
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                    )}
                 </div>
               )}

               {/* Header do Card */}
               <div className="relative pt-6 pb-2 flex flex-col items-center z-10">
                  <div className="absolute top-2 left-3 flex flex-col items-center drop-shadow-md">
                    <span className={`font-black text-4xl italic leading-none tracking-tighter ${textColor}`}>
                      {ovr}
                    </span>
                    <span className={`font-black uppercase text-[9px] tracking-[0.2em] ${labelColor}`}>OVR</span>
                  </div>

                  <div className={`w-20 h-20 rounded-full border-2 p-1 mb-2 shadow-2xl relative transition-transform duration-500 group-hover:rotate-12 ${athleteRank === 1 ? 'border-white bg-black' : isSpecial ? 'border-black/20 bg-white/10' : 'border-[#4a2e1d] bg-[#1a1310]'}`}>
                     <div className="w-full h-full rounded-full bg-[#1c1b1b] flex items-center justify-center relative overflow-hidden shadow-inner">
                        <span className={`text-4xl font-black italic relative z-10 ${athleteRank === 2 || athleteRank === 3 ? 'text-white' : textColor}`}>
                           {player.name.charAt(0)}
                        </span>
                        {athleteRank === 1 && <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse"></div>}
                     </div>
                     {/* Badge de Ranking */}
                     {isSpecial && (() => {
                       let badgeStyle = 'bg-black text-white border-white';
                       if (athleteRank === 1) badgeStyle = 'bg-[#ffd700] text-black border-black/20';
                       else if (athleteRank === 2) badgeStyle = 'bg-[#00d2ff] text-black border-white/20';
                       else if (athleteRank === 3) badgeStyle = 'bg-white text-black border-black/20';
                       else if (athleteRank === 4) badgeStyle = 'bg-[#da70d6] text-white border-white/20';
                       else if (athleteRank === 5) badgeStyle = 'bg-[#2ecc71] text-white border-white/20';
                       
                       return (
                         <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 z-20 shadow-lg ${badgeStyle}`}>
                            <span className="text-[10px] font-black italic">#{athleteRank}</span>
                         </div>
                       );
                     })()}
                  </div>
                  
                  <h3 className={`font-headings font-black text-xl uppercase tracking-tighter italic line-clamp-1 w-full text-center px-2 z-10 drop-shadow-sm ${textColor}`}>
                     {player.name}
                  </h3>
                  <div className={`flex px-3 py-0.5 rounded-full border mt-1 z-10 ${isSpecial ? 'bg-black/20 border-black/10' : 'bg-black/40 border-white/5'}`}>
                     <span className={`font-black text-[9px] uppercase tracking-widest ${labelColor}`}>{player.team || 'Titular'}</span>
                  </div>
               </div>

               {/* Estatísticas do Card */}
               <div className={`grid grid-cols-2 gap-px p-px z-10 relative mt-2 ${isSpecial ? 'bg-white/10' : 'bg-white/5'}`}>
                  <div className="bg-[#1c1b1b]/90 backdrop-blur-sm p-2 text-center pointer-events-none">
                     <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Activity className={`w-3.5 h-3.5 ${athleteRank === 2 || athleteRank === 3 ? 'text-white/60' : textColor}`} />
                        <span className="font-headings font-black text-base text-white">{player.goals}</span>
                     </div>
                     <span className="font-bold uppercase text-[7px] tracking-widest text-gray-500">Gols</span>
                  </div>
                  <div className="bg-[#1c1b1b]/90 backdrop-blur-sm p-2 text-center pointer-events-none">
                     <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Flame className={`w-3.5 h-3.5 ${athleteRank === 2 || athleteRank === 3 ? 'text-white/60' : textColor}`} />
                        <span className="font-headings font-black text-base text-white">{mvpCount}</span>
                     </div>
                     <span className="font-bold uppercase text-[7px] tracking-widest text-gray-500">MVPs</span>
                  </div>
               </div>

               {/* Rodapé do Card - Estrelas */}
               <div className={`py-2.5 flex justify-center gap-1.5 z-10 relative ${isSpecial ? 'bg-white/5' : 'bg-black/20'}`}>
                  {Array.from({length: 5}).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 transition-all ${
                         i < player.level 
                           ? starColor 
                           : 'text-gray-800 fill-gray-900 opacity-20'
                      }`} 
                    />
                  ))}
               </div>

               {/* Efeito Glow Interno */}
               <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none ${athleteRank === 1 ? 'bg-gradient-to-t from-white/20 to-transparent' : 'bg-white/5'}`}></div>
            </div>
           );
        })}
        
        {filteredPlayers.length === 0 && (
           <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#1c1b1b]">
              <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="font-headings font-black uppercase text-xl text-gray-500">Nenhum atleta encontrado</p>
              <p className="text-xs font-bold uppercase text-gray-600 mt-2 tracking-widest">Tente outro termo na busca</p>
           </div>
        )}
      </section>

      {/* Modal Detalhes do Jogador */}
      <AnimatePresence>
        {selectedPlayerModal && (() => {
          const selectedPlayer = players.find(p => p.id === selectedPlayerModal);
          if (!selectedPlayer) return null;

          const ovr = calculateOVR(selectedPlayer);
          const mvpCount = getMvpCount(selectedPlayer.id);
          const rank = [...athletes]
            .sort((a, b) => b.goals - a.goals || getMvpCount(b.id) - getMvpCount(a.id))
            .findIndex(p => p.id === selectedPlayer.id) + 1;
          const hasGoals = selectedPlayer.goals > 0;

          // Cores Sincronizadas
          let modalStyle = 'bg-[#1a1310] border-[#4a2e1d] shadow-2xl';
          let headTextColor = 'text-white';
          let tagBg = 'bg-white/10';
          let statsIconColor = 'text-[#cd7f32]';

          if (hasGoals) {
            if (rank === 1) {
              modalStyle = 'bg-gradient-to-br from-[#ffd700] via-[#f06600] to-[#2a1300] border-[#ffd700]/50 shadow-[0_0_50px_rgba(240,102,0,0.6)]';
            } else if (rank === 2) {
              modalStyle = 'bg-gradient-to-br from-[#00d2ff] via-[#3a7bd5] to-[#000d1a] border-[#00d2ff]/50 shadow-[0_0_40px_rgba(0,210,255,0.4)]';
              statsIconColor = 'text-blue-200';
            } else if (rank === 3) {
              modalStyle = 'bg-gradient-to-br from-[#ffffff] via-[#a0a0a0] to-[#1a1c1e] border-[#ffffff]/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]';
              headTextColor = 'text-black';
              tagBg = 'bg-black/10';
              statsIconColor = 'text-black';
            } else if (rank === 4) {
              modalStyle = 'bg-gradient-to-br from-[#da70d6] via-[#8a2be2] to-[#1a0033] border-[#da70d6]/50 shadow-[0_0_40px_rgba(138,43,226,0.5)]';
              statsIconColor = 'text-purple-200';
            } else if (rank === 5) {
              modalStyle = 'bg-gradient-to-br from-[#2ecc71] via-[#27ae60] to-[#0a2f1a] border-[#2ecc71]/50 shadow-[0_0_30px_rgba(46,204,113,0.3)]';
              statsIconColor = 'text-green-200';
            }
          }

          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 backdrop-blur-sm bg-black/80 perspective-1000">
              <motion.div 
                initial={{ opacity: 0, scale: 0.2, rotateY: 1800, y: 100 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateY: 0, 
                  y: 0,
                  transition: { 
                    type: "tween",
                    ease: "easeOut",
                    duration: 1.5
                  } 
                }}
                exit={{ opacity: 0, scale: 0.2, rotateY: -1800, y: 100 }}
                className={`w-full max-w-sm rounded-[32px] border-2 overflow-hidden relative shadow-2xl ${modalStyle}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Banner Detalhes */}
                <div className="relative pt-12 pb-8 flex flex-col items-center z-10">
                  <button 
                    onClick={() => setSelectedPlayerModal(null)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${rank === 3 ? 'bg-black/10 text-black hover:bg-black/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute top-4 left-6 flex flex-col items-center">
                    <span className={`font-black text-5xl italic leading-none tracking-tighter drop-shadow-lg ${rank === 3 ? 'text-black' : 'text-white'}`}>
                      {ovr}
                    </span>
                    <span className={`font-black uppercase text-xs tracking-[0.3em] ${rank === 3 ? 'text-black/50' : 'text-white/60'}`}>OVR</span>
                  </div>

                  <div className={`w-32 h-32 rounded-full border-4 p-1.5 mb-4 shadow-2xl relative ${rank === 1 ? 'border-white bg-black' : hasGoals && rank <= 5 ? 'border-black/20 bg-white/20' : 'border-[#4a2e1d] bg-[#1a1310]'}`}>
                    <div className="w-full h-full rounded-full bg-[#1c1b1b] flex items-center justify-center relative overflow-hidden shadow-inner">
                      <span className={`text-6xl font-black italic relative z-10 ${rank === 1 ? 'text-[#ffd700]' : rank === 2 ? 'text-[#00d2ff]' : rank === 3 ? 'text-white' : rank === 4 ? 'text-[#da70d6]' : rank === 5 ? 'text-[#2ecc71]' : 'text-[#cd7f32]'}`}>
                        {selectedPlayer.name.charAt(0)}
                      </span>
                      {rank === 1 && <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse"></div>}
                    </div>
                    {hasGoals && rank <= 5 && (() => {
                      let badgeStyle = 'bg-black text-white border-white';
                      if (rank === 1) badgeStyle = 'bg-[#ffd700] text-black border-black/20';
                      else if (rank === 2) badgeStyle = 'bg-[#00d2ff] text-black border-white/20';
                      else if (rank === 3) badgeStyle = 'bg-white text-black border-black/20';
                      else if (rank === 4) badgeStyle = 'bg-[#da70d6] text-white border-white/20';
                      else if (rank === 5) badgeStyle = 'bg-[#2ecc71] text-white border-white/20';
                      
                      return (
                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 z-20 shadow-xl ${badgeStyle}`}>
                           <span className="text-sm font-black italic">#{rank}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <h2 className={`font-headings font-black text-4xl uppercase tracking-tighter italic mb-1 drop-shadow-md ${headTextColor}`}>
                    {selectedPlayer.name}
                  </h2>
                  <div className={`flex px-4 py-1.5 rounded-full border ${tagBg} border-white/10`}>
                    <span className={`font-black text-xs uppercase tracking-widest ${rank === 3 ? 'text-black' : 'text-white'}`}>{selectedPlayer.team || 'Candidato'}</span>
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < selectedPlayer.level 
                            ? (rank === 1 ? 'text-white fill-white' : rank === 2 ? 'text-blue-200 fill-blue-200' : rank === 3 ? 'text-black fill-black' : rank === 4 ? 'text-white fill-white' : rank === 5 ? 'text-white fill-white' : 'text-[#cd7f32] fill-[#cd7f32]') 
                            : 'text-gray-800 fill-gray-900 opacity-20'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Estatísticas Detalhadas */}
                <div className={`p-6 space-y-4 relative z-10 ${rank === 3 ? 'bg-black/5' : 'bg-black/30'}`}>
                  <h3 className={`font-black uppercase text-[10px] tracking-[0.3em] mb-4 ${rank === 3 ? 'text-black/40' : 'text-white/40'}`}>Estatísticas do Atleta</h3>
                  
                  <div className={`p-4 rounded-2xl flex items-center gap-4 border transition-transform hover:scale-[1.02] ${rank === 3 ? 'bg-white/40 border-black/10' : 'bg-white/5 border-white/10'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tagBg}`}>
                      <Activity className={`w-6 h-6 ${statsIconColor}`} />
                    </div>
                    <div>
                      <p className={`font-headings font-black text-2xl leading-none ${rank === 3 ? 'text-black' : 'text-white'}`}>{selectedPlayer.goals}</p>
                      <p className={`uppercase text-[9px] font-bold tracking-widest ${rank === 3 ? 'text-black/50' : 'text-white/50'}`}>Gols Marcados</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl flex items-center gap-4 border transition-transform hover:scale-[1.02] ${rank === 3 ? 'bg-white/40 border-black/10' : 'bg-white/5 border-white/10'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tagBg}`}>
                      <Flame className={`w-6 h-6 ${statsIconColor}`} />
                    </div>
                    <div>
                      <p className={`font-headings font-black text-2xl leading-none ${rank === 3 ? 'text-black' : 'text-white'}`}>{mvpCount}</p>
                      <p className={`uppercase text-[9px] font-bold tracking-widest ${rank === 3 ? 'text-black/50' : 'text-white/50'}`}>Prêmios de Craque</p>
                    </div>
                  </div>
                </div>
                
                {/* Brilhos de Fundo para o Modal Especial */}
                {hasGoals && rank <= 5 && (
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                     <div className={`absolute -inset-full top-0 h-full w-[200%] -skew-x-12 animate-shimmer ${rank === 1 ? 'bg-gradient-to-r from-transparent via-white/40 to-transparent' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'}`}></div>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </main>
  );
}
