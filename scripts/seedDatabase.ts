import { modalidadeService, categoriaService } from '@/services/modalidadeService';
import { Modalidade, Categoria } from '@/types/database';

// Dados iniciais baseados na tabela fornecida
const categoriasIniciais: Omit<Categoria, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    nome: 'Iniciante',
    codigo: 'IN',
    descricao: 'Categoria para patinadores iniciantes',
    ordem: 1,
    ativo: true
  },
  {
    nome: 'Estreante',
    codigo: 'ES',
    descricao: 'Categoria para patinadores estreantes',
    ordem: 2,
    ativo: true
  },
  {
    nome: 'Novatos',
    codigo: 'NO',
    descricao: 'Categoria para patinadores novatos',
    ordem: 3,
    ativo: true
  },
  {
    nome: 'Dente de Leite',
    codigo: 'DL',
    descricao: 'Categoria para patinadores dente de leite',
    ordem: 4,
    ativo: true
  }
];

const modalidadesIniciais: Omit<Modalidade, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Categoria Iniciante
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN1', idadeMin: 5, idadeMax: 6, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN2', idadeMin: 7, idadeMax: 8, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN3', idadeMin: 9, idadeMax: 10, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN4', idadeMin: 11, idadeMax: 12, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN5', idadeMin: 13, idadeMax: 14, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN6', idadeMin: 15, idadeMax: 16, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN7', idadeMin: 17, idadeMax: 18, tempoMin: '01:45', tempoMax: '01:45', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Iniciante', subStyle: 'IN', codigo: 'IN8', idadeMin: 19, idadeMax: 99, tempoMin: '01:45', tempoMax: '01:45', ativo: true },

  // Categoria Estreante
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES1', idadeMin: 5, idadeMax: 6, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES2', idadeMin: 7, idadeMax: 8, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES3', idadeMin: 9, idadeMax: 10, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES4', idadeMin: 11, idadeMax: 12, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES5', idadeMin: 13, idadeMax: 14, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES6', idadeMin: 15, idadeMax: 16, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES7', idadeMin: 17, idadeMax: 18, tempoMin: '02:00', tempoMax: '02:00', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Estreante', subStyle: 'ES', codigo: 'ES8', idadeMin: 19, idadeMax: 99, tempoMin: '02:00', tempoMax: '02:00', ativo: true },

  // Categoria Novatos
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO1', idadeMin: 5, idadeMax: 6, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO2', idadeMin: 7, idadeMax: 8, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO3', idadeMin: 9, idadeMax: 10, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO4', idadeMin: 11, idadeMax: 12, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO5', idadeMin: 13, idadeMax: 14, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO6', idadeMin: 15, idadeMax: 16, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO7', idadeMin: 17, idadeMax: 18, tempoMin: '02:15', tempoMax: '02:15', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Novatos', subStyle: 'NO', codigo: 'NO8', idadeMin: 19, idadeMax: 99, tempoMin: '02:15', tempoMax: '02:15', ativo: true },

  // Categoria Dente de Leite
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL1', idadeMin: 5, idadeMax: 6, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL2', idadeMin: 7, idadeMax: 8, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL3', idadeMin: 9, idadeMax: 10, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL4', idadeMin: 11, idadeMax: 12, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL5', idadeMin: 13, idadeMax: 14, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL6', idadeMin: 15, idadeMax: 16, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL7', idadeMin: 17, idadeMax: 18, tempoMin: '02:30', tempoMax: '02:30', ativo: true },
  { nome: 'Circular', style: 'CIR', categoria: 'Dente de Leite', subStyle: 'DL', codigo: 'DL8', idadeMin: 19, idadeMax: 99, tempoMin: '02:30', tempoMax: '02:30', ativo: true }
];

export async function popularBancoDados() {
  try {
    console.log('Iniciando população do banco de dados...');

    // Primeiro, criar as categorias
    console.log('Criando categorias...');
    for (const categoria of categoriasIniciais) {
      await categoriaService.criar(categoria);
      console.log(`Categoria ${categoria.nome} criada com sucesso`);
    }

    // Depois, criar as modalidades
    console.log('Criando modalidades...');
    for (const modalidade of modalidadesIniciais) {
      await modalidadeService.criar(modalidade);
      console.log(`Modalidade ${modalidade.codigo} criada com sucesso`);
    }

    console.log('Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    throw error;
  }
} 