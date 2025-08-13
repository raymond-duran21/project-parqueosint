import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, MapPin, DollarSign, Car } from 'lucide-react-native';

export interface FilterOptions {
  distance: string;
  price: string;
  features: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export function FilterModal({ visible, onClose, onApplyFilters, initialFilters }: FilterModalProps) {
  const [selectedDistance, setSelectedDistance] = useState(initialFilters?.distance || '1km');
  const [selectedPrice, setSelectedPrice] = useState(initialFilters?.price || 'all');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFilters?.features || []);

  const distances = [
    { label: '500m', value: '500m' },
    { label: '1km', value: '1km' },
    { label: '2km', value: '2km' },
    { label: '5km', value: '5km' },
  ];

  const prices = [
    { label: 'Todos los precios', value: 'all' },
    { label: 'Hasta ₡2,000/h', value: '2000' },
    { label: 'Hasta ₡3,000/h', value: '3000' },
    { label: 'Más de ₡3,000/h', value: '3000+' },
  ];

  const features = [
    { label: 'Cámaras de seguridad', value: 'cameras' },
    { label: 'Sensores IoT', value: 'sensors' },
    { label: 'Acceso QR', value: 'qr' },
    { label: 'Valet parking', value: 'valet' },
  ];

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const clearFilters = () => {
    setSelectedDistance('1km');
    setSelectedPrice('all');
    setSelectedFeatures([]);
  };

  const applyFilters = () => {
    const filters: FilterOptions = {
      distance: selectedDistance,
      price: selectedPrice,
      features: selectedFeatures,
    };
    onApplyFilters?.(filters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros de Búsqueda</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MapPin size={20} color="#2563EB" />
                <Text style={styles.sectionTitle}>Distancia Máxima</Text>
              </View>
              <View style={styles.optionsGrid}>
                {distances.map((distance) => (
                  <TouchableOpacity
                    key={distance.value}
                    style={[
                      styles.optionButton,
                      selectedDistance === distance.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedDistance(distance.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDistance === distance.value && styles.optionTextActive,
                      ]}
                    >
                      {distance.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <DollarSign size={20} color="#2563EB" />
                <Text style={styles.sectionTitle}>Rango de Precios</Text>
              </View>
              <View style={styles.optionsList}>
                {prices.map((price) => (
                  <TouchableOpacity
                    key={price.value}
                    style={[
                      styles.listOption,
                      selectedPrice === price.value && styles.listOptionActive,
                    ]}
                    onPress={() => setSelectedPrice(price.value)}
                  >
                    <Text
                      style={[
                        styles.listOptionText,
                        selectedPrice === price.value && styles.listOptionTextActive,
                      ]}
                    >
                      {price.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Car size={20} color="#2563EB" />
                <Text style={styles.sectionTitle}>Características</Text>
              </View>
              <View style={styles.featuresGrid}>
                {features.map((feature) => (
                  <TouchableOpacity
                    key={feature.value}
                    style={[
                      styles.featureButton,
                      selectedFeatures.includes(feature.value) && styles.featureButtonActive,
                    ]}
                    onPress={() => toggleFeature(feature.value)}
                  >
                    <Text
                      style={[
                        styles.featureText,
                        selectedFeatures.includes(feature.value) && styles.featureTextActive,
                      ]}
                    >
                      {feature.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Limpiar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  optionButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionTextActive: {
    color: 'white',
  },
  optionsList: {
    gap: 8,
  },
  listOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  listOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  listOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  listOptionTextActive: {
    color: '#2563EB',
    fontWeight: '500',
  },
  featuresGrid: {
    gap: 8,
  },
  featureButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  featureButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
  },
  featureTextActive: {
    color: '#2563EB',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});