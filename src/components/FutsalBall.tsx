const FutsalBall = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sombra suave de base */}
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" fillOpacity="0.05" />
      
      {/* Corpo da bola */}
      <circle cx="50" cy="50" r="45" fill="white" stroke="#F06600" strokeWidth="2" />
      
      {/* Gomos da bola (Estilo Futsal Clássico) */}
      <path d="M50 5L35 30H65L50 5Z" fill="#F06600" />
      <path d="M50 95L35 70H65L50 95Z" fill="#F06600" />
      <path d="M5 50L30 35V65L5 50Z" fill="#F06600" />
      <path d="M95 50L70 35V65L95 50Z" fill="#F06600" />
      
      {/* Detalhes internos - Linhas de profundidade */}
      <circle cx="50" cy="50" r="45" stroke="black" strokeOpacity="0.1" strokeWidth="0.5" strokeDasharray="2 2" />
      
      {/* Texto SEM TALENTOS centralizado */}
      <rect x="20" y="42" width="60" height="16" rx="2" fill="white" stroke="#F06600" strokeWidth="1" />
      <text 
        x="50" 
        y="53.5" 
        textAnchor="middle" 
        fill="#F06600" 
        style={{ 
          fontFamily: 'Lexend, sans-serif', 
          fontWeight: '900', 
          fontSize: '7px',
          letterSpacing: '-0.2px',
          textTransform: 'uppercase'
        }}
      >
        SEM TALENTOS
      </text>
      <text 
        x="50" 
        y="58" 
        textAnchor="middle" 
        fill="#F06600" 
        style={{ 
          fontFamily: 'Lexend, sans-serif', 
          fontWeight: '400', 
          fontSize: '3px',
          letterSpacing: '1px'
        }}
      >
        FUTSAL
      </text>
    </svg>
  );
};

export default FutsalBall;
