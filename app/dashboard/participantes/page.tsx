'use client';

import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import ParticipanteModal from '@/components/ParticipanteModal';
import { Participante, createParticipante, getParticipantes, deleteParticipante } from '@/services/participantes';

export default function ParticipantesPage() {
  const [activeTab, setActiveTab] = useState<'atletas' | 'tecnicos' | 'juizes'>('atletas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipantes();
  }, [loadParticipantes]);

  const loadParticipantes = async () => {
    setLoading(true);
    try {
      const tipo = activeTab === 'atletas' ? 'atleta' : activeTab === 'tecnicos' ? 'tecnico' : 'juiz';
      const data = await getParticipantes(tipo);
      setParticipantes(data);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Participante, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createParticipante(data);
      await loadParticipantes();
    } catch (error) {
      console.error('Erro ao criar participante:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este participante?')) {
      try {
        await deleteParticipante(id);
        await loadParticipantes();
      } catch (error) {
        console.error('Erro ao excluir participante:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Participantes</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Novo Participante
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('atletas')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'atletas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Atletas
          </button>
          <button
            onClick={() => setActiveTab('tecnicos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tecnicos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Técnicos
          </button>
          <button
            onClick={() => setActiveTab('juizes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'juizes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Juízes
          </button>
        </nav>
      </div>

      {/* Tabela */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Carregando...
                </td>
              </tr>
            ) : participantes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              participantes.map((participante) => (
                <tr key={participante.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participante.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participante.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {participante.telefone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(participante.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ParticipanteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        tipo={activeTab}
      />
    </div>
  );
} 