import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const EditDevice = () => {
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    const querySnapshot = await getDocs(collection(db, 'dispositivos'));
    const fetchedDevices = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setDevices(fetchedDevices);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const updateDevice = async (deviceId, updates) => {
    try {
      const deviceRef = doc(db, 'dispositivos', deviceId);
      await updateDoc(deviceRef, updates);
      fetchDevices();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el dispositivo');
      console.error(error);
    }
  };

  const deleteDevice = async (deviceId) => {
    Alert.alert('Confirmar', '¿Estás seguro de eliminar este dispositivo?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'dispositivos', deviceId));
            fetchDevices();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el dispositivo');
            console.error(error);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text>Tipo: {item.tipo}</Text>
      <Text>Ubicación: {item.ubicacion}</Text>

      {/* Cambiar nombre */}
      <TextInput
        style={styles.input}
        value={item.nombre}
        onChangeText={(text) => updateDevice(item.id, { nombre: text })}
      />

      {/* Cambiar intensidad si es LUZ */}
      {item.tipo === 'LUZ' && (
        <Picker
          selectedValue={item.intensidad || 1}
          onValueChange={(val) => updateDevice(item.id, { intensidad: val })}
          style={styles.picker}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <Picker.Item key={n} label={`Intensidad ${n}`} value={n} />
          ))}
        </Picker>
      )}

      {/* Cambiar velocidad si es VENTILADOR */}
      {item.tipo === 'VENTILADOR' && (
        <Picker
          selectedValue={item.velocidad || 20}
          onValueChange={(val) => updateDevice(item.id, { velocidad: val })}
          style={styles.picker}
        >
          <Picker.Item label="Baja (20%)" value={20} />
          <Picker.Item label="Media (50%)" value={50} />
          <Picker.Item label="Alta (80%)" value={80} />
          <Picker.Item label="Máxima (100%)" value={100} />
        </Picker>
      )}

      {/* Botón de eliminar */}
      <TouchableOpacity
        onPress={() => deleteDevice(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={devices}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditDevice;
