'use client';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Arbitro {
  id: string;
  nomeCompleto: string;
  cpf: string;
  nivelAvaliacao: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  status: string;
}

export default function ListaArbitros() {
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarArbitros = async () => {
      try {
        const arbitrosRef = collection(db, 'arbitros');
        const q = query(arbitrosRef, where('status', '==', 'ativo'));
        const querySnapshot = await getDocs(q);
        
        const arbitrosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Arbitro[];

        arbitrosData.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
        setArbitros(arbitrosData);
      } catch (error) {
        console.error('Erro ao carregar árbitros:', error);
        toast.error('Erro ao carregar lista de árbitros');
      } finally {
        setLoading(false);
      }
    };

    carregarArbitros();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Carregando árbitros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Árbitros</h1>
          <button
            onClick={() => router.push('/dashboard/cadastrar-arbitro')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Árbitro
          </button>
        </div>

        {arbitros.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum árbitro cadastrado.</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    Nível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade/Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {arbitros.map((arbitro) => (
                  <tr key={arbitro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {arbitro.nomeCompleto}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{arbitro.cpf}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{arbitro.nivelAvaliacao}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {arbitro.cidade}/{arbitro.estado}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        <div>{arbitro.email}</div>
                        <div>{arbitro.telefone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/dashboard/editar-arbitro/${arbitro.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
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