import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, DollarSign, Camera, Scan, Car } from 'lucide-react-native';

interface ParkingCardProps {
  parking: {
    id: string;
    name: string;
    address: string;
    distance: string;
    pricePerHour: number;
    availableSpots: number;
    totalSpots: number;
    features: string[];
    status: 'available' | 'limited' | 'full';
  };
  onPress: () => void;
}

export function ParkingCard({ parking, onPress }: ParkingCardProps) {
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
    return `₡${price.toLocaleString()}/h`;
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Cámaras':
        return <Camera size={12} color="#6B7280" />;
      case 'QR':
        return <Scan size={12} color="#6B7280" />;
      case 'Sensores':
        return <Car size={12} color="#6B7280" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, parking.status === 'full' && styles.cardDisabled]}
      onPress={onPress}
      disabled={parking.status === 'full'}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.name}>{parking.name}</Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.address}>{parking.address}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.infoText}>{parking.distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <DollarSign size={16} color="#6B7280" />
            <Text style={styles.infoText}>{formatPrice(parking.pricePerHour)}</Text>
          </View>
        </View>

        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityText}>
            {parking.availableSpots} de {parking.totalSpots} espacios disponibles
          </Text>
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
        </View>

        <View style={styles.features}>
          {parking.features.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              {getFeatureIcon(feature)}
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
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
  info: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  availabilityRow: {
    gap: 6,
  },
  availabilityText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});