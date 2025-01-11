'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Equipe {
  id: string;
  nomeEquipe: string;
}

export default function CadastrarPatinador() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [equipe, setEquipe] = useState('');
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarEquipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'equipes'));
        const equipesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nomeEquipe: doc.data().nomeEquipe
        }));
        setEquipes(equipesData);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
        toast.error('Erro ao carregar equipes');
      }
    };

    carregarEquipes();
  }, []);

  // Formatar CPF
  const handleCpf = (value: string) => {
    const cpfNumbers = value.replace(/\D/g, '');
    if (cpfNumbers.length <= 11) {
      const cpfFormatted = cpfNumbers.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
      setCpf(cpfFormatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !cpf || !dataNascimento || !equipe) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    // Validar CPF
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      toast.error('CPF inválido');
      return;
    }

    setLoading(true);

    try {
      // Verificar se já existe um patinador com o mesmo CPF
      const patinadorQuery = query(
        collection(db, 'patinadores'),
        where('cpf', '==', cpf)
      );
      const patinadorSnapshot = await getDocs(patinadorQuery);

      if (!patinadorSnapshot.empty) {
        toast.error('Já existe um patinador com este CPF');
        setLoading(false);
        return;
      }

      // Cadastrar novo patinador
      await addDoc(collection(db, 'patinadores'), {
        nome,
        cpf,
        dataNascimento,
        equipe,
        dataCadastro: new Date().toISOString(),
        usuarioCadastro: user?.email || 'sistema'
      });

      toast.success('Patinador cadastrado com sucesso!');
      router.push('/dashboard/patinadores');
    } catch (error) {
      console.error('Erro ao cadastrar patinador:', error);
      toast.error('Erro ao cadastrar patinador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Cadastrar Novo Patinador
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => handleCpf(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipe
              </label>
              <select
                value={equipe}
                onChange={(e) => setEquipe(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma equipe</option>
                {equipes.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nomeEquipe}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/patinadores')}
                disabled={loading}
                className={`
                  flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 