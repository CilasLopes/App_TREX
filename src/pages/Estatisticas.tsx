import { useState, useMemo } from 'react';
import { Award, Shield, Activity, X, Star, Trophy, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Estatisticas() {
  const { players, matches, teams: contextTeams } = useAppContext();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Encontrar o Craque da Última Rodada
  const lastMatchWithMvp = [...matches].filter(m => m.status === 'finished' && m.mvpId).reverse()[0];
  const lastMvpPlayer = lastMatchWithMvp ? players.find(p => p.id === lastMatchWithMvp.mvpId) : null;

  // Ordenar jogadores por gols
  const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
  const leader = sortedPlayers[0];
  const others = sortedPlayers.slice(1, 5);

  // CÁLCULO DINÂMICO DE ESTATÍSTICAS POR TIME
  const teamStats = useMemo(() => {
    return contextTeams.map(teamName => {
      const teamMatches = matches.filter(m => m.status === 'finished' && (m.teamA === teamName || m.teamB === teamName));
      let goalsScored = 0;
      let goalsConceded = 0;

      teamMatches.forEach(m => {
        if (m.teamA === teamName) {
          goalsScored += m.scoreA || 0;
          goalsConceded += m.scoreB || 0;
        } else {
          goalsScored += m.scoreB || 0;
          goalsConceded += m.scoreA || 0;
        }
      });

      const avgScored = teamMatches.length > 0 ? (goalsScored / teamMatches.length).toFixed(1) : '0.0';
      const avgConceded = teamMatches.length > 0 ? (goalsConceded / teamMatches.length).toFixed(1) : '0.0';

      return {
        name: teamName,
        shortId: teamName.substring(0, 3).toUpperCase(),
        playersCount: players.filter(p => p.team === teamName).length,
        avgScored: parseFloat(avgScored),
        avgConceded: parseFloat(avgConceded),
        matchesPlayed: teamMatches.length
      };
    });
  }, [contextTeams, matches, players]);

  const bestAttacks = [...teamStats].sort((a, b) => b.avgScored - a.avgScored).slice(0, 3);
  const bestDefenses = [...teamStats].sort((a, b) => a.avgConceded - b.avgConceded).slice(0, 3);

  return (
    <main className="pt-24 pb-32 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12 relative">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-[#e3bfb2] leading-none opacity-20 absolute -z-10 select-none">ESTATÍSTICAS</h1>
        <div className="pt-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary">LÍDERES DA TEMPORADA</h2>
          <p className="text-[#e3bfb2] font-medium tracking-wide uppercase text-sm mt-1">Dados oficiais da liga de Futsal Urbano</p>
        </div>
      </section>

      {/* Craque da Rodada */}
      {lastMvpPlayer && (
        <section className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="relative bg-[#1c1b1b] rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_40px_-15px_rgba(240,102,0,0.3)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                    <div className="relative">
                       <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-[#f06600] to-primary p-[2px] shadow-2xl overflow-hidden">
                          <div className="w-full h-full bg-[#131313] rounded-2xl flex items-center justify-center relative overflow-hidden">
                             <span className="text-primary text-4xl font-black italic">{lastMvpPlayer.name.charAt(0)}</span>
                          </div>
                       </div>
                       <div className="absolute -top-3 -right-3 bg-yellow-500 text-[#341100] p-1.5 rounded-lg shadow-lg rotate-12">
                          <Trophy className="w-5 h-5" />
                       </div>
                    </div>
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full mb-3">
                          <Zap className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">CRAQUE DO ÚLTIMO JOGO</span>
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">{lastMvpPlayer.name}</h3>
                       <p className="text-[#e3bfb2] font-bold uppercase tracking-widest text-sm mt-1 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary opacity-50" /> {lastMvpPlayer.team || 'Sem Clube'}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-[#1c1b1b] p-6 rounded-lg relative overflow-hidden group">
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <h3 className="text-3xl font-extrabold uppercase italic tracking-tighter">Artilharia</h3>
              <p className="text-primary text-xs font-bold uppercase tracking-widest">Gols Marcados</p>
            </div>
            <Award className="text-[#353534] w-20 h-20 absolute -top-4 -right-2 rotate-12 group-hover:text-[#f06600]/20 transition-colors" />
          </div>
          <div className="space-y-4 relative z-10">
            {leader && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f06600] to-primary rounded-lg shadow-xl hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-[#4b1b00] italic">01</span>
                  <div className="w-12 h-12 rounded-lg bg-[#131313] flex items-center justify-center">
                     <span className="text-primary text-xl font-black">{leader.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[#4b1b00] font-black uppercase leading-none">{leader.name}</p>
                    <p className="text-[#4b1b00]/70 text-xs font-bold uppercase">{leader.team || 'Sem Clube'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#4b1b00] leading-none">{leader.goals}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {others.map((scorer, idx) => (
                <div key={scorer.id} className="flex items-center justify-between p-3 bg-[#201f1f] rounded-lg hover:bg-[#2a2a2a] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-[#e3bfb2] italic w-6">{String(idx + 2).padStart(2, '0')}</span>
                    <p className="font-bold uppercase text-sm">{scorer.name}</p>
                  </div>
                  <p className="text-xl font-black text-primary w-6 text-right">{scorer.goals}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-6 rounded-lg flex flex-col h-full shadow-lg border border-white/5">
           <div className="mb-6">
              <h3 className="text-2xl font-extrabold uppercase italic tracking-tighter text-[#e5e2e1]">Galeria de Craques</h3>
              <p className="text-[#d2795d] text-xs font-bold uppercase tracking-widest">Destaques Recentes</p>
           </div>
           <div className="space-y-3 flex-1">
              {matches.filter(m => m.status === 'finished' && m.mvpId).reverse().slice(0, 4).map((match, idx) => {
                 const player = players.find(p => p.id === match.mvpId);
                 if (!player) return null;
                 return (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-[#131313] rounded-xl border border-white/5">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${idx === 0 ? 'bg-yellow-500 text-[#341100]' : 'bg-[#2a2a2a] text-gray-500'}`}>
                             #{idx + 1}
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase text-white truncate max-w-[120px]">{player.name}</p>
                             <p className="text-[9px] font-bold text-gray-500 uppercase">{match.date}</p>
                          </div>
                       </div>
                       <Trophy className={`w-4 h-4 ${idx === 0 ? 'text-yellow-500' : 'text-gray-700'}`} />
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Equipes Ativas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {teamStats.map(team => (
            <div 
              key={team.name} 
              onClick={() => setSelectedTeam(team.name)}
              className="group bg-[#1c1b1b] p-4 rounded-lg flex flex-col items-center hover:bg-[#201f1f] transition-all cursor-pointer border-b-2 border-transparent hover:border-primary active:scale-95"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full mb-4 flex items-center justify-center relative overflow-hidden border border-primary/20">
                <span className="font-black text-xl italic text-primary">{team.shortId}</span>
              </div>
              <p className="font-black uppercase text-xs text-center truncate w-full">{team.name}</p>
              <p className="text-[10px] text-[#e3bfb2] font-bold uppercase mt-1">{team.playersCount} Atletas</p>
            </div>
          ))}
          {teamStats.length === 0 && (
             <p className="col-span-full text-center text-gray-600 font-bold uppercase text-xs py-10 opacity-30">Nenhum time cadastrado</p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1c1b1b] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-primary w-8 h-8" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Melhores Ataques</h3>
          </div>
          <div className="space-y-3">
            {bestAttacks.map((team, idx) => (
              <div key={team.name} className="flex justify-between items-center p-3 bg-[#201f1f]/50 rounded">
                <span className="font-bold text-xs uppercase">{String(idx + 1).padStart(2, '0')}. {team.name}</span>
                <span className="font-black text-primary">{team.avgScored} Gols/Jogo</span>
              </div>
            ))}
            {bestAttacks.length === 0 && <p className="text-[10px] text-gray-600 uppercase font-black">Aguardando dados...</p>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1c1b1b] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-[#ffb59e] w-8 h-8" />
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Sólidez Defensiva</h3>
          </div>
          <div className="space-y-3">
            {bestDefenses.map((team, idx) => (
              <div key={team.name} className="flex justify-between items-center p-3 bg-[#201f1f]/50 rounded">
                <span className="font-bold text-xs uppercase">{String(idx + 1).padStart(2, '0')}. {team.name}</span>
                <span className="font-black text-[#ffb59e]">{team.avgConceded} Gols Sof.</span>
              </div>
            ))}
            {bestDefenses.length === 0 && <p className="text-[10px] text-gray-600 uppercase font-black">Aguardando dados...</p>}
          </div>
        </div>
      </section>

      {/* TEAM PLAYERS MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1c1b1b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/20 to-transparent">
              <div>
                <h4 className="font-headings font-black text-2xl uppercase italic text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" /> {selectedTeam}
                </h4>
                <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">Elenco Principal</p>
              </div>
              <button 
                onClick={() => setSelectedTeam(null)}
                className="bg-[#2a2a2a] p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {players.filter(p => p.team.split(',').includes(selectedTeam)).length === 0 ? (
                  <div className="text-center p-8 bg-[#131313] rounded-xl border border-white/5">
                    <p className="text-gray-500 font-bold uppercase text-xs">Nenhum jogador escalado ainda para {selectedTeam}</p>
                  </div>
                ) : (
                  [...players]
                    .filter(p => p.team.split(',').includes(selectedTeam))
                    .sort((a, b) => {
                      if (b.goals !== a.goals) return b.goals - a.goals;
                      const mvpA = matches.filter(m => m.status === 'finished' && m.mvpId === a.id).length;
                      const mvpB = matches.filter(m => m.status === 'finished' && m.mvpId === b.id).length;
                      if (mvpB !== mvpA) return mvpB - mvpA;
                      return b.level - a.level;
                    })
                    .map(player => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-[#131313] rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 font-black">
                             {player.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase text-gray-200">{player.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gray-500">{player.goals} Gols Marcados</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex text-yellow-500/50">
                          {Array.from({length: player.level}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
