'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.code === 'auth/invalid-credential') {
        toast.error('Email ou senha incorretos');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido');
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00A3FF]">
      <div className="flex min-h-screen">
        {/* Lado Esquerdo - Logo e Texto */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white">
          <div className="text-center">
            <img src="/logo.png" alt="Logo" className="mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-[#1B224B] mb-4">
              Bem-vindo ao GP Manager
            </h1>
            <p className="text-gray-600">
              Sistema de Gestão para Competições de Patinação
            </p>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Login</h2>
              <p className="text-white/80 mt-2">
                Entre com suas credenciais para acessar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white"
                  placeholder="Senha"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg bg-white text-[#00A3FF] font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#00A3FF]
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/registro')}
                  className="text-white/80 hover:text-white text-sm"
                >
                  Não tem uma conta? Registre-se
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 