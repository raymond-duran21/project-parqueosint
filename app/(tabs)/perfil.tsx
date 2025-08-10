import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, Mail, Phone, CreditCard, Settings, CircleHelp as HelpCircle, Shield, LogOut, CreditCard as Edit, Bell, Car } from 'lucide-react-native';

const userProfile = {
  name: 'Juan Carlos Pérez',
  email: 'juan.perez@email.com',
  phone: '+502 1234-5678',
  memberSince: 'Enero 2024',
  totalReservations: 15,
  favoriteParking: 'Centro Comercial Plaza',
};

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Función en desarrollo');
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <User size={32} color="#2563EB" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
              <Text style={styles.memberSince}>
                Miembro desde {userProfile.memberSince}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.totalReservations}</Text>
            <Text style={styles.statLabel}>Reservas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Calificación</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₡45,600</Text>
            <Text style={styles.statLabel}>Ahorrado</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<Mail size={20} color="#6B7280" />}
              title="Correo Electrónico"
              subtitle={userProfile.email}
              onPress={() => Alert.alert('Editar Email', 'Función en desarrollo')}
            />
            <MenuItem
              icon={<Phone size={20} color="#6B7280" />}
              title="Teléfono"
              subtitle={userProfile.phone}
              onPress={() => Alert.alert('Editar Teléfono', 'Función en desarrollo')}
            />
            <MenuItem
              icon={<Car size={20} color="#6B7280" />}
              title="Mis Vehículos"
              subtitle="Honda Civic 2020"
              onPress={() => Alert.alert('Mis Vehículos', 'Función en desarrollo')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagos y Facturación</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<CreditCard size={20} color="#6B7280" />}
              title="Métodos de Pago"
              subtitle="Visa terminada en 4532"
              onPress={() => Alert.alert('Métodos de Pago', 'Función en desarrollo')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<Bell size={20} color="#6B7280" />}
              title="Notificaciones"
              subtitle="Activadas"
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <MenuItem
              icon={<Settings size={20} color="#6B7280" />}
              title="Configuración General"
              onPress={() => Alert.alert('Configuración', 'Función en desarrollo')}
            />
            <MenuItem
              icon={<Shield size={20} color="#6B7280" />}
              title="Privacidad y Seguridad"
              onPress={() => Alert.alert('Privacidad', 'Función en desarrollo')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon={<HelpCircle size={20} color="#6B7280" />}
              title="Centro de Ayuda"
              onPress={() => Alert.alert('Ayuda', 'Función en desarrollo')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 8,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  menuGroup: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 32,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
});