'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Torneio {
  id: string;
  nomeTorneio: string;
  dataRealizacao: string;
  cidade: string;
  estado: string;
  dataMaximaInscricao: string;
}

export default function ListaTorneios() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarTorneios();
  }, []);

  const carregarTorneios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const torneiosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Torneio[];
      
      setTorneios(torneiosData);
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
      toast.error('Erro ao carregar torneios');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id: string) => {
    router.push(`/dashboard/editar-torneio/${id}`);
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este torneio?')) {
      try {
        await deleteDoc(doc(db, 'torneios', id));
        toast.success('Torneio excluído com sucesso!');
        carregarTorneios();
      } catch (error) {
        console.error('Erro ao excluir torneio:', error);
        toast.error('Erro ao excluir torneio');
      }
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Torneios Cadastrados</h1>
      </div>

      {torneios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum torneio cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneios.map((torneio) => (
            <div
              key={torneio.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-4">{torneio.nomeTorneio}</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Data de Realização:</span> {formatarData(torneio.dataRealizacao)}</p>
                <p><span className="font-medium">Local:</span> {torneio.cidade} - {torneio.estado}</p>
                <p><span className="font-medium">Inscrições até:</span> {formatarData(torneio.dataMaximaInscricao)}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEditar(torneio.id)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletar(torneio.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}