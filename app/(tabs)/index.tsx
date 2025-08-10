import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  Filter,
  MapPin,
  Car,
  Clock,
  DollarSign,
  Zap,
} from 'lucide-react-native';
import { ParkingCard } from '@/components/ParkingCard';
import { FilterModal } from '@/components/FilterModal';

const mockParkings = [
  {
    id: '1',
    name: 'Centro Comercial Plaza',
    address: 'Av. Principal 123, Centro',
    distance: '0.2 km',
    pricePerHour: 2500,
    availableSpots: 15,
    totalSpots: 100,
    features: ['Cámaras', 'Sensores', 'QR'],
    status: 'available',
  },
  {
    id: '2',
    name: 'Parqueo Municipal Norte',
    address: 'Calle 5ta Norte, Zona 1',
    distance: '0.5 km',
    pricePerHour: 1800,
    availableSpots: 3,
    totalSpots: 50,
    features: ['Sensores', 'QR'],
    status: 'limited',
  },
  {
    id: '3',
    name: 'Torre Empresarial',
    address: 'Blvd. Los Próceres 445',
    distance: '0.8 km',
    pricePerHour: 3200,
    availableSpots: 0,
    totalSpots: 200,
    features: ['Cámaras', 'Sensores', 'QR', 'Valet'],
    status: 'full',
  },
  {
    id: '4',
    name: 'Estadio Nacional',
    address: 'Av. del Deporte s/n',
    distance: '1.2 km',
    pricePerHour: 1500,
    availableSpots: 45,
    totalSpots: 300,
    features: ['Sensores'],
    status: 'available',
  },
];

export default function MapScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAutoSearch = () => {
    // Simular búsqueda automática
    console.log('Buscando parqueo automáticamente...');
  };

  const handleParkingPress = (parkingId: string) => {
    router.push(`/parqueo/${parkingId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Encuentra tu parqueo</Text>
        <Text style={styles.subtitle}>Parqueos disponibles cerca de ti</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" />
          <Text style={styles.searchText}>Buscar por ubicación...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <MapPin size={16} color="#10B981" />
          <Text style={styles.statText}>4 parqueos cercanos</Text>
        </View>
        <View style={styles.statItem}>
          <Car size={16} color="#F59E0B" />
          <Text style={styles.statText}>63 espacios disponibles</Text>
        </View>
      </View>

      <ScrollView style={styles.parkingList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Parqueos Disponibles</Text>
        {mockParkings.map((parking) => (
          <ParkingCard
            key={parking.id}
            parking={parking}
            onPress={() => handleParkingPress(parking.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.autoSearchButton} onPress={handleAutoSearch}>
        <Zap size={24} color="white" />
        <Text style={styles.autoSearchText}>Buscar Automáticamente</Text>
      </TouchableOpacity>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#9CA3AF',
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  parkingList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  autoSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  autoSearchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});