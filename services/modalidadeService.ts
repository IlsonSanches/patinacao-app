import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Modalidade, Categoria, FaixaEtaria, TempoProva } from '@/types/database';

// Serviços para Modalidades
export const modalidadeService = {
  // Criar nova modalidade
  async criar(modalidade: Omit<Modalidade, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'modalidades'), {
        ...modalidade,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar modalidade:', error);
      throw error;
    }
  },

  // Listar todas as modalidades
  async listar(): Promise<Modalidade[]> {
    try {
      const q = query(collection(db, 'modalidades'), orderBy('categoria'), orderBy('codigo'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Modalidade));
    } catch (error) {
      console.error('Erro ao listar modalidades:', error);
      throw error;
    }
  },

  // Listar modalidades por categoria
  async listarPorCategoria(categoria: string): Promise<Modalidade[]> {
    try {
      const q = query(
        collection(db, 'modalidades'), 
        where('categoria', '==', categoria),
        where('ativo', '==', true),
        orderBy('codigo')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Modalidade));
    } catch (error) {
      console.error('Erro ao listar modalidades por categoria:', error);
      throw error;
    }
  },

  // Atualizar modalidade
  async atualizar(id: string, dados: Partial<Modalidade>): Promise<void> {
    try {
      const docRef = doc(db, 'modalidades', id);
      await updateDoc(docRef, {
        ...dados,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar modalidade:', error);
      throw error;
    }
  },

  // Deletar modalidade (soft delete)
  async deletar(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'modalidades', id);
      await updateDoc(docRef, {
        ativo: false,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao deletar modalidade:', error);
      throw error;
    }
  }
};

// Serviços para Categorias
export const categoriaService = {
  async criar(categoria: Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'categorias'), {
        ...categoria,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  async listar(): Promise<Categoria[]> {
    try {
      const q = query(collection(db, 'categorias'), orderBy('ordem'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Categoria));
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Categoria>): Promise<void> {
    try {
      const docRef = doc(db, 'categorias', id);
      await updateDoc(docRef, {
        ...dados,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }
}; 