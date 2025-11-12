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
  ingredientes?: string[];
  pasos?: string[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface RecetaConDetalles extends Receta {
  ingredientes: string[];
  pasos: string[];
}
