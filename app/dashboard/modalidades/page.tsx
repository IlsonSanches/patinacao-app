'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Modalidade {
  id: string;
  nomeModalidade: string;
  codigoModalidade: string;
  sexo: 'F' | 'M';
  status: 'ATIVO' | 'INATIVO';
}

export default function ListaModalidades() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarModalidades();
  }, []);

  const carregarModalidades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'modalidades'));
      const modalidadesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Modalidade[];
      
      setModalidades(modalidadesData);
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
      toast.error('Erro ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id: string) => {
    router.push(`/dashboard/editar-modalidade/${id}`);
  };

  const handleDeletar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta modalidade?')) {
      try {
        await deleteDoc(doc(db, 'modalidades', id));
        toast.success('Modalidade excluída com sucesso!');
        carregarModalidades();
      } catch (error) {
        console.error('Erro ao excluir modalidade:', error);
        toast.error('Erro ao excluir modalidade');
      }
    }
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
        <h1 className="text-2xl font-bold">Modalidades Cadastradas</h1>
      </div>

      {modalidades.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma modalidade cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modalidades.map((modalidade) => (
            <div
              key={modalidade.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-4">{modalidade.nomeModalidade}</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Código:</span> {modalidade.codigoModalidade}</p>
                <p><span className="font-medium">Sexo:</span> {modalidade.sexo === 'F' ? 'Feminino' : 'Masculino'}</p>
                <p><span className="font-medium">Status:</span> {modalidade.status}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleEditar(modalidade.id)}
                  className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletar(modalidade.id)}
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