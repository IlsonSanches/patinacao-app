'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Patinador {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  equipe: string;
  dataCadastro: string;
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
    setLoading(true);

    try {
      const patinadorRef = doc(db, 'patinadores', patinadorId);
      await updateDoc(patinadorRef, {
        nome,
        cpf,
        dataNascimento,
        equipe,
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Editar Patinador</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-gray-700 font-bold mb-2">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dataNascimento" className="block text-gray-700 font-bold mb-2">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="dataNascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="equipe" className="block text-gray-700 font-bold mb-2">
            Equipe
          </label>
          <select
            id="equipe"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push('/dashboard/patinadores')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 