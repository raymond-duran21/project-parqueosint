import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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
import { ParkingService } from '@/db/services/ParkingService';
import { Parking } from '@/db/models';
import { Database } from '@/db/database';

export default function MapScreen() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ availableParkings: 0, availableSpots: 0 });
  const [parkingService] = useState(() => new ParkingService());

  useEffect(() => {
    loadParkings();
    loadStats();
  }, []);

  // Recargar datos cuando la pantalla vuelve al foco (después de hacer una reserva)
  useFocusEffect(
    useCallback(() => {
      console.log('Pantalla principal en foco, recargando datos...');
      loadParkings();
      loadStats();
    }, [])
  );

  const loadParkings = async () => {
    try {
      const data = await parkingService.getAllParkings();
      setParkings(data);
    } catch (error) {
      console.error('Error cargando parqueos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const availableParkings = await parkingService.getAvailableParkingsCount();
      const availableSpots = await parkingService.getTotalAvailableSpots();
      setStats({ availableParkings, availableSpots });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleAutoSearch = () => {
    // Simular búsqueda automática - recargar datos
    console.log('Buscando parqueo automáticamente...');
    loadParkings();
    loadStats();
  };

  const handleResetDatabase = async () => {
    console.log('Reseteando base de datos...');
    try {
      const db = Database.getInstance();
      await db.resetDatabase();
      console.log('Base de datos reseteada, recargando datos...');
      await loadParkings();
      await loadStats();
    } catch (error) {
      console.error('Error reseteando base de datos:', error);
    }
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
          <Text style={styles.statText}>{stats.availableParkings} parqueos cercanos</Text>
        </View>
        <View style={styles.statItem}>
          <Car size={16} color="#F59E0B" />
          <Text style={styles.statText}>{stats.availableSpots} espacios disponibles</Text>
        </View>
      </View>

      <ScrollView style={styles.parkingList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Parqueos Disponibles</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando parqueos...</Text>
        ) : parkings.length > 0 ? (
          parkings.map((parking) => (
            <ParkingCard
              key={parking.id}
              parking={{
                id: parking.id.toString(),
                name: parking.name,
                address: parking.address,
                distance: parking.distance || '0 km',
                pricePerHour: parking.pricePerHour,
                availableSpots: parking.availableSpots,
                totalSpots: parking.totalSpots,
                features: parking.features,
                status: parking.status,
              }}
              onPress={() => handleParkingPress(parking.id.toString())}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No hay parqueos disponibles</Text>
        )}
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
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 32,
  },
});
