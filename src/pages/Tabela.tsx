import { useAppContext } from '../context/AppContext';

export default function Tabela() {
  const { players, matches, teams } = useAppContext();

  // Cálculo dinâmico da tabela
  const standings = teams.map(teamName => {
    const teamMatches = matches.filter(m => m.status === 'finished' && (m.teamA === teamName || m.teamB === teamName));
    
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    teamMatches.forEach(m => {
      const isTeamA = m.teamA === teamName;
      const scoreTeam = isTeamA ? (m.scoreA || 0) : (m.scoreB || 0);
      const scoreOpponent = isTeamA ? (m.scoreB || 0) : (m.scoreA || 0);

      goalsFor += scoreTeam;
      goalsAgainst += scoreOpponent;

      if (scoreTeam > scoreOpponent) won++;
      else if (scoreTeam === scoreOpponent) drawn++;
      else lost++;
    });

    return {
      name: teamName,
      played: teamMatches.length,
      won,
      drawn,
      lost,
      points: (won * 3) + drawn,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst
    };
  })
  .sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  })
  .map((team, idx) => ({
    ...team,
    rank: String(idx + 1).padStart(2, '0'),
    isUser: team.name === 'SEM TALENTOS' // Podia ser dinâmico baseado no time do usuário, mas vamos manter o destaque
  }));

  // Encontrar o artilheiro real do estado global
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];

  return (
    <main className="pt-24 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Hero Section/Headline */}
      <section className="mb-10 relative overflow-hidden rounded-xl bg-[#1c1b1b] p-8 border-l-4 border-[#f06600]">
        <div className="relative z-10">
          <p className="font-headings font-bold text-primary uppercase tracking-[0.2em] text-xs mb-2">TEMPORADA 2024</p>
          <h2 className="font-headings font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-4">
            TABELA DE<br/><span className="text-[#f06600]">CLASSIFICAÇÃO</span>
          </h2>
          <div className="flex gap-4">
            <span className="bg-[#2a2a2a] px-3 py-1 rounded text-[10px] font-headings font-bold uppercase tracking-widest text-[#e3bfb2] flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> AO VIVO: RODADA 14
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-l from-[#f06600]/40 to-transparent"></div>
        </div>
      </section>

      {/* Standings Table Container */}
      <section className="bg-[#201f1f] rounded-lg overflow-hidden shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-[#2a2a2a] p-4 border-b border-white/5">
          <div className="col-span-1 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Pos</div>
          <div className="col-span-5 font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">Time</div>
          <div className="col-span-1 text-center font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500 hidden md:block">J</div>
          <div className="col-span-1 text-center font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">V</div>
          <div className="col-span-1 text-center font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">E</div>
          <div className="col-span-1 text-center font-headings font-bold text-[10px] uppercase tracking-widest text-gray-500">D</div>
          <div className="col-span-3 md:col-span-2 text-right font-headings font-bold text-[10px] uppercase tracking-widest text-primary">PTS</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {standings.map((team, index) => (
            <div key={team.rank} className={`grid grid-cols-12 p-4 items-center border-b border-white/5 transition-colors group ${
              team.isUser ? 'bg-[#f06600]/10 border-l-4 border-l-primary hover:bg-[#f06600]/20' : 'hover:bg-[#2a2a2a]'
            }`}>
              <div className={`col-span-1 font-headings font-black text-xl italic ${index === 0 || team.isUser ? 'text-primary' : 'text-[#e3bfb2]'}`}>
                {team.rank}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <span className={`font-headings font-bold text-sm tracking-tight uppercase truncate ${team.isUser ? 'text-primary' : 'text-textPrimary'}`}>
                  {team.name}
                </span>
              </div>
              <div className="col-span-1 text-center font-sans font-medium text-sm text-[#e3bfb2] hidden md:block">{team.played}</div>
              <div className="col-span-1 text-center font-sans font-medium text-sm text-[#e3bfb2]">{team.won}</div>
              <div className="col-span-1 text-center font-sans font-medium text-sm text-[#e3bfb2]">{team.drawn}</div>
              <div className="col-span-1 text-center font-sans font-medium text-sm text-[#e3bfb2]">{team.lost}</div>
              <div className={`col-span-3 md:col-span-2 text-right font-headings font-black text-lg ${index === 0 || team.isUser ? 'text-[#ffdbcb]' : 'text-textPrimary'}`}>
                {team.points}
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Legend */}
        <div className="p-4 bg-[#1c1b1b] flex gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">Playoffs Divisão A</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-3 h-3 bg-[#a14000] rounded-sm"></div>
            <span className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">Playoffs Divisão B</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-3 h-3 bg-[#93000a] rounded-sm"></div>
            <span className="text-[10px] font-headings font-bold uppercase tracking-wider text-gray-500">Zona de Rebaixamento</span>
          </div>
        </div>
      </section>

      {/* Stats Overview Bento Grid */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Scorer (Sincronizado com Admin) */}
        <div className="bg-[#201f1f] p-5 rounded-lg border-t-2 border-primary relative overflow-hidden group hover:bg-[#252424] transition-all">
          <p className="font-headings font-bold text-[10px] text-primary uppercase tracking-widest mb-4">Artilheiro</p>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="font-headings font-black text-2xl uppercase leading-none mb-1 group-hover:text-primary transition-colors">
                {topScorer?.name.split(' ')[0]}<br/>
                <span className="text-[#f06600]">{topScorer?.name.split(' ').slice(1).join(' ')}</span>
              </h4>
              <p className="text-[10px] font-headings font-bold text-gray-500 uppercase">{topScorer?.team || 'Sem Clube'}</p>
            </div>
            <div className="text-right">
              <span className="font-headings font-black text-4xl text-primary leading-none">{topScorer?.goals}</span>
              <p className="text-[10px] font-headings font-bold text-gray-500 uppercase">Gols</p>
            </div>
          </div>
        </div>

        {/* Best Defense */}
        <div className="bg-[#201f1f] p-5 rounded-lg border-t-2 border-[#ffb59e] relative overflow-hidden">
          <p className="font-headings font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-4">Melhor Defesa</p>
          <div className="flex items-end justify-between">
            {(() => {
              const bestDefense = [...standings].sort((a, b) => (a.goalsAgainst / (a.played || 1)) - (b.goalsAgainst / (b.played || 1)))[0];
              return (
                <>
                  <div>
                    <h4 className="font-headings font-black text-2xl uppercase leading-none mb-1">
                      {bestDefense?.name.split(' ')[0]}<br/>
                      <span className="text-[#ffb59e]">{bestDefense?.name.split(' ').slice(1).join(' ')}</span>
                    </h4>
                    <p className="text-[10px] font-headings font-bold text-gray-500 uppercase">
                      Média {(bestDefense?.goalsAgainst / (bestDefense?.played || 1)).toFixed(1)} Gols/J
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-headings font-black text-4xl text-white leading-none">{bestDefense?.goalsAgainst}</span>
                    <p className="text-[10px] font-headings font-bold text-gray-500 uppercase">Gols Sofridos</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

      </section>

      {/* NOVO: HISTÓRICO DE RESULTADOS */}
      <section className="mt-12 bg-[#1c1b1b] rounded-2xl border border-white/5 overflow-hidden shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#f06600]/10 to-transparent border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-headings font-black text-xl md:text-2xl uppercase italic tracking-tighter">Histórico de Confrontos</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Resultados oficiais da temporada</p>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {matches.filter(m => m.status === 'finished').length > 0 ? (
            matches
              .filter(m => m.status === 'finished')
              .sort((a, b) => {
                const dateA = a.date ? a.date.split('/').reverse().join('-') : '';
                const dateB = b.date ? b.date.split('/').reverse().join('-') : '';
                return dateB.localeCompare(dateA);
              })
              .map(match => (
                <div key={match.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/[0.02] transition-all">
                  <div className="flex flex-col items-center md:items-start flex-1 gap-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{match.date} — {match.time}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-headings font-black text-sm md:text-lg uppercase italic w-24 md:w-40 text-center md:text-right truncate text-gray-200">{match.teamA}</span>
                      <div className="bg-[#131313] px-5 py-2 rounded-xl border border-white/5 font-headings font-black text-xl md:text-2xl text-primary italic shadow-inner min-w-[120px] text-center">
                        {match.scoreA} x {match.scoreB}
                      </div>
                      <span className="font-headings font-black text-sm md:text-lg uppercase italic w-24 md:w-40 text-center md:text-left truncate text-gray-200">{match.teamB}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2 opacity-30 group-hover:opacity-100 transition-opacity hidden md:flex">
                     <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-[#1c1b1b] flex items-center justify-center font-black text-[10px] text-primary">MVP</div>
                  </div>
                </div>
              ))
          ) : (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
               <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Aguardando a primeira partida terminada...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
