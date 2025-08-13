import * as SQLite from 'expo-sqlite';

// Configuración de la base de datos
const DATABASE_NAME = 'smartparking.db';

// Interface para el resultado de la base de datos
export interface DBResult {
  insertId?: number;
  rowsAffected: number;
}

// Interface para las filas de resultados
export interface DBRow {
  [key: string]: any;
}

export class Database {
  private static instance: Database;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
      await this.seedData();
      console.log('Base de datos inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createParkingsTable = `
      CREATE TABLE IF NOT EXISTS parkings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        price_per_hour INTEGER NOT NULL,
        total_spots INTEGER NOT NULL,
        available_spots INTEGER NOT NULL,
        features TEXT, -- JSON string
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createReservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        parking_id INTEGER NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_minutes INTEGER,
        amount INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (parking_id) REFERENCES parkings (id)
      );
    `;

    const createPaymentMethodsTable = `
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL, -- 'card', 'bank', etc.
        last_four TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    const createVehiclesTable = `
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER,
        license_plate TEXT,
        color TEXT,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    await this.db.execAsync(createUsersTable);
    await this.db.execAsync(createParkingsTable);
    await this.db.execAsync(createReservationsTable);
    await this.db.execAsync(createPaymentMethodsTable);
    await this.db.execAsync(createVehiclesTable);
  }

  private async seedData(): Promise<void> {
    if (!this.db) throw new Error('Base de datos no inicializada');

    // Verificar si ya hay datos
    const userCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM users');
    if ((userCount as any)?.count > 0) {
      console.log('La base de datos ya tiene datos, saltando seed...');
      return;
    }

    // Insertar usuario de prueba
    await this.db.runAsync(
      `INSERT INTO users (name, email, phone, password_hash) 
       VALUES (?, ?, ?, ?)`,
      ['Juan Carlos Pérez', 'juan.perez@email.com', '+502 1234-5678', 'hashed_password_123']
    );

    const userId = 1; // Asumimos que es el primer usuario

    // Insertar parqueos de prueba
    const parkings = [
      {
        name: 'Centro Comercial Plaza',
        address: 'Av. Principal 123, Centro',
        price: 2500,
        total: 100,
        available: 15,
        features: JSON.stringify(['Cámaras', 'Sensores', 'QR']),
        status: 'available'
      },
      {
        name: 'Parqueo Municipal Norte',
        address: 'Calle 5ta Norte, Zona 1',
        price: 1800,
        total: 50,
        available: 3,
        features: JSON.stringify(['Sensores', 'QR']),
        status: 'limited'
      },
      {
        name: 'Torre Empresarial',
        address: 'Blvd. Los Próceres 445',
        price: 3200,
        total: 200,
        available: 0,
        features: JSON.stringify(['Cámaras', 'Sensores', 'QR', 'Valet']),
        status: 'full'
      },
      {
        name: 'Estadio Nacional',
        address: 'Av. del Deporte s/n',
        price: 1500,
        total: 300,
        available: 45,
        features: JSON.stringify(['Sensores']),
        status: 'available'
      }
    ];

    for (const parking of parkings) {
      await this.db.runAsync(
        `INSERT INTO parkings (name, address, price_per_hour, total_spots, available_spots, features, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [parking.name, parking.address, parking.price, parking.total, parking.available, parking.features, parking.status]
      );
    }

    // Insertar historial de reservas
    const reservations = [
      {
        parking_id: 1,
        start_time: '2024-01-15 14:30:00',
        end_time: '2024-01-15 17:45:00',
        duration: 195, // 3h 15min
        amount: 8125,
        status: 'completed'
      },
      {
        parking_id: 3,
        start_time: '2024-01-12 09:00:00',
        end_time: '2024-01-12 18:00:00',
        duration: 540, // 9h
        amount: 28800,
        status: 'completed'
      },
      {
        parking_id: 2,
        start_time: '2024-01-10 12:15:00',
        end_time: '2024-01-10 16:30:00',
        duration: 255, // 4h 15min
        amount: 7650,
        status: 'completed'
      },
      {
        parking_id: 4,
        start_time: '2024-01-08 19:00:00',
        end_time: '2024-01-08 23:00:00',
        duration: 240, // 4h
        amount: 6000,
        status: 'completed'
      }
    ];

    for (const reservation of reservations) {
      await this.db.runAsync(
        `INSERT INTO reservations (user_id, parking_id, start_time, end_time, duration_minutes, amount, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, reservation.parking_id, reservation.start_time, reservation.end_time, reservation.duration, reservation.amount, reservation.status]
      );
    }

    // Insertar método de pago de prueba
    await this.db.runAsync(
      `INSERT INTO payment_methods (user_id, type, last_four, is_default) 
       VALUES (?, ?, ?, ?)`,
      [userId, 'card', '4532', 1]
    );

    // Insertar vehículo de prueba
    await this.db.runAsync(
      `INSERT INTO vehicles (user_id, make, model, year, license_plate, color, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, 'Honda', 'Civic', 2020, 'P123456', 'Blanco', 1]
    );

    console.log('Datos de prueba insertados correctamente');
  }

  public async executeQuery(query: string, params?: any[]): Promise<DBResult> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    const result = await this.db.runAsync(query, params);
    return {
      insertId: result.lastInsertRowId,
      rowsAffected: result.changes
    };
  }

  public async getAll(query: string, params?: any[]): Promise<DBRow[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    return await this.db.getAllAsync(query, params);
  }

  public async getFirst(query: string, params?: any[]): Promise<DBRow | null> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    return await this.db.getFirstAsync(query, params);
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}
