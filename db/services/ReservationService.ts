import { Database } from '../database';
import { Reservation, ReservationHistory, CreateReservationDTO, UpdateReservationDTO } from '../models';

export class ReservationService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getUserReservations(userId: number): Promise<ReservationHistory[]> {
    try {
      const query = `
        SELECT 
          r.id,
          p.name as parkingName,
          p.address,
          DATE(r.start_time) as date,
          TIME(r.start_time) as startTime,
          TIME(r.end_time) as endTime,
          r.duration_minutes,
          r.amount,
          r.status
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.start_time DESC
      `;
      
      const results = await this.db.getAll(query, [userId]);
      
      return results.map(row => ({
        id: row.id.toString(),
        parkingName: row.parkingName,
        address: row.address,
        date: new Date(row.date).toISOString().split('T')[0], // YYYY-MM-DD format
        startTime: this.formatTime(row.startTime),
        endTime: this.formatTime(row.endTime),
        duration: this.formatDuration(row.duration_minutes),
        amount: row.amount,
        status: row.status
      }));
    } catch (error) {
      console.error('Error obteniendo reservas del usuario:', error);
      return [];
    }
  }

  async getReservationById(reservationId: number): Promise<Reservation | null> {
    try {
      const query = `
        SELECT 
          r.*,
          p.name as parkingName,
          p.address
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.id = ? LIMIT 1
      `;
      
      const result = await this.db.getFirst(query, [reservationId]);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        user_id: result.user_id,
        parking_id: result.parking_id,
        parkingName: result.parkingName,
        address: result.address,
        startTime: result.start_time,
        endTime: result.end_time,
        durationMinutes: result.duration_minutes,
        duration: this.formatDuration(result.duration_minutes),
        amount: result.amount,
        status: result.status,
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      return null;
    }
  }

  async createReservation(reservationData: CreateReservationDTO): Promise<Reservation | null> {
    try {
      const result = await this.db.executeQuery(
        `INSERT INTO reservations (user_id, parking_id, start_time, duration_minutes, amount) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          reservationData.user_id,
          reservationData.parking_id,
          reservationData.start_time,
          reservationData.estimated_duration_minutes || 60, // Default 1 hour
          0 // Amount will be calculated when reservation ends
        ]
      );

      if (!result.insertId) {
        return null;
      }

      return await this.getReservationById(result.insertId);
    } catch (error) {
      console.error('Error creando reserva:', error);
      return null;
    }
  }

  async updateReservation(reservationId: number, updates: UpdateReservationDTO): Promise<boolean> {
    try {
      const result = await this.db.executeQuery(
        `UPDATE reservations 
         SET end_time = ?, duration_minutes = ?, amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [updates.end_time, updates.duration_minutes, updates.amount, updates.status, reservationId]
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      return false;
    }
  }

  async getUserStats(userId: number): Promise<{
    totalReservations: number;
    totalSpent: number;
    totalHours: number;
  }> {
    try {
      const query = `
        SELECT 
          COUNT(*) as totalReservations,
          COALESCE(SUM(amount), 0) as totalSpent,
          COALESCE(SUM(duration_minutes), 0) as totalMinutes
        FROM reservations 
        WHERE user_id = ? AND status = 'completed'
      `;
      
      const result = await this.db.getFirst(query, [userId]);
      
      return {
        totalReservations: (result as any)?.totalReservations || 0,
        totalSpent: (result as any)?.totalSpent || 0,
        totalHours: Math.round(((result as any)?.totalMinutes || 0) / 60 * 10) / 10
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del usuario:', error);
      return { totalReservations: 0, totalSpent: 0, totalHours: 0 };
    }
  }

  async getActiveReservation(userId: number): Promise<Reservation | null> {
    try {
      const query = `
        SELECT 
          r.*,
          p.name as parkingName,
          p.address
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.user_id = ? AND r.status = 'active'
        ORDER BY r.start_time DESC
        LIMIT 1
      `;
      
      const result = await this.db.getFirst(query, [userId]);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        user_id: result.user_id,
        parking_id: result.parking_id,
        parkingName: result.parkingName,
        address: result.address,
        startTime: result.start_time,
        endTime: result.end_time,
        durationMinutes: result.duration_minutes,
        duration: this.formatDuration(result.duration_minutes),
        amount: result.amount,
        status: result.status,
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    } catch (error) {
      console.error('Error obteniendo reserva activa:', error);
      return null;
    }
  }

  async cancelReservation(reservationId: number): Promise<boolean> {
    try {
      const result = await this.db.executeQuery(
        `UPDATE reservations 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND status = 'active'`,
        [reservationId]
      );

      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      return false;
    }
  }

  async getReservationsByDateRange(
    userId: number, 
    startDate: string, 
    endDate: string
  ): Promise<ReservationHistory[]> {
    try {
      const query = `
        SELECT 
          r.id,
          p.name as parkingName,
          p.address,
          DATE(r.start_time) as date,
          TIME(r.start_time) as startTime,
          TIME(r.end_time) as endTime,
          r.duration_minutes,
          r.amount,
          r.status
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.user_id = ? 
          AND DATE(r.start_time) BETWEEN ? AND ?
        ORDER BY r.start_time DESC
      `;
      
      const results = await this.db.getAll(query, [userId, startDate, endDate]);
      
      return results.map(row => ({
        id: row.id.toString(),
        parkingName: row.parkingName,
        address: row.address,
        date: new Date(row.date).toISOString().split('T')[0],
        startTime: this.formatTime(row.startTime),
        endTime: this.formatTime(row.endTime),
        duration: this.formatDuration(row.duration_minutes),
        amount: row.amount,
        status: row.status
      }));
    } catch (error) {
      console.error('Error obteniendo reservas por rango de fechas:', error);
      return [];
    }
  }

  // Métodos auxiliares para formateo
  private formatTime(time: string): string {
    if (!time) return '';
    // Asumiendo que time viene en formato HH:MM:SS
    return time.substring(0, 5); // Retorna HH:MM
  }

  private formatDuration(minutes: number): string {
    if (!minutes) return '0min';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  }

  async calculateAmount(parkingId: number, durationMinutes: number): Promise<number> {
    try {
      const parking = await this.db.getFirst(
        'SELECT price_per_hour FROM parkings WHERE id = ?',
        [parkingId]
      );
      
      if (!parking) {
        return 0;
      }

      const pricePerHour = (parking as any).price_per_hour;
      const hours = durationMinutes / 60;
      
      return Math.ceil(hours * pricePerHour);
    } catch (error) {
      console.error('Error calculando monto:', error);
      return 0;
    }
  }
}
