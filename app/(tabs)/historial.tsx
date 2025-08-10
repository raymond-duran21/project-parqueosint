import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, MapPin, Clock, DollarSign, Filter } from 'lucide-react-native';
import { HistoryCard } from '@/components/HistoryCard';

const mockHistory = [
  {
    id: '1',
    parkingName: 'Centro Comercial Plaza',
    address: 'Av. Principal 123, Centro',
    date: '2024-01-15',
    startTime: '14:30',
    endTime: '17:45',
    duration: '3h 15min',
    amount: 8125,
    status: 'completed',
  },
  {
    id: '2',
    parkingName: 'Torre Empresarial',
    address: 'Blvd. Los Próceres 445',
    date: '2024-01-12',
    startTime: '09:00',
    endTime: '18:00',
    duration: '9h 00min',
    amount: 28800,
    status: 'completed',
  },
  {
    id: '3',
    parkingName: 'Parqueo Municipal Norte',
    address: 'Calle 5ta Norte, Zona 1',
    date: '2024-01-10',
    startTime: '12:15',
    endTime: '16:30',
    duration: '4h 15min',
    amount: 7650,
    status: 'completed',
  },
  {
    id: '4',
    parkingName: 'Estadio Nacional',
    address: 'Av. del Deporte s/n',
    date: '2024-01-08',
    startTime: '19:00',
    endTime: '23:00',
    duration: '4h 00min',
    amount: 6000,
    status: 'completed',
  },
];

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('todos');

  const calculateTotalSpent = () => {
    return mockHistory.reduce((total, item) => total + item.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Reservas</Text>
        <Text style={styles.subtitle}>Tu actividad de parqueo</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Calendar size={24} color="#2563EB" />
          <Text style={styles.statNumber}>{mockHistory.length}</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>

        <View style={styles.statCard}>
          <Clock size={24} color="#10B981" />
          <Text style={styles.statNumber}>
            {mockHistory.reduce((total, item) => {
              const duration = parseFloat(item.duration.split('h')[0]);
              return total + duration;
            }, 0).toFixed(0)}h
          </Text>
          <Text style={styles.statLabel}>Tiempo Total</Text>
        </View>

        <View style={styles.statCard}>
          <DollarSign size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {formatCurrency(calculateTotalSpent())}
          </Text>
          <Text style={styles.statLabel}>Total Gastado</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'todos' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('todos')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'todos' && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'semana' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('semana')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'semana' && styles.filterTextActive,
              ]}
            >
              Esta Semana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'mes' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('mes')}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'mes' && styles.filterTextActive,
              ]}
            >
              Este Mes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Reservas Recientes</Text>
        {mockHistory.map((item) => (
          <HistoryCard key={item.id} historyItem={item} />
        ))}
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
  stats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  filters: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
});