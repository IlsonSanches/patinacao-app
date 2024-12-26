'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function CadastrarEquipe() {
  const [email, setEmail] = useState('');
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [palavraChave, setPalavraChave] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'equipes'), {
        email,
        nomeEquipe,
        palavraChave,
        userId: user?.uid,
        createdAt: new Date().toISOString()
      });

      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao cadastrar equipe. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#00A3FF] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="GP Logo" className="h-12" />
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-white hover:text-blue-100"
        >
          Voltar
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8 flex gap-8">
        {/* Left Section */}
        <div className="w-1/2 bg-[#E6E9F2] p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-[#1B224B] mb-4">
            Grande Premio de Patinação 2025<br />
            App -Cadastramento e Inscrição.
          </h1>
          <p className="text-[#1B224B]">
            Grandes equipes, atletas iniciantes formato livre sob regulamento 
            compartilhado e desenvolvimento continuo.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2">
          <h2 className="text-2xl font-bold text-[#1B224B] mb-6">
            Cadastrar uma Equipe
          </h2>
          <p className="mb-6 text-[#1B224B]">
            Você técnico de equipe pode cadastrar sua equipe e atletas no Grande Premio de Patinação 2025
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1B224B] mb-2">Endereço de Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Endereço de Email"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Nome da Equipe</label>
              <input 
                type="text" 
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome da Equipe"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Palavra-chave</label>
              <input 
                type="password" 
                value={palavraChave}
                onChange={(e) => setPalavraChave(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Palavra-chave"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#00A3FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Equipe'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 