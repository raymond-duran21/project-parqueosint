import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Car,
  Camera,
  Scan,
  Shield,
  Navigation,
  Calendar,
} from 'lucide-react-native';

const mockParkingDetails = {
  '1': {
    id: '1',
    name: 'Centro Comercial Plaza',
    address: 'Av. Principal 123, Centro',
    distance: '0.2 km',
    pricePerHour: 2500,
    availableSpots: 15,
    totalSpots: 100,
    features: ['Cámaras', 'Sensores', 'QR'],
    status: 'available',
    description: 'Parqueo seguro en el corazón del centro comercial con acceso directo a todas las tiendas.',
    operatingHours: '06:00 - 23:00',
    security: 'Vigilancia 24/7 con cámaras de seguridad',
    paymentMethods: ['Tarjeta de crédito', 'Wallet digital', 'Efectivo'],
    contactPhone: '+502 2234-5678',
  },
  '2': {
    id: '2',
    name: 'Parqueo Municipal Norte',
    address: 'Calle 5ta Norte, Zona 1',
    distance: '0.5 km',
    pricePerHour: 1800,
    availableSpots: 3,
    totalSpots: 50,
    features: ['Sensores', 'QR'],
    status: 'limited',
    description: 'Parqueo municipal con tarifas accesibles y tecnología de sensores para facilitar encontrar espacios.',
    operatingHours: '05:00 - 22:00',
    security: 'Patrullaje regular y sensores de movimiento',
    paymentMethods: ['Tarjeta de crédito', 'Wallet digital'],
    contactPhone: '+502 2234-5679',
  },
};

export default function ParkingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  
  const parking = mockParkingDetails[id as keyof typeof mockParkingDetails];

  if (!parking) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Parqueo no encontrado</Text>
      </SafeAreaView>
    );
  }

  const handleReserve = () => {
    if (parking.status === 'full') {
      Alert.alert('No disponible', 'Este parqueo está completamente lleno');
      return;
    }
    
    router.push({
      pathname: '/reserva/pago',
      params: { parkingId: parking.id },
    });
  };

  const handleGetDirections = () => {
    Alert.alert('Navegación', 'Abriendo navegación GPS...');
  };

  const getStatusColor = () => {
    switch (parking.status) {
      case 'available':
        return '#10B981';
      case 'limited':
        return '#F59E0B';
      case 'full':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (parking.status) {
      case 'available':
        return 'Disponible';
      case 'limited':
        return 'Pocos espacios';
      case 'full':
        return 'Completo';
      default:
        return 'Desconocido';
    }
  };

  const formatPrice = (price: number) => {
    return `₡${price.toLocaleString()}`;
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Cámaras':
        return <Camera size={16} color="#2563EB" />;
      case 'QR':
        return <Scan size={16} color="#2563EB" />;
      case 'Sensores':
        return <Car size={16} color="#2563EB" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Parqueo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{parking.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.address}>{parking.address}</Text>
          </View>

          <Text style={styles.description}>{parking.description}</Text>
        </View>

        <View style={styles.availabilitySection}>
          <Text style={styles.sectionTitle}>Disponibilidad en Tiempo Real</Text>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityNumber}>
                {parking.availableSpots}
              </Text>
              <Text style={styles.availabilityLabel}>Espacios Disponibles</Text>
            </View>
            <View style={styles.availabilityInfo}>
              <Text style={styles.availabilityNumber}>
                {parking.totalSpots}
              </Text>
              <Text style={styles.availabilityLabel}>Total de Espacios</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(parking.availableSpots / parking.totalSpots) * 100}%`,
                      backgroundColor: getStatusColor(),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((parking.availableSpots / parking.totalSpots) * 100)}% disponible
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Precios</Text>
          <View style={styles.priceCard}>
            <DollarSign size={24} color="#2563EB" />
            <View style={styles.priceInfo}>
              <Text style={styles.priceAmount}>{formatPrice(parking.pricePerHour)}</Text>
              <Text style={styles.priceLabel}>por hora</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características Tecnológicas</Text>
          <View style={styles.featuresGrid}>
            {parking.features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                {getFeatureIcon(feature)}
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Adicional</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Clock size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Horarios de Operación</Text>
                <Text style={styles.infoValue}>{parking.operatingHours}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Shield size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Seguridad</Text>
                <Text style={styles.infoValue}>{parking.security}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <DollarSign size={16} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Métodos de Pago</Text>
                <Text style={styles.infoValue}>
                  {parking.paymentMethods.join(', ')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleGetDirections}
        >
          <Navigation size={20} color="#2563EB" />
          <Text style={styles.directionsText}>Ver Ruta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.reserveButton,
            parking.status === 'full' && styles.reserveButtonDisabled,
          ]}
          onPress={handleReserve}
          disabled={parking.status === 'full'}
        >
          <Calendar size={20} color="white" />
          <Text style={styles.reserveText}>
            {parking.status === 'full' ? 'No Disponible' : 'Reservar Ahora'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mainInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  availabilitySection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  availabilityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  availabilityInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  priceSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  priceInfo: {
    marginLeft: 12,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  featuresSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  infoCard: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  directionsText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  reserveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  reserveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  reserveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});