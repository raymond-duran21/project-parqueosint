import { Database } from '../database';
import { Parking, CreateParkingDTO, UpdateParkingDTO } from '../models';

export class ParkingService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getAllParkings(): Promise<Parking[]> {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          latitude,
          longitude,
          price_per_hour as pricePerHour,
          total_spots as totalSpots,
          available_spots as availableSpots,
          features,
          status,
          description,
          operating_hours as operatingHours,
          security,
          payment_methods as paymentMethods,
          contact_phone as contactPhone,
          created_at,
          updated_at
        FROM parkings 
        ORDER BY available_spots DESC, name ASC
      `;
      
      const results = await this.db.getAll(query);
      
      return results.map(row => ({
        ...row,
        features: JSON.parse(row.features || '[]'),
        paymentMethods: JSON.parse(row.paymentMethods || '[]'),
        distance: this.calculateDistance(row.latitude, row.longitude) // Simulado por ahora
      }));
    } catch (error) {
      console.error('Error obteniendo parqueos:', error);
      return [];
    }
  }

  async getParkingById(parkingId: number): Promise<Parking | null> {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          latitude,
          longitude,
          price_per_hour as pricePerHour,
          total_spots as totalSpots,
          available_spots as availableSpots,
          features,
          status,
          description,
          operating_hours as operatingHours,
          security,
          payment_methods as paymentMethods,
          contact_phone as contactPhone,
          created_at,
          updated_at
        FROM parkings 
        WHERE id = ? LIMIT 1
      `;
      
      const result = await this.db.getFirst(query, [parkingId]);
      
      if (!result) {
        return null;
      }

      return {
        ...result,
        features: JSON.parse(result.features || '[]'),
        paymentMethods: JSON.parse(result.paymentMethods || '[]'),
        distance: this.calculateDistance(result.latitude, result.longitude)
      } as Parking;
    } catch (error) {
      console.error('Error obteniendo parqueo:', error);
      return null;
    }
  }

  async searchParkings(searchTerm: string): Promise<Parking[]> {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          latitude,
          longitude,
          price_per_hour as pricePerHour,
          total_spots as totalSpots,
          available_spots as availableSpots,
          features,
          status,
          created_at,
          updated_at
        FROM parkings 
        WHERE name LIKE ? OR address LIKE ?
        ORDER BY available_spots DESC, name ASC
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const results = await this.db.getAll(query, [searchPattern, searchPattern]);
      
      return results.map(row => ({
        ...row,
        features: JSON.parse(row.features || '[]'),
        distance: this.calculateDistance(row.latitude, row.longitude)
      }));
    } catch (error) {
      console.error('Error buscando parqueos:', error);
      return [];
    }
  }

  async getParkingsByStatus(status: 'available' | 'limited' | 'full'): Promise<Parking[]> {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          latitude,
          longitude,
          price_per_hour as pricePerHour,
          total_spots as totalSpots,
          available_spots as availableSpots,
          features,
          status,
          created_at,
          updated_at
        FROM parkings 
        WHERE status = ?
        ORDER BY available_spots DESC, name ASC
      `;
      
      const results = await this.db.getAll(query, [status]);
      
      return results.map(row => ({
        ...row,
        features: JSON.parse(row.features || '[]'),
        distance: this.calculateDistance(row.latitude, row.longitude)
      }));
    } catch (error) {
      console.error('Error obteniendo parqueos por estatus:', error);
      return [];
    }
  }

  async updateParkingAvailability(parkingId: number, updates: UpdateParkingDTO): Promise<boolean> {
    try {
      const fields = [];
      const values = [];

      if (typeof updates.available_spots === 'number') {
        fields.push('available_spots = ?');
        values.push(updates.available_spots);
        
        // Actualizar status automáticamente basado en disponibilidad
        if (updates.available_spots === 0) {
          fields.push('status = ?');
          values.push('full');
        } else if (updates.available_spots <= 5) {
          fields.push('status = ?');
          values.push('limited');
        } else {
          fields.push('status = ?');
          values.push('available');
        }
      }

      if (updates.status) {
        fields.push('status = ?');
        values.push(updates.status);
      }

      if (fields.length === 0) {
        return true;
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(parkingId);

      const query = `
        UPDATE parkings 
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      const result = await this.db.executeQuery(query, values);
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error actualizando parqueo:', error);
      return false;
    }
  }

  async createParking(parkingData: CreateParkingDTO): Promise<Parking | null> {
    try {
      const featuresJson = JSON.stringify(parkingData.features);
      
      const result = await this.db.executeQuery(
        `INSERT INTO parkings 
         (name, address, latitude, longitude, price_per_hour, total_spots, available_spots, features) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parkingData.name,
          parkingData.address,
          parkingData.latitude,
          parkingData.longitude,
          parkingData.price_per_hour,
          parkingData.total_spots,
          parkingData.available_spots,
          featuresJson
        ]
      );

      if (!result.insertId) {
        return null;
      }

      return await this.getParkingById(result.insertId);
    } catch (error) {
      console.error('Error creando parqueo:', error);
      return null;
    }
  }

  async getParkingStats(): Promise<{ 
    totalParkings: number; 
    availableSpots: number; 
    totalSpots: number 
  }> {
    try {
      const query = `
        SELECT 
          COUNT(*) as totalParkings,
          SUM(available_spots) as availableSpots,
          SUM(total_spots) as totalSpots
        FROM parkings
      `;
      
      const result = await this.db.getFirst(query);
      
      return {
        totalParkings: (result as any)?.totalParkings || 0,
        availableSpots: (result as any)?.availableSpots || 0,
        totalSpots: (result as any)?.totalSpots || 0
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { totalParkings: 0, availableSpots: 0, totalSpots: 0 };
    }
  }

  // Método auxiliar para calcular distancia (simulado por ahora)
  private calculateDistance(lat?: number, lng?: number): string {
    // En una implementación real, usarías la ubicación del usuario
    // Para efectos de demo, devolvemos distancias aleatorias pero consistentes
    const distances = ['0.2 km', '0.5 km', '0.8 km', '1.2 km', '1.5 km', '2.1 km'];
    const hash = (lat || 0) + (lng || 0);
    const index = Math.abs(Math.floor(hash)) % distances.length;
    return distances[index];
  }

  async getAvailableParkingsCount(): Promise<number> {
    try {
      const result = await this.db.getFirst(
        'SELECT COUNT(*) as count FROM parkings WHERE available_spots > 0'
      );
      return (result as any)?.count || 0;
    } catch (error) {
      console.error('Error obteniendo conteo de parqueos:', error);
      return 0;
    }
  }

  async getTotalAvailableSpots(): Promise<number> {
    try {
      const result = await this.db.getFirst(
        'SELECT SUM(available_spots) as total FROM parkings'
      );
      return (result as any)?.total || 0;
    } catch (error) {
      console.error('Error obteniendo total de espacios:', error);
      return 0;
    }
  }

  // Método simplificado para decrementar espacios disponibles
  async decrementAvailableSpots(parkingId: number): Promise<boolean> {
    try {
      console.log(`Decrementando espacios disponibles para parqueo ${parkingId}`);
      
      // Primero obtener los espacios actuales
      const currentParking = await this.getParkingById(parkingId);
      if (!currentParking || currentParking.availableSpots <= 0) {
        console.error('No hay espacios disponibles para decrementar');
        return false;
      }
      
      const newAvailableSpots = currentParking.availableSpots - 1;
      console.log(`Espacios antes: ${currentParking.availableSpots}, después: ${newAvailableSpots}`);
      
      // Determinar nuevo status
      let newStatus: 'available' | 'limited' | 'full';
      if (newAvailableSpots === 0) {
        newStatus = 'full';
      } else if (newAvailableSpots <= 5) {
        newStatus = 'limited';
      } else {
        newStatus = 'available';
      }
      
      const result = await this.db.executeQuery(
        'UPDATE parkings SET available_spots = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newAvailableSpots, newStatus, parkingId]
      );
      
      console.log(`Resultado de actualización:`, result);
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error decrementando espacios disponibles:', error);
      return false;
    }
  }
}
