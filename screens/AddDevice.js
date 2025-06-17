import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AddDevice = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('LUZ');
  const [ubicacion, setUbicacion] = useState('SALA');

  const ubicaciones = [
    'AULA 1', 'AULA 2', 'AULA 3',
    'COMPUTO 1', 'COMPUTO 2', 'COMPUTO 3',
    'ADMINISTRATIVO', 'SALA', 'AUDITORIO',
  ];

  const handleAddDevice = async () => {
    if (!nombre.trim() || nombre.length < 3) {
      Alert.alert('Error', 'El nombre debe tener al menos 3 caracteres');
      return;
    }

    try {
      await addDoc(collection(db, 'dispositivos'), {
        nombre: nombre.trim(),
        tipo,
        ubicacion,
        estado: 'OFF',
        creadoEn: new Date(),
        intensidad: tipo === 'LUZ' ? 1 : undefined, // Valor por defecto para luces
        velocidad: tipo === 'VENTILADOR' ? 20 : undefined, // Valor por defecto para ventiladores
      });
      Alert.alert('Éxito', 'Dispositivo agregado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Falló al agregar: ${error.message}`);
      console.error("Error en handleAddDevice:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Dispositivo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ej: Luz Principal"
        value={nombre}
        onChangeText={setNombre}
        maxLength={30}
        testID="nombre-input"
      />

      <Picker
        selectedValue={tipo}
        onValueChange={setTipo}
        style={styles.picker}
        testID="tipo-picker"
      >
        <Picker.Item label="Luz" value="LUZ" />
        <Picker.Item label="Ventilador" value="VENTILADOR" />
      </Picker>

      <Picker
        selectedValue={ubicacion}
        onValueChange={setUbicacion}
        style={styles.picker}
        testID="ubicacion-picker"
      >
        {ubicaciones.map((loc) => (
          <Picker.Item key={loc} label={loc} value={loc} />
        ))}
      </Picker>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddDevice}
        testID="add-button"
      >
        <Text style={styles.addButtonText}>AGREGAR DISPOSITIVO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
// Estilos (igual que antes)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddDevice;
