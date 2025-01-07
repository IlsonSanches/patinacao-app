'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Patinador {
  nome: string;
  cpf: string;
  dataNascimento: string;
  equipe: string;
}

interface Equipe {
  id: string;
  nomeEquipe: string;
}

export default function EditarPatinador() {
  const params = useParams();
  const patinadorId = params?.id as string;
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfOriginal, setCpfOriginal] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [equipe, setEquipe] = useState('');
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      if (!patinadorId) {
        toast.error('ID do patinador não encontrado');
        router.push('/dashboard/patinadores');
        return;
      }

      try {
        // Carregar equipes
        const equipesSnapshot = await getDocs(collection(db, 'equipes'));
        const equipesData = equipesSnapshot.docs.map(doc => ({
          id: doc.id,
          nomeEquipe: doc.data().nomeEquipe
        }));
        setEquipes(equipesData);

        // Carregar dados do patinador
        const patinadorDoc = await getDoc(doc(db, 'patinadores', patinadorId));
        if (patinadorDoc.exists()) {
          const data = patinadorDoc.data() as Patinador;
          setNome(data.nome);
          setCpf(data.cpf);
          setCpfOriginal(data.cpf);
          setDataNascimento(data.dataNascimento);
          setEquipe(data.equipe || '');
        } else {
          toast.error('Patinador não encontrado');
          router.push('/dashboard/patinadores');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [patinadorId, router]);

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
    
    if (!patinadorId) {
      toast.error('ID do patinador não encontrado');
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
      // Verificar se já existe um patinador com o mesmo CPF (exceto o atual)
      if (cpf !== cpfOriginal) {
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
      }

      // Atualizar patinador
      await updateDoc(doc(db, 'patinadores', patinadorId), {
        nome,
        cpf,
        dataNascimento,
        equipe,
        dataAtualizacao: new Date().toISOString(),
        ...(user?.email ? { usuarioAtualizacao: user.email } : {})
      });

      toast.success('Patinador atualizado com sucesso!');
      router.push('/dashboard/patinadores');
    } catch (error) {
      console.error('Erro ao atualizar patinador:', error);
      toast.error('Erro ao atualizar patinador');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Patinador
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/patinadores')}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
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