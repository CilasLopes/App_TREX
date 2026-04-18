import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus } from 'lucide-react';

export default function Agenda() {
  const { matches, players, currentUser, finishMatch, updateMatchTeams, teams, addMatch, removeMatch, courtSettings } = useAppContext();
  const [finishingMatchId, setFinishingMatchId] = useState<number | null>(null);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  
  const [manualMatch, setManualMatch] = useState({
    teamA: teams[0] || '',
    teamB: teams[1] || '',
    date: 'HOJE',
    time: '20:30',
    court: '',
    observations: ''
  });

  const handleCreateManualMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMatch.teamA || !manualMatch.teamB) return;
    addMatch({
      teamA: manualMatch.teamA,
      teamB: manualMatch.teamB,
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      date: manualMatch.date,
      time: manualMatch.time,
      court: manualMatch.court,
      observations: manualMatch.observations
    });
    setManualMatch({...manualMatch, observations: ''});
  };

  // Agrupar jogos por data
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <main className="pt-24 pb-32 px-4 max-w-5xl mx-auto">
      {/* Hero Section Header */}
      <section className="mb-12">
        <span className="text-primary font-headings font-bold text-xs uppercase tracking-widest block mb-2">
          Próximos Confrontos
        </span>
        <h2 className="font-headings font-black text-5xl md:text-7xl uppercase italic tracking-tighter leading-none mb-4">
          Agenda da <span className="text-primary">Quadra</span>
        </h2>
        <p className="text-[#e3bfb2] max-w-xl font-sans leading-relaxed">
          Prepare sua chuteira. Acompanhe as datas, horários e locais das próximas batalhas do seu time nas quadras urbanas.
        </p>
      </section>

      {/* Manual Match Creation (Admin Only) */}
      {currentUser?.role === 'admin' && (
        <section className="mb-12 bg-[#1c1b1b] rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl">
          <h3 className="font-headings font-black text-2xl uppercase italic flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" /> Novo Jogo
          </h3>
          <form onSubmit={handleCreateManualMatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Time A</label>
                <select 
                  value={manualMatch.teamA}
                  onChange={(e) => setManualMatch({...manualMatch, teamA: e.target.value})}
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary uppercase font-bold text-sm"
                >
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Time B</label>
                <select 
                  value={manualMatch.teamB}
                  onChange={(e) => setManualMatch({...manualMatch, teamB: e.target.value})}
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary uppercase font-bold text-sm"
                >
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Data (Texto)</label>
                <input 
                  type="text" 
                  value={manualMatch.date}
                  onChange={(e) => setManualMatch({...manualMatch, date: e.target.value})}
                  placeholder="EX: HOJE, SÁBADO 14/05"
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Horário</label>
                <input 
                  type="text" 
                  value={manualMatch.time}
                  onChange={(e) => setManualMatch({...manualMatch, time: e.target.value})}
                  placeholder="20:30"
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary font-bold text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Local / Quadra</label>
                <input 
                  type="text" 
                  value={manualMatch.court}
                  onChange={(e) => setManualMatch({...manualMatch, court: e.target.value})}
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary font-bold text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Observações (Opcional)</label>
                <input 
                  type="text" 
                  value={manualMatch.observations}
                  onChange={(e) => setManualMatch({...manualMatch, observations: e.target.value})}
                  placeholder="Ex: Jogo valendo churrasco"
                  className="w-full bg-[#131313] border-none rounded-lg p-3 text-white focus:ring-1 focus:ring-primary font-bold text-sm"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#dbe855] text-[#2c2f11] py-4 rounded-lg font-headings font-black text-lg uppercase tracking-tighter hover:scale-95 transition-all mt-4">
              Agendar Partida
            </button>
          </form>
        </section>
      )}

      {/* Schedule List */}
      <div className="space-y-12">
        {Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <div key={date} className="relative transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-end gap-4 mb-6">
              <h3 className="font-headings font-black text-4xl text-primary leading-none uppercase">{date}</h3>
              <div className="h-1 bg-[#2a2a2a] grow mb-1"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {dateMatches.map(match => (
                <div key={match.id} className={`bg-[#201f1f] border-l-4 ${match.status === 'finished' ? 'border-gray-600' : 'border-primary'} p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center md:items-start z-10">
                    <span className="text-[#ffb59e] font-headings font-bold text-sm uppercase tracking-widest mb-1">
                      {match.time} {match.court && `— ${match.court}`} {match.observations && <span className="text-primary italic ml-2">— {match.observations}</span>}
                    </span>
                    <div className="w-full flex items-start justify-between gap-6 mt-4">
                      <div className="text-center md:text-right flex-1">
                        {editingMatchId === match.id && currentUser?.role === 'admin' ? (
                          <select 
                            value={match.teamA}
                            onChange={(e) => updateMatchTeams(match.id, e.target.value, match.teamB)}
                            className="bg-[#2a2a2a] text-white p-2 text-center md:text-right rounded text-xl md:text-3xl mb-2 w-full uppercase font-bold font-headings"
                          >
                            {teams.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        ) : (
                          <p className="font-headings font-black text-xl md:text-3xl uppercase">{match.teamA}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          {players.filter(p => p.team.split(',').includes(match.teamA)).map(p => (
                            <div key={p.id} className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center md:justify-end gap-1">
                              {p.name} {p.isGoalkeeper ? '(G)' : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center px-4 self-center">
                        <div className="text-[#f06600] font-headings font-black text-2xl italic">VS</div>
                        {match.status === 'finished' && (
                          <div className="bg-[#2a2a2a] px-3 py-1 rounded mt-1">
                            <span className="text-white font-black text-lg">{match.scoreA} x {match.scoreB}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-center md:text-left flex-1">
                        {editingMatchId === match.id && currentUser?.role === 'admin' ? (
                          <select 
                            value={match.teamB}
                            onChange={(e) => updateMatchTeams(match.id, match.teamA, e.target.value)}
                            className="bg-[#2a2a2a] text-white p-2 text-center md:text-left rounded text-xl md:text-3xl mb-2 w-full uppercase font-bold font-headings"
                          >
                            {teams.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        ) : (
                          <p className="font-headings font-black text-xl md:text-3xl uppercase">{match.teamB}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          {players.filter(p => p.team.split(',').includes(match.teamB)).map(p => (
                            <div key={p.id} className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
                              {p.name} {p.isGoalkeeper ? '(G)' : ''}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 z-10 w-full md:w-auto self-start mt-4 md:mt-0">
                    {match.status === 'scheduled' ? (
                      <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                        {currentUser?.role === 'admin' && finishingMatchId !== match.id && editingMatchId !== match.id && (
                          <>
                            <button 
                              onClick={() => { setFinishingMatchId(match.id); setScoreA(''); setScoreB(''); }}
                              className="w-full md:w-auto bg-[#2a2a2a] text-gray-300 px-6 py-3 font-headings font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#333] transition-colors"
                            >
                              Definir Placar
                            </button>
                            <button 
                              onClick={() => setEditingMatchId(match.id)}
                              className="w-full md:w-auto bg-[#2a2a2a] text-gray-300 px-6 py-3 font-headings font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#333] transition-colors"
                            >
                              Trocar Adversário
                            </button>
                          </>
                        )}
                        {editingMatchId === match.id && currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => setEditingMatchId(null)}
                            className="w-full md:w-auto bg-primary text-[#4b1b00] px-6 py-3 font-headings font-bold text-xs uppercase tracking-widest rounded-lg"
                          >
                            Concluir Edição
                          </button>
                        )}
                        {currentUser?.role === 'admin' && finishingMatchId !== match.id && editingMatchId !== match.id && (
                          <button 
                            onClick={() => removeMatch(match.id)}
                            className="w-full md:w-auto p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center"
                            title="Excluir Jogo"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        {finishingMatchId === match.id && currentUser?.role === 'admin' && (
                          <div className="flex items-center gap-2 bg-[#131313] p-2 rounded-lg border border-white/10 w-full md:w-auto">
                            <input type="number" value={scoreA} onChange={e => setScoreA(e.target.value)} placeholder="0" className="w-12 bg-[#2a2a2a] border-none text-center text-white font-bold rounded p-1" />
                            <span className="text-gray-500 font-bold">x</span>
                            <input type="number" value={scoreB} onChange={e => setScoreB(e.target.value)} placeholder="0" className="w-12 bg-[#2a2a2a] border-none text-center text-white font-bold rounded p-1" />
                            <button 
                              onClick={() => {
                                if (scoreA && scoreB) {
                                  finishMatch(match.id, parseInt(scoreA), parseInt(scoreB));
                                  setFinishingMatchId(null);
                                }
                              }}
                              className="bg-green-500 text-[#0a250d] px-3 py-1 ml-2 rounded font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                              Salvar
                            </button>
                            <button onClick={() => setFinishingMatchId(null)} className="text-gray-500 hover:text-white px-2">X</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-gray-500 border border-gray-700 px-4 py-2 rounded-lg">Partida Finalizada</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {matches.length === 0 && (
          <div className="p-20 text-center bg-[#1c1b1b] rounded-xl border border-dashed border-white/10">
             <p className="text-gray-500 font-bold uppercase text-sm italic">Nenhuma rodada agendada pelo administrador.</p>
          </div>
        )}
      </div>

      {/* Location Context */}
      <div className="mt-12">
        <div className="bg-[#1c1b1b] rounded-xl overflow-hidden min-h-[300px] relative group border border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Court" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBClPnDYETMKCwk_IZoshsh-AJEVCBKZ3VNVulqy1CNgTTAyCQAz2swI8-Zn58VHbzJczSUNQ_pbWl4S_uKq6iu0aQeHonIXrZHemwTD1VZz9tDtVS1OJ6cAhiTOPmtBpFGTPS6kvM869kidf3Bo1XXJSKuGGc0OD102MOxuIDn491pNVP5SiogZ1dflkmZdb9HvqkPenaT4kQ6TOEwIekSxJI3fSWEx6OSp1E3VOYy-ay_Dg7fHFddFAD7o2sEVStFQLWH8nO9KYmN"/>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent z-10 pointer-events-none"></div>
          <div className="relative z-20 p-6 md:p-10 h-full flex flex-col justify-end">
            <span className="text-primary font-headings font-bold text-xs uppercase tracking-widest mb-3">Local</span>
            <h4 className="font-headings font-black text-4xl md:text-5xl uppercase italic tracking-tighter">{courtSettings.name}</h4>
            <p className="text-[#ffdbcb] font-sans text-sm md:text-base mt-2 max-w-lg">{courtSettings.address}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
