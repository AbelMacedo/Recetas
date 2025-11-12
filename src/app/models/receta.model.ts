export interface Receta {
  id?: number;
  nombre: string;
  descripcion?: string;
  region: Region;
  categoria: Categoria;
  tiempoPreparacion?: number;
  porciones?: number;
  esFavorita?: boolean;
  esTradicional?: boolean;
  notasPersonales?: string;
  fotoUrl?: string;
  ingredientes: string[];
  pasos: string[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export enum Region {
  NORTE = 'NORTE',
  CENTRO = 'CENTRO',
  SUR = 'SUR',
  GOLFO = 'GOLFO',
  PENINSULA_YUCATAN = 'PENINSULA_YUCATAN'
}

export enum Categoria {
  POSTRES = 'POSTRES',
  SOPAS = 'SOPAS',
  GUISOS = 'GUISOS',
  BEBIDAS = 'BEBIDAS',
  ENTRADAS = 'ENTRADAS',
  PLATOS_FUERTES = 'PLATOS_FUERTES',
  DESAYUNOS = 'DESAYUNOS',
  ANTOJITOS = 'ANTOJITOS'
}

// Etiquetas legibles para mostrar en la UI
export const RegionLabels: Record<Region, string> = {
  [Region.NORTE]: 'Norte',
  [Region.CENTRO]: 'Centro',
  [Region.SUR]: 'Sur',
  [Region.GOLFO]: 'Golfo',
  [Region.PENINSULA_YUCATAN]: 'Península de Yucatán'
};

export const CategoriaLabels: Record<Categoria, string> = {
  [Categoria.POSTRES]: 'Postres',
  [Categoria.SOPAS]: 'Sopas',
  [Categoria.GUISOS]: 'Guisos',
  [Categoria.BEBIDAS]: 'Bebidas',
  [Categoria.ENTRADAS]: 'Entradas',
  [Categoria.PLATOS_FUERTES]: 'Platos Fuertes',
  [Categoria.DESAYUNOS]: 'Desayunos',
  [Categoria.ANTOJITOS]: 'Antojitos'
};
