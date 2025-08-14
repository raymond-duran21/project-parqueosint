import { HistoryCard } from '@/components/HistoryCard';
import { useAuth } from '@/contexts/AuthContext';
import { ReservationHistory } from '@/db/models';
import { ReservationService } from '@/db/services/ReservationService';
import { Calendar, Clock, DollarSign } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [history, setHistory] = useState<ReservationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalSpent: 0,
    totalHours: 0,
  });
  const { user } = useAuth();
  const [reservationService] = useState(() => new ReservationService());

  useEffect(() => {
    if (user) {
      loadHistory();
      loadStats();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const data = await reservationService.getUserReservations(user.id);
      setHistory(data);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      const userStats = await reservationService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
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
          <Text style={styles.statNumber}>{stats.totalReservations}</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>

        <View style={styles.statCard}>
          <Clock size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.totalHours}h</Text>
          <Text style={styles.statLabel}>Tiempo Total</Text>
        </View>

        <View style={styles.statCard}>
          <DollarSign size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {formatCurrency(stats.totalSpent)}
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

      <ScrollView
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Reservas Recientes</Text>
        {loading ? (
          <Text style={styles.loadingText}>Cargando historial...</Text>
        ) : history.length > 0 ? (
          history.map((item) => (
            <HistoryCard key={item.id} historyItem={item} />
          ))
        ) : (
          <Text style={styles.emptyText}>No tienes reservas aún</Text>
        )}
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
