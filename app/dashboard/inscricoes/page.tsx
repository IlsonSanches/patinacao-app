'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Inscricao {
  id: string;
  equipeNome: string;
  patinadorNome: string;
  modalidadeNome: string;
  categoriaNome: string;
  idade: string;
  dataCadastro: string;
}

export default function ListaInscricoes() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  };

  useEffect(() => {
    const carregarInscricoes = async () => {
      try {
        const inscricoesSnapshot = await getDocs(collection(db, 'inscricoes'));
        const inscricoesData = inscricoesSnapshot.docs.map(doc => ({
          id: doc.id,
          equipeNome: doc.data().equipeNome,
          patinadorNome: doc.data().patinadorNome,
          modalidadeNome: doc.data().modalidadeNome,
          categoriaNome: doc.data().categoriaNome,
          idade: doc.data().idade,
          dataCadastro: doc.data().dataCadastro
        })) as Inscricao[];

        // Ordenar por nome do patinador
        inscricoesData.sort((a, b) => 
          a.patinadorNome.localeCompare(b.patinadorNome)
        );

        setInscricoes(inscricoesData);
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
        toast.error('Erro ao carregar inscrições');
      } finally {
        setLoading(false);
      }
    };

    carregarInscricoes();
  }, []);

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'inscricoes', id));
      setInscricoes(inscricoes.filter(inscricao => inscricao.id !== id));
      toast.success('Inscrição excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir inscrição:', error);
      toast.error('Erro ao excluir inscrição');
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Inscrições
          </h1>

          <button
            onClick={() => router.push('/dashboard/cadastrar-inscricao')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nova Inscrição
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patinador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modalidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inscricoes.map((inscricao) => (
                <tr key={inscricao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inscricao.patinadorNome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inscricao.equipeNome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inscricao.modalidadeNome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inscricao.categoriaNome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inscricao.idade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/dashboard/editar-inscricao/${inscricao.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluir(inscricao.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 