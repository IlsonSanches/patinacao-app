'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db, storage } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Equipe {
  id: string;
  nomeEquipe: string;
}

export default function CadastrarPatinador() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idade, setIdade] = useState<number | null>(null);
  const [equipeId, setEquipeId] = useState('');
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [exameMedico, setExameMedico] = useState<File | null>(null);
  const [documentoId, setDocumentoId] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) { // 14 é o tamanho do CPF formatado
      setCpf(formatted);
    }
  };

  // Formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    if (formatted.length <= 15) { // 15 é o tamanho do telefone formatado
      setTelefone(formatted);
    }
  };

  // Calcular idade
  useEffect(() => {
    if (dataNascimento) {
      const nascimento = new Date(dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      
      setIdade(idade);
    } else {
      setIdade(null);
    }
  }, [dataNascimento]);

  // Carregar equipes
  useEffect(() => {
    const loadEquipes = async () => {
      if (!user) return;
      
      try {
        // Simplificando a query para pegar todas as equipes
        const equipesRef = collection(db, 'equipes');
        const snapshot = await getDocs(equipesRef);
        
        const equipesData = snapshot.docs.map(doc => ({
          id: doc.id,
          nomeEquipe: doc.data().nomeEquipe
        }));
        
        console.log('Equipes carregadas:', equipesData); // Debug
        setEquipes(equipesData);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
        toast.error('Erro ao carregar equipes');
      }
    };

    loadEquipes();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let exameMedicoUrl = '';
      let documentoIdUrl = '';

      if (exameMedico) {
        const exameMedicoRef = ref(storage, `exames-medicos/${Date.now()}-${exameMedico.name}`);
        await uploadBytes(exameMedicoRef, exameMedico);
        exameMedicoUrl = await getDownloadURL(exameMedicoRef);
      }

      if (documentoId) {
        const documentoIdRef = ref(storage, `documentos-id/${Date.now()}-${documentoId.name}`);
        await uploadBytes(documentoIdRef, documentoId);
        documentoIdUrl = await getDownloadURL(documentoIdRef);
      }

      // Encontrar o nome da equipe selecionada
      const equipeSelected = equipes.find(eq => eq.id === equipeId);

      await addDoc(collection(db, 'patinadores'), {
        nome,
        cpf,
        telefone,
        dataNascimento,
        idade,
        equipeId,
        equipeNome: equipeSelected?.nomeEquipe || '',
        exameMedicoUrl,
        documentoIdUrl,
        userId: user?.uid,
        createdAt: new Date().toISOString()
      });

      toast.success('Patinador cadastrado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar patinador:', error);
      toast.error('Erro ao cadastrar patinador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1B224B] mb-6">
            Cadastrar Novo Patinador
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#1B224B] mb-2">Nome do Patinador</label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">CPF</label>
              <input 
                type="text" 
                value={cpf}
                onChange={handleCPFChange}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="000.000.000-00"
                required
                maxLength={14}
              />
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Telefone</label>
              <input 
                type="tel" 
                value={telefone}
                onChange={handleTelefoneChange}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                placeholder="(00) 00000-0000"
                required
                maxLength={15}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1B224B] mb-2">Data de Nascimento</label>
                <input 
                  type="date" 
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#1B224B] mb-2">Idade</label>
                <input 
                  type="text" 
                  value={idade !== null ? `${idade} anos` : ''}
                  className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Equipe</label>
              <select
                value={equipeId}
                onChange={(e) => setEquipeId(e.target.value)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                required
              >
                <option value="">Selecione uma equipe</option>
                {equipes.length === 0 ? (
                  <option value="" disabled>Carregando equipes...</option>
                ) : (
                  equipes.map((equipe) => (
                    <option key={equipe.id} value={equipe.id}>
                      {equipe.nomeEquipe}
                    </option>
                  ))
                )}
              </select>
              {equipes.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Nenhuma equipe encontrada. Por favor, cadastre uma equipe primeiro.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Exame Médico (PDF)</label>
              <input 
                type="file"
                accept=".pdf"
                onChange={(e) => setExameMedico(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Anexe o exame médico em formato PDF
              </p>
            </div>

            <div>
              <label className="block text-[#1B224B] mb-2">Documento de Identificação (PDF)</label>
              <input 
                type="file"
                accept=".pdf"
                onChange={(e) => setDocumentoId(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-lg bg-[#F8F9FE]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Anexe uma cópia do documento de identificação em formato PDF
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#00A3FF] text-white py-2 px-4 rounded-lg hover:bg-blue-600
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Patinador'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 