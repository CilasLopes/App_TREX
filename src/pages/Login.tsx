import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDot, Info, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login, loginWithGoogle } = useAppContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setIsSubmitting(false);
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
          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-3 w-full bg-[#1c1b1b] border border-[#353534] hover:bg-[#252424] py-3.5 rounded-lg font-bold text-white transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.94 0 3.7.67 5.08 2l3.8-3.8C18.47 1.15 15.42 0 12 0 7.31 0 3.25 2.69 1.18 6.6l4.43 3.44c1.05-3.14 4-5.04 6.39-5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.57-.2-2.32H12v4.39h6.44c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.8c2.1-1.93 3.32-4.78 3.32-8.35z" />
                <path fill="#FBBC05" d="M5.61 14.56c-.26-.8-.41-1.65-.41-2.56s.15-1.76.41-2.56L1.18 6.6C.43 8.22 0 10.06 0 12s.43 3.78 1.18 5.4l4.43-3.44z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.6-2.8c-1.16.78-2.65 1.25-4.33 1.25-3.34 0-6.17-2.25-7.18-5.28l-4.43 3.44C3.25 21.31 7.31 24 12 24z" />
              </svg>
              LOGAR COM GOOGLE
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
