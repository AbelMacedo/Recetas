import { Request, Response } from 'express';
import pool from '../config/database';
import { Receta, RecetaConDetalles, Region, Categoria } from '../models/receta.model';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class RecetaController {

  // Crear nueva receta
  async crearReceta(req: Request, res: Response): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const receta: Receta = req.body;

      // Insertar receta
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO recetas (nombre, descripcion, region, categoria, tiempo_preparacion,
         porciones, es_favorita, es_tradicional, notas_personales, foto_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          receta.nombre,
          receta.descripcion || null,
          receta.region,
          receta.categoria,
          receta.tiempoPreparacion || null,
          receta.porciones || null,
          receta.esFavorita || false,
          receta.esTradicional || false,
          receta.notasPersonales || null,
          receta.fotoUrl || null
        ]
      );

      const recetaId = result.insertId;

      // Insertar ingredientes
      if (receta.ingredientes && receta.ingredientes.length > 0) {
        const ingredientesValues = receta.ingredientes.map((ing, index) =>
          [recetaId, ing, index]
        );
        await connection.query(
          'INSERT INTO ingredientes (receta_id, ingrediente, orden) VALUES ?',
          [ingredientesValues]
        );
      }

      // Insertar pasos
      if (receta.pasos && receta.pasos.length > 0) {
        const pasosValues = receta.pasos.map((paso, index) =>
          [recetaId, paso, index]
        );
        await connection.query(
          'INSERT INTO pasos (receta_id, paso, orden) VALUES ?',
          [pasosValues]
        );
      }

      await connection.commit();

      // Obtener la receta completa
      const recetaCompleta = await this.obtenerRecetaCompletaPorId(recetaId);

      res.status(201).json({
        success: true,
        message: 'Receta creada exitosamente',
        data: recetaCompleta
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al crear receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear receta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      connection.release();
    }
  }

  // Obtener todas las recetas
  async obtenerTodasRecetas(req: Request, res: Response): Promise<void> {
    try {
      const [recetas] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM recetas ORDER BY fecha_creacion DESC'
      );

      // Obtener ingredientes y pasos para cada receta
      const recetasCompletas = await Promise.all(
        recetas.map(async (receta) => {
          const [ingredientes] = await pool.query<RowDataPacket[]>(
            'SELECT ingrediente FROM ingredientes WHERE receta_id = ? ORDER BY orden',
            [receta.id]
          );

          const [pasos] = await pool.query<RowDataPacket[]>(
            'SELECT paso FROM pasos WHERE receta_id = ? ORDER BY orden',
            [receta.id]
          );

          return {
            ...this.mapearReceta(receta),
            ingredientes: ingredientes.map(i => i.ingrediente),
            pasos: pasos.map(p => p.paso)
          };
        })
      );

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al obtener recetas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener receta por ID
  async obtenerRecetaPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const receta = await this.obtenerRecetaCompletaPorId(Number(id));

      if (!receta) {
        res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: receta
      });

    } catch (error) {
      console.error('Error al obtener receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener receta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Actualizar receta
  async actualizarReceta(req: Request, res: Response): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const receta: Receta = req.body;

      // Actualizar receta principal
      await connection.query(
        `UPDATE recetas SET
         nombre = ?, descripcion = ?, region = ?, categoria = ?,
         tiempo_preparacion = ?, porciones = ?, es_favorita = ?,
         es_tradicional = ?, notas_personales = ?, foto_url = ?
         WHERE id = ?`,
        [
          receta.nombre,
          receta.descripcion || null,
          receta.region,
          receta.categoria,
          receta.tiempoPreparacion || null,
          receta.porciones || null,
          receta.esFavorita || false,
          receta.esTradicional || false,
          receta.notasPersonales || null,
          receta.fotoUrl || null,
          id
        ]
      );

      // Eliminar y reinsertar ingredientes
      await connection.query('DELETE FROM ingredientes WHERE receta_id = ?', [id]);
      if (receta.ingredientes && receta.ingredientes.length > 0) {
        const ingredientesValues = receta.ingredientes.map((ing, index) =>
          [id, ing, index]
        );
        await connection.query(
          'INSERT INTO ingredientes (receta_id, ingrediente, orden) VALUES ?',
          [ingredientesValues]
        );
      }

      // Eliminar y reinsertar pasos
      await connection.query('DELETE FROM pasos WHERE receta_id = ?', [id]);
      if (receta.pasos && receta.pasos.length > 0) {
        const pasosValues = receta.pasos.map((paso, index) =>
          [id, paso, index]
        );
        await connection.query(
          'INSERT INTO pasos (receta_id, paso, orden) VALUES ?',
          [pasosValues]
        );
      }

      await connection.commit();

      const recetaActualizada = await this.obtenerRecetaCompletaPorId(Number(id));

      res.json({
        success: true,
        message: 'Receta actualizada exitosamente',
        data: recetaActualizada
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al actualizar receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar receta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      connection.release();
    }
  }

  // Eliminar receta
  async eliminarReceta(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await pool.query('DELETE FROM recetas WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Receta eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar receta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener recetas por región
  async obtenerPorRegion(req: Request, res: Response): Promise<void> {
    try {
      const { region } = req.params;

      const [recetas] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM recetas WHERE region = ? ORDER BY fecha_creacion DESC',
        [region]
      );

      const recetasCompletas = await this.obtenerRecetasConDetalles(recetas);

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al obtener recetas por región:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener recetas por categoría
  async obtenerPorCategoria(req: Request, res: Response): Promise<void> {
    try {
      const { categoria } = req.params;

      const [recetas] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM recetas WHERE categoria = ? ORDER BY fecha_creacion DESC',
        [categoria]
      );

      const recetasCompletas = await this.obtenerRecetasConDetalles(recetas);

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al obtener recetas por categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener recetas favoritas
  async obtenerFavoritas(req: Request, res: Response): Promise<void> {
    try {
      const [recetas] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM recetas WHERE es_favorita = TRUE ORDER BY fecha_creacion DESC'
      );

      const recetasCompletas = await this.obtenerRecetasConDetalles(recetas);

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al obtener recetas favoritas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas favoritas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener recetas tradicionales
  async obtenerTradicionales(req: Request, res: Response): Promise<void> {
    try {
      const [recetas] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM recetas WHERE es_tradicional = TRUE ORDER BY region, fecha_creacion DESC'
      );

      const recetasCompletas = await this.obtenerRecetasConDetalles(recetas);

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al obtener recetas tradicionales:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener recetas tradicionales',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Buscar recetas (por nombre o ingrediente)
  async buscarRecetas(req: Request, res: Response): Promise<void> {
    try {
      const { termino } = req.query;

      if (!termino) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar un término de búsqueda'
        });
        return;
      }

      const terminoBusqueda = `%${termino}%`;

      const [recetas] = await pool.query<RowDataPacket[]>(
        `SELECT DISTINCT r.* FROM recetas r
         LEFT JOIN ingredientes i ON r.id = i.receta_id
         WHERE r.nombre LIKE ? OR i.ingrediente LIKE ?
         ORDER BY r.fecha_creacion DESC`,
        [terminoBusqueda, terminoBusqueda]
      );

      const recetasCompletas = await this.obtenerRecetasConDetalles(recetas);

      res.json({
        success: true,
        data: recetasCompletas
      });

    } catch (error) {
      console.error('Error al buscar recetas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar recetas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Marcar/desmarcar como favorita
  async toggleFavorita(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { esFavorita } = req.body;

      await pool.query(
        'UPDATE recetas SET es_favorita = ? WHERE id = ?',
        [esFavorita, id]
      );

      const receta = await this.obtenerRecetaCompletaPorId(Number(id));

      res.json({
        success: true,
        message: `Receta ${esFavorita ? 'marcada' : 'desmarcada'} como favorita`,
        data: receta
      });

    } catch (error) {
      console.error('Error al actualizar favorita:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar receta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Métodos auxiliares privados
  private async obtenerRecetaCompletaPorId(id: number): Promise<RecetaConDetalles | null> {
    const [recetas] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM recetas WHERE id = ?',
      [id]
    );

    if (recetas.length === 0) return null;

    const receta = recetas[0];

    const [ingredientes] = await pool.query<RowDataPacket[]>(
      'SELECT ingrediente FROM ingredientes WHERE receta_id = ? ORDER BY orden',
      [id]
    );

    const [pasos] = await pool.query<RowDataPacket[]>(
      'SELECT paso FROM pasos WHERE receta_id = ? ORDER BY orden',
      [id]
    );

    return {
      ...this.mapearReceta(receta),
      ingredientes: ingredientes.map(i => i.ingrediente),
      pasos: pasos.map(p => p.paso)
    };
  }

  private async obtenerRecetasConDetalles(recetas: RowDataPacket[]): Promise<RecetaConDetalles[]> {
    return Promise.all(
      recetas.map(async (receta) => {
        const [ingredientes] = await pool.query<RowDataPacket[]>(
          'SELECT ingrediente FROM ingredientes WHERE receta_id = ? ORDER BY orden',
          [receta.id]
        );

        const [pasos] = await pool.query<RowDataPacket[]>(
          'SELECT paso FROM pasos WHERE receta_id = ? ORDER BY orden',
          [receta.id]
        );

        return {
          ...this.mapearReceta(receta),
          ingredientes: ingredientes.map(i => i.ingrediente),
          pasos: pasos.map(p => p.paso)
        };
      })
    );
  }

  private mapearReceta(row: any): Receta {
    return {
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      region: row.region as Region,
      categoria: row.categoria as Categoria,
      tiempoPreparacion: row.tiempo_preparacion,
      porciones: row.porciones,
      esFavorita: Boolean(row.es_favorita),
      esTradicional: Boolean(row.es_tradicional),
      notasPersonales: row.notas_personales,
      fotoUrl: row.foto_url,
      fechaCreacion: row.fecha_creacion,
      fechaActualizacion: row.fecha_actualizacion
    };
  }
}
