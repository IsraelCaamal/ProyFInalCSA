import React, { useState } from 'react';
import { View,   Text,   TextInput,  StyleSheet,  TouchableOpacity,  Alert,  Modal, ScrollView,
Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

const ubicaciones = [
  'AULA 1', 'AULA 2', 'AULA 3',
  'COMPUTO 1', 'COMPUTO 2', 'COMPUTO 3',
  'ADMINISTRATIVO', 'SALA', 'AUDITORIO',
];

const DeviceDetail = ({ route }) => {
  const { device: initialDevice } = route.params;
  const [device, setDevice] = useState(initialDevice);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(initialDevice.nombre);
  const [tempType, setTempType] = useState(initialDevice.tipo);
  const [tempLocation, setTempLocation] = useState(initialDevice.ubicacion);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigation = useNavigation();

  // Actualiza campos en Firebase
  const updateField = async (field, value) => {
    try {
      await updateDoc(doc(db, 'dispositivos', device.id), { [field]: value });
      setDevice(prev => ({ ...prev, [field]: value }));
      return true;
    } catch (error) {
      console.error("Error en updateField:", error);
      return false;
    }
  };

  // Guardar todos los cambios
  const saveChanges = async () => {
    if (tempName.trim() === '') {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'dispositivos', device.id), { 
        nombre: tempName,
        tipo: tempType,
        ubicacion: tempLocation
      });
      
      setDevice(prev => ({ 
        ...prev, 
        nombre: tempName,
        tipo: tempType,
        ubicacion: tempLocation 
      }));
      
      setIsEditing(false);
      Alert.alert('Éxito', 'Los cambios se guardaron correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
      console.error("Error al guardar cambios:", error);
    }
  };

  // Control de intensidad/velocidad
  const handleValueChange = (value) => {
    const field = device.tipo === 'LUZ' ? 'intensidad' : 'velocidad';
    updateField(field, Math.round(value));
  };

  // Cambiar estado ON/OFF
  const toggleStatus = async () => {
    const newStatus = device.estado === 'ON' ? 'OFF' : 'ON';
    const success = await updateField('estado', newStatus);
    if (success) {
      Alert.alert('Estado actualizado', `Dispositivo ${newStatus}`);
    }
  };

  // Eliminar dispositivo
  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar el dispositivo ${device.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'dispositivos', device.id));
              Alert.alert('Eliminado', 'Dispositivo eliminado correctamente');
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el dispositivo');
            }
          }
        }
      ]
    );
  };

  // Color dinámico para controles
  const getColor = () => {
    if (device.tipo === 'LUZ') {
      const colors = ['#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#F44336'];
      return colors[(device.intensidad || 1) - 1];
    }
    return '#4CAF50'; // Color verde para ventiladores
  };

  // Seleccionar ubicación
  const selectLocation = (location) => {
    setTempLocation(location);
    setShowLocationModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con opción de edición */}
      <View style={styles.header}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Nombre del dispositivo"
              placeholderTextColor="#999"
            />
          </View>
        ) : (
          <Text style={styles.title}>{device.nombre}</Text>
        )}
        
        <TouchableOpacity 
          onPress={() => isEditing ? saveChanges() : setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editText}>
            {isEditing ? '💾 Guardar' : '✏️ Editar'}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editFields}>
          <Text style={styles.label}>Tipo de dispositivo:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[
                styles.radioOption,
                tempType === 'LUZ' && styles.radioOptionSelected
              ]}
              onPress={() => setTempType('LUZ')}
            >
              <Text style={tempType === 'LUZ' ? styles.radioTextSelected : styles.radioText}>Luz</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.radioOption,
                tempType === 'VENTILADOR' && styles.radioOptionSelected
              ]}
              onPress={() => setTempType('VENTILADOR')}
            >
              <Text style={tempType === 'VENTILADOR' ? styles.radioTextSelected : styles.radioText}>Ventilador</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Área/Ubicación:</Text>
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={styles.locationText}>{tempLocation || 'Seleccionar ubicación'}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.subtitle}>
            <Text style={styles.infoLabel}>Ubicación: </Text>
            {device.ubicacion}
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.infoLabel}>Tipo: </Text>
            {device.tipo === 'LUZ' ? 'Luz' : 'Ventilador'}
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.infoLabel}>Estado: </Text>
            <Text style={{ color: device.estado === 'ON' ? '#4CAF50' : '#F44336' }}>
              {device.estado}
            </Text>
          </Text>
        </View>
      )}

      {/* Botón de encendido/apagado */}
      <TouchableOpacity
        style={[
          styles.powerButton,
          { backgroundColor: device.estado === 'ON' ? getColor() : '#F44336' }
        ]}
        onPress={toggleStatus}
      >
        <Text style={styles.powerText}>
          {device.estado === 'ON' ? 'APAGAR' : 'ENCENDER'}
        </Text>
      </TouchableOpacity>

      {/* Controles de intensidad/velocidad (solo cuando está encendido) */}
      {device.estado === 'ON' && (
        <View style={styles.controlPanel}>
          <Text style={styles.controlTitle}>
            {device.tipo === 'LUZ' ? 'INTENSIDAD' : 'VELOCIDAD'}
          </Text>
          
          <Slider
            value={device.tipo === 'LUZ' ? device.intensidad || 1 : device.velocidad || 0}
            onValueChange={handleValueChange}
            minimumValue={1}
            maximumValue={device.tipo === 'LUZ' ? 5 : 100}
            step={1}
            minimumTrackTintColor={getColor()}
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor={getColor()}
            style={styles.slider}
          />

          <Text style={styles.valueText}>
            {device.tipo === 'LUZ' 
              ? `Nivel ${device.intensidad || 1}/5` 
              : `${device.velocidad || 0}%`
            }
          </Text>
        </View>
      )}

      {/* Botón de eliminación */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteText}>ELIMINAR DISPOSITIVO</Text>
      </TouchableOpacity>

      {/* Modal para selección de ubicación */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar ubicación</Text>
            <ScrollView>
              {ubicaciones.map((ubicacion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    tempLocation === ubicacion && styles.locationItemSelected
                  ]}
                  onPress={() => selectLocation(ubicacion)}
                >
                  <Text style={tempLocation === ubicacion ? styles.locationTextSelected : styles.locationTextItem}>
                    {ubicacion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  editContainer: {
    flex: 1,
    marginRight: 10
  },
  editFields: {
    marginBottom: 25
  },
  infoContainer: {
    marginBottom: 25
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#2196F3',
    paddingVertical: 5
  },
  editButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5
  },
  editText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333'
  },
  label: {
    marginTop: 10,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  radioOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
    alignItems: 'center'
  },
  radioOptionSelected: {
    backgroundColor: '#2196F3'
  },
  radioText: {
    color: '#333'
  },
  radioTextSelected: {
    color: 'white',
    fontWeight: 'bold'
  },
  locationSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  locationText: {
    color: '#333',
    fontSize: 16
  },
  dropdownIcon: {
    color: '#666',
    fontSize: 12
  },
  powerButton: {
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  powerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  controlPanel: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  controlTitle: {
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18
  },
  slider: {
    width: '100%',
    height: 40
  },
  valueText: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    color: '#424242',
    fontSize: 16
  },
  deleteButton: {
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F44336',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  // Estilos para el modal de ubicación
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '70%',
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#333'
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  locationItemSelected: {
    backgroundColor: '#e3f2fd'
  },
  locationTextItem: {
    fontSize: 16,
    color: '#333'
  },
  locationTextSelected: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold'
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  modalCloseText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default DeviceDetail;