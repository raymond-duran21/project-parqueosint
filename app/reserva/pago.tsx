import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, MapPin, DollarSign, CreditCard, Smartphone, Calendar, QrCode, CircleCheck as CheckCircle } from 'lucide-react-native';

const mockParkingData = {
  '1': {
    name: 'Centro Comercial Plaza',
    address: 'Av. Principal 123, Centro',
    pricePerHour: 2500,
  },
  '2': {
    name: 'Parqueo Municipal Norte',
    address: 'Calle 5ta Norte, Zona 1',
    pricePerHour: 1800,
  },
};

export default function PaymentScreen() {
  const { parkingId } = useLocalSearchParams<{ parkingId: string }>();
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  const parking = mockParkingData[parkingId as keyof typeof mockParkingData];

  if (!parking) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Parqueo no encontrado</Text>
      </SafeAreaView>
    );
  }

  const durations = [
    { hours: 1, label: '1 hora' },
    { hours: 2, label: '2 horas' },
    { hours: 4, label: '4 horas' },
    { hours: 8, label: '8 horas' },
  ];

  const paymentMethods = [
    { id: 'card', label: 'Tarjeta de Crédito', icon: CreditCard },
    { id: 'wallet', label: 'Wallet Digital', icon: Smartphone },
  ];

  const calculateTotal = () => {
    return parking.pricePerHour * selectedDuration;
  };

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString()}`;
  };

  const handleConfirmReservation = () => {
    setLoading(true);
    
    // Simular proceso de pago
    setTimeout(() => {
      setLoading(false);
      setReservationConfirmed(true);
    }, 2000);
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  if (reservationConfirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color="#10B981" />
          <Text style={styles.successTitle}>¡Reserva Confirmada!</Text>
          <Text style={styles.successSubtitle}>
            Tu espacio ha sido reservado exitosamente
          </Text>

          <View style={styles.qrContainer}>
            <QrCode size={120} color="#2563EB" />
            <Text style={styles.qrText}>Código QR de Acceso</Text>
            <Text style={styles.qrSubtext}>
              Presenta este código al llegar al parqueo
            </Text>
          </View>

          <View style={styles.reservationDetails}>
            <Text style={styles.detailsTitle}>Detalles de la Reserva</Text>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Parqueo</Text>
                <Text style={styles.detailValue}>{parking.name}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Clock size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Duración</Text>
                <Text style={styles.detailValue}>{selectedDuration} horas</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <DollarSign size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Total Pagado</Text>
                <Text style={styles.detailValue}>{formatCurrency(calculateTotal())}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Calendar size={16} color="#6B7280" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Código de Reserva</Text>
                <Text style={styles.detailValue}>#SP{Date.now().toString().slice(-6)}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserva y Pago</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.parkingInfo}>
          <Text style={styles.parkingName}>{parking.name}</Text>
          <View style={styles.addressRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.address}>{parking.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecciona Duración</Text>
          <View style={styles.durationGrid}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.hours}
                style={[
                  styles.durationButton,
                  selectedDuration === duration.hours && styles.durationButtonActive,
                ]}
                onPress={() => setSelectedDuration(duration.hours)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === duration.hours && styles.durationTextActive,
                  ]}
                >
                  {duration.label}
                </Text>
                <Text
                  style={[
                    styles.durationPrice,
                    selectedDuration === duration.hours && styles.durationPriceActive,
                  ]}
                >
                  {formatCurrency(parking.pricePerHour * duration.hours)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPayment === method.id && styles.paymentMethodActive,
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <method.icon
                  size={24}
                  color={selectedPayment === method.id ? '#2563EB' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPayment === method.id && styles.paymentMethodTextActive,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedPayment === 'card' && (
            <View style={styles.cardForm}>
              <Text style={styles.formLabel}>Información de la Tarjeta</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Número de tarjeta"
                keyboardType="numeric"
                maxLength={19}
              />
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, styles.formInputHalf]}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.formInput, styles.formInputHalf]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
              <TextInput
                style={styles.formInput}
                placeholder="Nombre del titular"
                autoCapitalize="words"
              />
            </View>
          )}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen de Pago</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Parqueo por {selectedDuration}h</Text>
            <Text style={styles.summaryValue}>{formatCurrency(calculateTotal())}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarifa de servicio</Text>
            <Text style={styles.summaryValue}>₡0</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total a Pagar</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.reserveButton, loading && styles.reserveButtonDisabled]}
          onPress={handleConfirmReservation}
          disabled={loading}
        >
          <Text style={styles.reserveButtonText}>
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
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
  parkingInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  parkingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
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
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  durationButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  durationText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  durationTextActive: {
    color: '#2563EB',
  },
  durationPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationPriceActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentMethodActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  paymentMethodTextActive: {
    color: '#2563EB',
  },
  cardForm: {
    marginTop: 16,
    gap: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formInputHalf: {
    flex: 1,
  },
  summary: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  summaryTotalValue: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reserveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    opacity: 0.6,
  },
  reserveButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  qrSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  reservationDetails: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  finishButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});