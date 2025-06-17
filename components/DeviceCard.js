import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DeviceCard = ({ device = {} }) => { // ← Valor por defecto para device
  const navigation = useNavigation();

  // Si no hay dispositivo, muestra un mensaje
  if (!device.id) {
    return (
      <View style={[styles.card, { backgroundColor: '#fffde7' }]}>
        <Text style={styles.name}>Dispositivo no disponible</Text>
      </View>
    );
  }

  const togglePower = async () => {
    try {
      await updateDoc(doc(db, 'dispositivos', device.id), {
        estado: device.estado === 'ON' ? 'OFF' : 'ON',
      });
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: device.estado === 'ON' ? '#e8f5e9' : '#ffebee' },
      ]}
      onPress={() => navigation.navigate('DeviceDetail', { device })}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{device.nombre || 'Nombre no definido'}</Text>
        <Text style={styles.type}>{device.tipo || 'Tipo no definido'}</Text>
        <Text style={styles.status}>
          Estado: {device.estado === 'ON' ? 'Encendido' : 'Apagado'}
        </Text>
        
        {/* Muestra intensidad/velocidad si está disponible */}
        {device.estado === 'ON' && (
          <Text style={styles.detail}>
            {device.tipo === 'LUZ' 
              ? `Intensidad: ${device.intensidad || 1}/5`
              : `Velocidad: ${device.velocidad || 0}%`
            }
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={togglePower}>
        <Text style={styles.buttonText}>
          {device.estado === 'ON' ? 'Apagar' : 'Encender'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeviceCard;