import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDot, Info, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password)) {
      navigate('/');
    } else {
      setError('E-mail ou senha incorretos. Tente admin@futsal.com / 123');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-surface text-textPrimary font-sans">
      {/* Left Side */}
      <section className="relative w-full md:w-1/2 min-h-[353px] md:min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqDacfF8WBAExBrPHuVSIsyb8zWHOWKcCv0siwUrNyMZDpD3tcHSfWtNsgfIaKGx8qq7aj6EjA5V81ecTq4UKKNzihoQUt9-SK8MBFUnw8Suta94LuJcNC8s2Fr1FwXKzhl29GBcoG2YqWNRA2e2ukVOTf3P9Sl-V8Ae2DsK7L3qFsb_vSjn2-HJd47o_pL6-9yKFAlF-ghfpdFfyQG_ghkRIHq57drBxqBswRQhkb3xM6N_N9xy5rkJZBKhBZ8Zs7JF0IMfDrrLQ8')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/20 via-[#131313]/90 to-[#131313]"></div>
        
        <div className="relative h-full flex flex-col justify-end p-8 md:p-16 z-10">
          <div className="flex items-center gap-2 mb-6">
            <CircleDot className="text-[#f06600] w-10 h-10" />
            <h1 className="font-headings font-black italic text-3xl tracking-tighter text-[#f06600] uppercase">
              SEM TALENTOS
            </h1>
          </div>
          <h2 className="font-headings font-black text-5xl md:text-7xl leading-none uppercase tracking-tighter text-white max-w-md">
            Amizade <span className="text-primary">vence</span> talento.
          </h2>
          <p className="mt-6 font-medium text-lg text-[#ffdbcb] max-w-xs uppercase tracking-widest border-l-4 border-[#f06600] pl-4">
            A energia das quadras urbanas no seu bolso.
          </p>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h3 className="font-headings font-extrabold text-3xl text-[#e5e2e1]">BEM-VINDO AO JOGO</h3>
            <p className="text-[#e3bfb2] font-medium text-sm">Entre com suas credenciais para acessar o painel.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 animate-shake">
                <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <p className="text-xs text-red-500 font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-headings font-bold text-[10px] text-primary uppercase tracking-widest ml-1" htmlFor="email">E-MAIL</label>
              <input 
                className="w-full bg-[#1c1b1b] border-none rounded-lg py-4 px-4 text-[#e5e2e1] placeholder:text-[#5a4138] focus:ring-1 focus:ring-primary transition-all" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: admin@futsal.com" 
                type="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-headings font-bold text-[10px] text-primary uppercase tracking-widest ml-1" htmlFor="password">SENHA</label>
              <input 
                className="w-full bg-[#1c1b1b] border-none rounded-lg py-4 px-4 text-[#e5e2e1] placeholder:text-[#5a4138] focus:ring-1 focus:ring-primary transition-all" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha" 
                type="password"
                required
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-gradient-to-br from-[#f06600] to-primary py-4 rounded-lg font-headings font-black text-[#7a3000] uppercase tracking-tighter text-lg shadow-[0_8px_24px_-10px_#f06600] active:scale-95 duration-150 transition-transform">
                ENTRAR NA QUADRA
              </button>
            </div>
          </form>

          <div className="bg-[#1c1b1b] p-4 rounded-xl border border-[#353534] flex items-start gap-3">
             <div className="bg-primary/20 p-2 rounded-lg mt-0.5">
                <Info className="text-primary w-4 h-4" />
             </div>
             <div>
                <p className="font-headings font-bold text-[10px] text-white uppercase tracking-widest mb-1">Acesso do Admin</p>
                <p className="text-[10px] text-gray-500 font-medium">Use <span className="text-primary font-bold">admin@futsal.com</span> com senha <span className="text-primary font-bold">123</span> para entrar como organizador.</p>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
