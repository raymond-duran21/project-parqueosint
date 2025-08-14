import { Database } from '../database';
import { User, UserProfile, CreateUserDTO, LoginDTO } from '../models';

export class AuthService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // Simular hashing de contraseña (en producción usar bcrypt o similar)
  private hashPassword(password: string): string {
    return `hashed_${password}_${Date.now()}`;
  }

  // Verificar contraseña (en producción usar bcrypt.compare)
  private verifyPassword(password: string, hash: string): boolean {
    // Para efectos de demo, cualquier contraseña es válida
    // En producción esto sería: return bcrypt.compare(password, hash);
    return true;
  }

  async login(credentials: LoginDTO): Promise<UserProfile | null> {
    try {
      const query = `
        SELECT id, name, email, phone, password_hash, created_at
        FROM users 
        WHERE email = ? LIMIT 1
      `;
      
      const user = await this.db.getFirst(query, [credentials.email]) as User;
      
      if (!user) {
        return null;
      }

      // Verificar contraseña
      if (!this.verifyPassword(credentials.password, user.password_hash)) {
        return null;
      }

      // Obtener estadísticas del usuario
      const statsQuery = `
        SELECT 
          COUNT(*) as totalReservations,
          COALESCE(SUM(amount), 0) as totalSpent
        FROM reservations 
        WHERE user_id = ?
      `;
      
      const stats = await this.db.getFirst(statsQuery, [user.id]);

      // Obtener parqueo favorito
      const favoriteQuery = `
        SELECT p.name
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.user_id = ?
        GROUP BY r.parking_id
        ORDER BY COUNT(*) DESC
        LIMIT 1
      `;
      
      const favorite = await this.db.getFirst(favoriteQuery, [user.id]);

      // Crear perfil de usuario
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberSince: new Date(user.created_at).toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        }),
        totalReservations: (stats as any)?.totalReservations || 0,
        favoriteParking: (favorite as any)?.name || 'Centro Comercial Plaza',
        totalSpent: (stats as any)?.totalSpent || 0,
        rating: 4.8 // Rating estático por ahora
      };

      return userProfile;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  async register(userData: CreateUserDTO): Promise<UserProfile | null> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.db.getFirst(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const hashedPassword = this.hashPassword(userData.password);

      // Insertar nuevo usuario
      const result = await this.db.executeQuery(
        `INSERT INTO users (name, email, phone, password_hash) 
         VALUES (?, ?, ?, ?)`,
        [userData.name, userData.email, userData.phone, hashedPassword]
      );

      if (!result.insertId) {
        throw new Error('Error al crear usuario');
      }

      // Crear perfil inicial
      const userProfile: UserProfile = {
        id: result.insertId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        memberSince: new Date().toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        }),
        totalReservations: 0,
        favoriteParking: undefined,
        totalSpent: 0,
        rating: 5.0
      };

      return userProfile;
    } catch (error) {
      console.error('Error en registro:', error);
      return null;
    }
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    try {
      const userQuery = `
        SELECT id, name, email, phone, created_at
        FROM users 
        WHERE id = ? LIMIT 1
      `;
      
      const user = await this.db.getFirst(userQuery, [userId]) as User;
      
      if (!user) {
        return null;
      }

      // Obtener estadísticas del usuario
      const statsQuery = `
        SELECT 
          COUNT(*) as totalReservations,
          COALESCE(SUM(amount), 0) as totalSpent
        FROM reservations 
        WHERE user_id = ?
      `;
      
      const stats = await this.db.getFirst(statsQuery, [userId]);

      // Obtener parqueo favorito
      const favoriteQuery = `
        SELECT p.name
        FROM reservations r
        JOIN parkings p ON r.parking_id = p.id
        WHERE r.user_id = ?
        GROUP BY r.parking_id
        ORDER BY COUNT(*) DESC
        LIMIT 1
      `;
      
      const favorite = await this.db.getFirst(favoriteQuery, [userId]);

      // Crear perfil de usuario
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberSince: new Date(user.created_at).toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        }),
        totalReservations: (stats as any)?.totalReservations || 0,
        favoriteParking: (favorite as any)?.name || undefined,
        totalSpent: (stats as any)?.totalSpent || 0,
        rating: 4.8
      };

      return userProfile;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  async updateUserProfile(userId: number, updates: Partial<CreateUserDTO>): Promise<boolean> {
    try {
      const fields = [];
      const values = [];

      if (updates.name) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.email) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.phone) {
        fields.push('phone = ?');
        values.push(updates.phone);
      }

      if (fields.length === 0) {
        return true;
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      const result = await this.db.executeQuery(query, values);
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return false;
    }
  }
}
