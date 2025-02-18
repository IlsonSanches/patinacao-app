export const categoriaIdades = {
  'INCENTIVO': ['4-5 anos', '6-7 anos', '8-9 anos'],
  'INICIANTE': ['6-7 anos', '8-9 anos', '10-11 anos'],
  'INTERMEDIÁRIO': ['8-9 anos', '10-11 anos', '12-13 anos'],
  'AVANÇADO': ['10-11 anos', '12-13 anos', '14-15 anos', '16+ anos']
};

export type CategoriaType = keyof typeof categoriaIdades; 