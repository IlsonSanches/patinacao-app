'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Patinador {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  equipe: string;
  dataCadastro: string;
  docIdentificacaoUrl: string;
  atestadoMedicoUrl: string;
}

interface Equipe {
  id: string;
  nomeEquipe: string;
}

export default function Patinadores() {
  const [patinadores, setPatinadores] = useState<Patinador[]>([]);
  const [equipes, setEquipes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar equipes
        const equipesSnapshot = await getDocs(collection(db, 'equipes'));
        const equipesMap: Record<string, string> = {};
        equipesSnapshot.docs.forEach(doc => {
          equipesMap[doc.id] = doc.data().nomeEquipe;
        });
        setEquipes(equipesMap);

        // Carregar patinadores
        const patinadoresSnapshot = await getDocs(collection(db, 'patinadores'));
        const patinadoresData = patinadoresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Patinador[];

        // Ordenar patinadores por nome com verificação de segurança
        patinadoresData.sort((a, b) => {
          const nomeA = a.nome || '';
          const nomeB = b.nome || '';
          return nomeA.localeCompare(nomeB);
        });
        
        setPatinadores(patinadoresData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este patinador?')) {
      try {
        await deleteDoc(doc(db, 'patinadores', id));
        setPatinadores(prev => prev.filter(pat => pat.id !== id));
        toast.success('Patinador excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir patinador:', error);
        toast.error('Erro ao excluir patinador');
      }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Patinadores
          </h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-patinador')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Novo Patinador
          </button>
        </div>

        {patinadores.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            Nenhum patinador cadastrado
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Nascimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documentos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patinadores.map((patinador) => (
                  <tr key={patinador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patinador.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patinador.cpf}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(patinador.dataNascimento).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {equipes[patinador.equipe] || 'Não definida'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {patinador.docIdentificacaoUrl && (
                          <a
                            href={patinador.docIdentificacaoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Identificação
                          </a>
                        )}
                        {patinador.atestadoMedicoUrl && (
                          <a
                            href={patinador.atestadoMedicoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Atestado
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/editar-patinador/${patinador.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(patinador.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 