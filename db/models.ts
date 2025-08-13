// Interfaces para los modelos de datos

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  memberSince: string;
  totalReservations: number;
  favoriteParking?: string;
  totalSpent: number;
  rating: number;
}

export interface Parking {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  distance?: string; // Calculado dinámicamente
  pricePerHour: number;
  totalSpots: number;
  availableSpots: number;
  features: string[];
  status: 'available' | 'limited' | 'full';
  description?: string;
  operatingHours?: string;
  security?: string;
  paymentMethods?: string[];
  contactPhone?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  user_id: number;
  parking_id: number;
  parkingName?: string; // Para joins
  address?: string; // Para joins
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  duration?: string; // Formato legible (ej: "3h 15min")
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ReservationHistory {
  id: string;
  parkingName: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  amount: number;
  status: string;
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  type: 'card' | 'bank' | 'digital_wallet';
  last_four: string;
  is_default: boolean;
  created_at: string;
}

export interface Vehicle {
  id: number;
  user_id: number;
  make: string;
  model: string;
  year?: number;
  license_plate?: string;
  color?: string;
  is_default: boolean;
  created_at: string;
}

// DTOs para crear/actualizar datos
export interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateReservationDTO {
  userId: number;
  parkingId: number;
  startTime: string;
  endTime?: string;
  totalAmount?: number;
  paymentMethod?: string;
  status?: 'active' | 'completed' | 'cancelled';
  estimated_duration_minutes?: number;
  
  // Campos legacy para retrocompatibilidad
  user_id?: number;
  parking_id?: number;
  start_time?: string;
}

export interface UpdateReservationDTO {
  end_time: string;
  duration_minutes: number;
  amount: number;
  status: 'completed' | 'cancelled';
}

export interface CreateParkingDTO {
  name: string;
  address: string;
  latitude?: number;
  longitude: number;
  price_per_hour: number;
  total_spots: number;
  available_spots: number;
  features: string[];
}

export interface UpdateParkingDTO {
  available_spots?: number;
  status?: 'available' | 'limited' | 'full';
}

// Enums para valores constantes
export enum ReservationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ParkingStatus {
  AVAILABLE = 'available',
  LIMITED = 'limited',
  FULL = 'full'
}

export enum PaymentType {
  CARD = 'card',
  BANK = 'bank',
  DIGITAL_WALLET = 'digital_wallet'
}
