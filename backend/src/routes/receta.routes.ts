import { Router } from 'express';
import { RecetaController } from '../controllers/receta.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const recetaController = new RecetaController();

// CRUD básico
router.post('/', recetaController.crearReceta.bind(recetaController));
router.get('/', recetaController.obtenerTodasRecetas.bind(recetaController));
router.get('/:id', recetaController.obtenerRecetaPorId.bind(recetaController));
router.put('/:id', recetaController.actualizarReceta.bind(recetaController));
router.delete('/:id', recetaController.eliminarReceta.bind(recetaController));

// Filtros
router.get('/region/:region', recetaController.obtenerPorRegion.bind(recetaController));
router.get('/categoria/:categoria', recetaController.obtenerPorCategoria.bind(recetaController));
router.get('/filtro/favoritas', recetaController.obtenerFavoritas.bind(recetaController));
router.get('/filtro/tradicionales', recetaController.obtenerTradicionales.bind(recetaController));

// Búsqueda
router.get('/buscar/general', recetaController.buscarRecetas.bind(recetaController));

// Favoritos
router.patch('/:id/favorita', recetaController.toggleFavorita.bind(recetaController));

// Subir foto
router.post('/upload/foto', upload.single('foto'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No se recibió ninguna imagen'
      });
      return;
    }

    const fotoUrl = `/uploads/fotos/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Foto subida exitosamente',
      data: {
        fotoUrl: fotoUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir foto',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
