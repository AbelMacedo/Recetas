import pool from '../config/database';
import { Region, Categoria } from '../models/receta.model';

interface RecetaSeed {
  nombre: string;
  descripcion: string;
  region: Region;
  categoria: Categoria;
  tiempoPreparacion: number;
  porciones: number;
  esTradicional: boolean;
  ingredientes: string[];
  pasos: string[];
}

const recetasTradicionales: RecetaSeed[] = [
  // NORTE
  {
    nombre: 'Carne Asada Norteña',
    descripcion: 'Tradicional carne asada del norte de México, marinada y cocida a las brasas',
    region: Region.NORTE,
    categoria: Categoria.PLATOS_FUERTES,
    tiempoPreparacion: 45,
    porciones: 6,
    esTradicional: true,
    ingredientes: [
      '1 kg de carne de res (agujas o arrachera)',
      '4 limones',
      '1 cerveza',
      'Sal y pimienta al gusto',
      '2 dientes de ajo',
      'Orégano'
    ],
    pasos: [
      'Marinar la carne con limón, cerveza, ajo, sal, pimienta y orégano',
      'Dejar reposar en el refrigerador por al menos 2 horas',
      'Calentar la parrilla o asador',
      'Asar la carne de 7-10 minutos por lado',
      'Dejar reposar 5 minutos antes de cortar',
      'Servir con tortillas, guacamole y pico de gallo'
    ]
  },
  {
    nombre: 'Machaca con Huevo',
    descripcion: 'Desayuno típico del norte con carne seca deshebrada y huevo',
    region: Region.NORTE,
    categoria: Categoria.DESAYUNOS,
    tiempoPreparacion: 20,
    porciones: 4,
    esTradicional: true,
    ingredientes: [
      '200g de machaca (carne seca)',
      '6 huevos',
      '2 tomates',
      '1 cebolla',
      '2 chiles serranos',
      'Aceite y sal'
    ],
    pasos: [
      'Remojar la machaca en agua tibia 10 minutos',
      'Picar tomate, cebolla y chile',
      'Freír la cebolla hasta que esté transparente',
      'Agregar la machaca deshebrada y el tomate',
      'Incorporar los huevos batidos',
      'Revolver hasta que el huevo esté cocido'
    ]
  },

  // CENTRO
  {
    nombre: 'Chiles en Nogada',
    descripcion: 'Emblemático platillo poblano con los colores de la bandera mexicana',
    region: Region.CENTRO,
    categoria: Categoria.PLATOS_FUERTES,
    tiempoPreparacion: 120,
    porciones: 6,
    esTradicional: true,
    ingredientes: [
      '6 chiles poblanos',
      '500g de carne molida de res',
      '200g de nueces de castilla',
      '200ml de crema',
      '1 granada',
      'Perejil',
      'Frutas cristalizadas',
      'Especias variadas'
    ],
    pasos: [
      'Asar y pelar los chiles poblanos',
      'Preparar el picadillo con carne, frutas y especias',
      'Rellenar los chiles con el picadillo',
      'Licuar las nueces con crema para hacer la nogada',
      'Bañar los chiles con la nogada',
      'Decorar con granada y perejil'
    ]
  },
  {
    nombre: 'Pozole Rojo',
    descripcion: 'Sopa tradicional mexicana con maíz cacahuazintle',
    region: Region.CENTRO,
    categoria: Categoria.SOPAS,
    tiempoPreparacion: 180,
    porciones: 8,
    esTradicional: true,
    ingredientes: [
      '1kg de maíz cacahuazintle',
      '1kg de carne de puerco',
      '500g de cabeza de puerco',
      '10 chiles guajillo',
      'Lechuga, rábanos, orégano',
      'Tostadas y limones'
    ],
    pasos: [
      'Cocer el maíz hasta que reviente',
      'Cocer las carnes por separado',
      'Preparar el chile guajillo',
      'Mezclar todo en una olla grande',
      'Dejar hervir por 30 minutos',
      'Servir con guarniciones'
    ]
  },

  // SUR
  {
    nombre: 'Mole Negro Oaxaqueño',
    descripcion: 'El más complejo de los moles oaxaqueños, de color oscuro intenso',
    region: Region.SUR,
    categoria: Categoria.GUISOS,
    tiempoPreparacion: 240,
    porciones: 10,
    esTradicional: true,
    ingredientes: [
      '6 chiles chilhuacles negros',
      '4 chiles mulatos',
      '200g de chocolate oaxaqueño',
      'Especias variadas (canela, clavo, pimienta)',
      'Tortillas quemadas',
      'Plátano macho',
      'Pollo o guajolote'
    ],
    pasos: [
      'Tostar y desvenar los chiles',
      'Quemar las tortillas hasta carbonizarlas',
      'Freír todos los ingredientes por separado',
      'Moler todo en metate o licuadora',
      'Freír la pasta en manteca',
      'Agregar el caldo y cocinar por 2 horas',
      'Servir con el pollo cocido'
    ]
  },
  {
    nombre: 'Tlayudas Oaxaqueñas',
    descripcion: 'Tortilla grande crujiente con frijoles, quesillo y tasajo',
    region: Region.SUR,
    categoria: Categoria.ANTOJITOS,
    tiempoPreparacion: 30,
    porciones: 4,
    esTradicional: true,
    ingredientes: [
      '4 tlayudas (tortillas grandes)',
      'Frijoles refritos',
      '400g de quesillo oaxaqueño',
      '300g de tasajo',
      'Lechuga, tomate, aguacate',
      'Salsa'
    ],
    pasos: [
      'Calentar la tlayuda en comal',
      'Untar los frijoles',
      'Agregar el quesillo deshebrado',
      'Colocar el tasajo asado',
      'Poner las verduras',
      'Servir con salsa al gusto'
    ]
  },

  // GOLFO
  {
    nombre: 'Huachinango a la Veracruzana',
    descripcion: 'Pescado fresco en salsa de tomate con aceitunas y alcaparras',
    region: Region.GOLFO,
    categoria: Categoria.PLATOS_FUERTES,
    tiempoPreparacion: 60,
    porciones: 4,
    esTradicional: true,
    ingredientes: [
      '1 huachinango entero (1.5kg)',
      '1kg de tomates',
      '100g de aceitunas',
      '50g de alcaparras',
      '3 chiles güeros',
      'Cebolla, ajo, laurel',
      'Aceite de oliva'
    ],
    pasos: [
      'Limpiar y sazonar el pescado',
      'Preparar la salsa con tomate, cebolla y ajo',
      'Agregar aceitunas, alcaparras y chiles',
      'Colocar el pescado en un refractario',
      'Bañar con la salsa',
      'Hornear a 180°C por 30-40 minutos'
    ]
  },
  {
    nombre: 'Arroz a la Tumbada',
    descripcion: 'Arroz caldoso con mariscos típico de Veracruz',
    region: Region.GOLFO,
    categoria: Categoria.PLATOS_FUERTES,
    tiempoPreparacion: 45,
    porciones: 6,
    esTradicional: true,
    ingredientes: [
      '2 tazas de arroz',
      '500g de camarones',
      '300g de pulpo',
      '200g de jaiba',
      'Caldo de pescado',
      'Jitomate, cebolla, ajo',
      'Chiles jalapeños'
    ],
    pasos: [
      'Sofreír el arroz con ajo y cebolla',
      'Agregar el jitomate licuado',
      'Añadir el caldo caliente',
      'Incorporar los mariscos',
      'Cocinar hasta que el arroz esté suave',
      'Servir caldoso con limón'
    ]
  },

  // PENÍNSULA DE YUCATÁN
  {
    nombre: 'Cochinita Pibil',
    descripcion: 'Cerdo marinado en achiote y cocido en horno de tierra',
    region: Region.PENINSULA_YUCATAN,
    categoria: Categoria.PLATOS_FUERTES,
    tiempoPreparacion: 240,
    porciones: 8,
    esTradicional: true,
    ingredientes: [
      '2kg de lomo de cerdo',
      '200g de pasta de achiote',
      'Jugo de naranja agria',
      'Hojas de plátano',
      'Cebolla morada',
      'Chile habanero'
    ],
    pasos: [
      'Marinar la carne con achiote y naranja agria',
      'Dejar reposar toda la noche',
      'Envolver en hojas de plátano',
      'Cocinar en horno a 150°C por 3-4 horas',
      'Deshebrar la carne',
      'Servir con cebolla morada encurtida'
    ]
  },
  {
    nombre: 'Sopa de Lima',
    descripcion: 'Sopa yucateca con pollo y lima de la región',
    region: Region.PENINSULA_YUCATAN,
    categoria: Categoria.SOPAS,
    tiempoPreparacion: 45,
    porciones: 6,
    esTradicional: true,
    ingredientes: [
      '4 pechugas de pollo',
      '6 limas de la región',
      'Jitomate y cebolla',
      'Tortillas fritas',
      'Cilantro',
      'Especias yucatecas'
    ],
    pasos: [
      'Cocer el pollo y deshebrar',
      'Preparar el caldo con las verduras',
      'Exprimir las limas',
      'Agregar el jugo de lima al caldo',
      'Freír las tortillas en tiras',
      'Servir caliente con tortilla frita'
    ]
  }
];

export async function seedRecetas() {
  const connection = await pool.getConnection();

  try {
    console.log('🌱 Iniciando seed de recetas tradicionales...');

    for (const receta of recetasTradicionales) {
      // Insertar receta
      const [result] = await connection.query(
        `INSERT INTO recetas (nombre, descripcion, region, categoria, tiempo_preparacion,
         porciones, es_tradicional, es_favorita)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          receta.nombre,
          receta.descripcion,
          receta.region,
          receta.categoria,
          receta.tiempoPreparacion,
          receta.porciones,
          receta.esTradicional,
          false
        ]
      );

      const recetaId = (result as any).insertId;

      // Insertar ingredientes
      if (receta.ingredientes.length > 0) {
        const ingredientesValues = receta.ingredientes.map((ing, index) =>
          [recetaId, ing, index]
        );
        await connection.query(
          'INSERT INTO ingredientes (receta_id, ingrediente, orden) VALUES ?',
          [ingredientesValues]
        );
      }

      // Insertar pasos
      if (receta.pasos.length > 0) {
        const pasosValues = receta.pasos.map((paso, index) =>
          [recetaId, paso, index]
        );
        await connection.query(
          'INSERT INTO pasos (receta_id, paso, orden) VALUES ?',
          [pasosValues]
        );
      }

      console.log(`✅ Receta "${receta.nombre}" creada`);
    }

    console.log('🎉 Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error al ejecutar seed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seedRecetas()
    .then(() => {
      console.log('Seed finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en seed:', error);
      process.exit(1);
    });
}
