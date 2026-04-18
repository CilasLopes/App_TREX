import { useState, useMemo } from 'react';
import { Shield, Rocket, Swords, Star, Zap, MoreVertical, Calendar, Cake, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { 
    matches, players, 
    isLiveSorting, liveSortingResults, activeSortingTeam, slotMachineName 
  } = useAppContext();

  const [selectedDate, setSelectedDate] = useState<string>('');

  const { scheduledMatches, roundDates } = useMemo(() => {
    const scheduled = matches.filter(m => m.status === 'scheduled');
    const dates = Array.from(new Set(scheduled.map(m => m.date)));
    return { scheduledMatches: scheduled, roundDates: dates };
  }, [matches]);

  const activeDate = selectedDate || roundDates[0] || '';
  const activeMatches = useMemo(() => 
    scheduledMatches.filter(m => m.date === activeDate),
  [scheduledMatches, activeDate]);

  // Próximo Jogo: Pega o primeiro agendado
  const nextMatch = matches.find(m => m.status === 'scheduled');
  
  // Resultados Recentes: Pega os finalizados (últimos 2)
  const recentResults = matches.filter(m => m.status === 'finished').slice(-2).reverse();

  // Lógica de Próximo Aniversariante
  const getNextBirthday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const candidates = players
      .filter(p => p.birthDate)
      .map(p => {
        const [, month, day] = p.birthDate!.split('-').map(Number);
        let bday = new Date(today.getFullYear(), month - 1, day);
        
        if (bday < today) {
          bday.setFullYear(today.getFullYear() + 1);
        }
        
        return { player: p, date: bday };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return candidates[0];
  };

  const nextBirthday = getNextBirthday();

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Próximo Jogo Section */}
      <section className="relative animate-in fade-in duration-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headings text-2xl font-black uppercase tracking-tighter italic">Próximo Jogo</h2>
        </div>

        {/* PRÓXIMO ANIVERSÁRIO (Opcional - aparece se houver niver próximo) */}
        {nextBirthday && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl border border-white/5 flex items-center justify-between animate-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center relative">
                  <Cake className="w-6 h-6 text-primary" />
                  <div className="absolute -top-2 -right-2">
                     <PartyPopper className="w-5 h-5 text-yellow-500 animate-bounce" />
                  </div>
               </div>
               <div>
                  <h4 className="font-headings font-black text-sm uppercase italic tracking-tighter">Próximo <span className="text-primary">Aniversariante!</span></h4>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Preparem as comemorações! <span className="text-white">{nextBirthday.player.name}</span> completa mais um ano em {nextBirthday.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </p>
               </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[20px] font-black italic uppercase text-white/20 leading-none">PARABÉNS</span>
               <span className="text-[9px] font-bold uppercase text-primary tracking-widest">Organizem o evento!</span>
            </div>
          </div>
        )}

        {nextMatch ? (
          <div className="bg-[#1c1b1b] rounded-lg p-6 relative overflow-hidden group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f06600]/10 to-transparent opacity-50" />
            
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700">
              <img className="w-full h-full object-cover" alt="Court" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXlXIjLBmvSjuv_L1zLElc0a0-vCQGl3gCDGibygN6CyzFy1w8Q12A8la8R2i1tifD0eSvkTBTA0FYjbyDE0_DnfyBGsPUR3YH7SrkyuPCHPonPcwiC9LLe7T3QSXG-IhmuI0mqQqoem43SNvBrJuT9Bn25mooFlXfKjPReZDh54g3pJdpvn_5D2CGzl4BXiF46rd0dyz_zT4Y9kxvEuLUfVOlT-hX3t1gatbjH7RIGi_6n5WqYghChpdMV0Y9FShxHd2iJHPCrJJg"/>
            </div>

            {nextMatch.observations && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-primary/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary/30 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] md:text-xs font-black uppercase text-primary tracking-widest leading-none italic shadow-sm">
                  {nextMatch.observations}
                </p>
              </div>
            )}

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-4">
              <div className="flex flex-col items-center md:items-end text-center md:text-right flex-1">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-3 border border-primary/20">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-headings font-black text-xl md:text-3xl uppercase leading-none">{nextMatch.teamA}</h3>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="font-headings font-black text-4xl md:text-6xl text-primary italic mb-2">VS</div>
                <div className="bg-[#353534] px-4 py-1 rounded text-[10px] md:text-xs font-headings font-bold uppercase tracking-widest text-[#ffdbcb]">
                  {nextMatch.time} {nextMatch.court && `• ${nextMatch.court}`}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-3 border border-primary/20">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-headings font-black text-xl md:text-3xl uppercase leading-none">{nextMatch.teamB}</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1c1b1b] rounded-lg p-12 text-center border border-dashed border-white/10">
            <Calendar className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 font-bold uppercase text-xs">Aguardando definição da próxima rodada</p>
          </div>
        )}
      </section>


      {/* Agenda da Temporada (Full Season View) */}
      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headings text-2xl font-black uppercase tracking-tighter italic">Agenda da Temporada</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Veja todos os confrontos programados</p>
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 font-headings font-bold text-[10px] px-3 py-1 uppercase rounded-full self-start md:self-center">
            {matches.filter(m => m.status === 'scheduled').length} jogos agendados
          </span>
        </div>

        {/* Filtros de Rodada */}
        {roundDates.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar relative z-10">
            {roundDates.map((date, idx) => {
              const isActive = selectedDate === date || (!selectedDate && idx === 0);
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-xl font-headings font-black text-xs uppercase tracking-widest transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-primary text-[#341100] border-primary shadow-lg shadow-primary/20' 
                      : 'bg-[#1c1b1b] text-gray-400 border-white/5 hover:border-white/10 hover:bg-[#252525]'
                  }`}
                >
                  Rodada {idx + 1}
                  <span className={`block text-[10px] mt-1 ${isActive ? 'text-[#4b1b00]' : 'text-gray-500'}`}>
                    {date}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x no-scrollbar min-h-[300px]">
          {activeMatches.map((match, idx) => (
            <div 
              key={match.id} 
              className="flex-shrink-0 w-[280px] md:w-[320px] bg-[#1c1b1b] rounded-2xl border border-white/5 p-6 snap-center relative group overflow-hidden hover:border-primary/30 transition-all shadow-xl"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                 <span className="font-headings font-black text-4xl text-white italic">#{idx + 1}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{match.time}</span>
                   <span className="text-[8px] font-bold text-gray-500 uppercase">
                     {match.court} {match.observations && <span className="text-primary/60 ml-1 italic">({match.observations})</span>}
                   </span>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                   <Calendar className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 py-4 border-y border-white/5 mb-6">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2 border border-white/10 shadow-inner group-hover:border-primary/30 transition-colors">
                     <Shield className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] font-black uppercase truncate w-full text-center text-white">{match.teamA}</span>
                </div>
                
                <div className="flex flex-col items-center">
                   <div className="font-headings font-black text-xs text-gray-700 italic px-2">VS</div>
                </div>
                
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2 border border-white/10 shadow-inner group-hover:border-primary/30 transition-colors">
                     <Rocket className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] font-black uppercase truncate w-full text-center text-white">{match.teamB}</span>
                </div>
              </div>

            </div>
          ))}

          {scheduledMatches.length === 0 && (
             <div className="w-full p-16 bg-[#1c1b1b] rounded-2xl border border-dashed border-white/10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-700" />
                </div>
                <div className="max-w-[250px]">
                  <p className="text-white font-black uppercase text-sm tracking-tighter">Nenhum jogo agendado</p>
                  <p className="text-gray-600 font-bold text-[10px] uppercase mt-1">Fique atento às próximas rodadas que serão publicadas.</p>
                </div>
             </div>
          )}
        </div>
      </section>

      {/* Resultados Recentes (No Final) */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-headings text-xl font-black uppercase tracking-tighter italic">Resultados Recentes</h2>
          <Link to="/tabela" className="font-headings text-xs text-primary font-bold uppercase cursor-pointer hover:underline">Ver Tabela</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentResults.map(result => (
            <div key={result.id} className="bg-[#1c1b1b] p-6 rounded-lg border-l-4 border-primary shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <span className="font-headings text-[10px] text-gray-500 font-bold uppercase">{result.date}</span>
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2 border border-white/5">
                    <Swords className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-headings text-[10px] font-black uppercase truncate w-full text-center">{result.teamA}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-headings font-black text-3xl italic">{result.scoreA}</span>
                  <span className="text-gray-600 font-black text-xl">-</span>
                  <span className="font-headings font-black text-3xl text-primary italic">{result.scoreB}</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2 border border-white/5">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-headings text-[10px] font-black uppercase truncate w-full text-center">{result.teamB}</span>
                </div>
              </div>

              {result.mvpId && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                     <span className="text-[10px] font-black uppercase text-gray-400">Craque do Jogo</span>
                  </div>
                  <span className="text-xs font-black uppercase text-white truncate">
                    {players.find(p => p.id === result.mvpId)?.name || 'N/A'}
                  </span>
                </div>
              )}
            </div>
          ))}

          {recentResults.length === 0 && (
             <div className="md:col-span-2 p-10 bg-[#1c1b1b] rounded-lg border border-dashed border-white/10 text-center">
                <p className="text-gray-600 font-bold uppercase text-xs italic">Nenhum resultado recente lançado</p>
             </div>
          )}
        </div>
      </section>

      {/* LIVE SORTEIO OVERLAY */}
      {isLiveSorting && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex flex-col p-6 animate-in fade-in duration-500">
           <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                       <span className="text-red-500 font-black text-[10px] uppercase tracking-widest">Sorteio ao Vivo</span>
                    </div>
                    <h2 className="font-headings font-black text-4xl md:text-6xl uppercase italic text-white leading-none">Acompanhe a Divisão</h2>
                 </div>
                 <Zap className="w-12 h-12 text-primary animate-bounce" />
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-${Math.max(1, Object.keys(liveSortingResults).length)} gap-6 flex-1`}>
                 {Object.keys(liveSortingResults).map((teamName) => {
                    const teamPlayers = liveSortingResults[teamName] || [];
                    const avgLevel = teamPlayers.length ? (teamPlayers.reduce((acc, p) => acc + p.level, 0) / teamPlayers.length).toFixed(1) : '0.0';

                    return (
                      <div key={teamName} className="bg-[#1c1b1b] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                         <div className="p-6 bg-[#2a2a2a] border-b border-primary/20 flex justify-between items-center">
                            <h3 className="font-headings font-black text-xl md:text-2xl uppercase italic truncate text-white">{teamName}</h3>
                            <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                               <Star className="w-4 h-4 text-primary fill-primary" />
                               <span className="text-sm font-black text-primary">{avgLevel}</span>
                            </div>
                         </div>
                         <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar relative">
                            {teamPlayers.map((player, idx) => (
                               <div key={player.id} className="flex items-center gap-4 animate-in zoom-in-95 slide-in-from-left-4 duration-500">
                                  <span className="font-black text-gray-700 text-lg italic">#0{idx + 1}</span>
                                  <div className="flex-1 bg-[#252525] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/50 transition-all">
                                     <span className="font-black text-sm md:text-base uppercase text-white">{player.name}</span>
                                     <div className="flex gap-1 text-primary/40">
                                        {Array.from({length: player.level}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                     </div>
                                  </div>
                               </div>
                            ))}

                            {activeSortingTeam === teamName && (
                               <div className="pt-8 flex flex-col items-center gap-8 animate-in slide-in-from-top-12 duration-700">
                                  <div className="bg-gradient-to-br from-primary/40 to-black/40 border-4 border-primary/50 p-12 rounded-[40px] w-full max-w-md text-center overflow-hidden min-h-[200px] flex flex-col items-center justify-center backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative ring-1 ring-white/10">
                                     <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs uppercase font-black text-primary animate-pulse tracking-[0.3em]">
                                        DEFININDO JOGADOR...
                                     </div>
                                     <span className="font-headings font-black text-white uppercase text-4xl md:text-5xl italic animate-flash inline-block drop-shadow-[0_0_20px_rgba(240,102,0,0.7)] tracking-tighter">
                                       {slotMachineName || '...'}
                                     </span>
                                     <div className="mt-8 flex gap-3 items-center justify-center">
                                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                       <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                     </div>
                                  </div>
                               </div>
                             )}

                            {teamPlayers.length === 0 && !activeSortingTeam && (
                               <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                                  <p className="font-black uppercase text-xs tracking-widest italic">Aguardando...</p>
                                </div>
                            )}
                         </div>
                      </div>
                    );
                 })}
              </div>

              <div className="mt-8 text-center">
                 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] animate-pulse">Aguardando confirmação do administrador</p>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
