import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, 
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Home = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Obtener dispositivos de Firebase
  useEffect(() => {
    const q = query(collection(db, 'dispositivos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const devicesList = [];
      querySnapshot.forEach((doc) => {
        devicesList.push({ id: doc.id, ...doc.data() });
      });
      setDevices(devicesList);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // La actualización se manejará automáticamente por el onSnapshot
  };

  const navigateToAddDevice = () => {
    navigation.navigate('AddDevice');
  };

  const navigateToDetail = (device) => {
    navigation.navigate('DeviceDetail', { device });
  };

  const getDeviceIcon = (type) => {
    return type === 'LUZ' ? 'lightbulb' : 'ac-unit';
  };

  const getStatusColor = (status) => {
    return status === 'ON' ? '#4CAF50' : '#F44336';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.deviceCard}
      onPress={() => navigateToDetail(item)}
    >
      <View style={styles.deviceHeader}>
        <Icon 
          name={getDeviceIcon(item.tipo)} 
          size={24} 
          color={item.estado === 'ON' ? '#FFC107' : '#9E9E9E'} 
        />
        <Text style={styles.deviceName}>{item.nombre}</Text>
      </View>
      
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceLocation}>{item.ubicacion}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>
      
      {item.estado === 'ON' && (
        <View style={styles.deviceStats}>
          <Text style={styles.statText}>
            {item.tipo === 'LUZ' 
              ? `Intensidad: ${item.intensidad || 1}/5`
              : `Velocidad: ${item.velocidad || 0}%`
            }
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Dispositivos</Text>
        <TouchableOpacity onPress={navigateToAddDevice}>
          <Icon name="add-circle" size={32} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {devices.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="devices" size={50} color="#BDBDBD" />
          <Text style={styles.emptyText}>No hay dispositivos</Text>
          <Text style={styles.emptySubtext}>Presiona el botón + para agregar uno</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  deviceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  deviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deviceLocation: {
    color: '#666',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deviceStats: {
    marginTop: 5,
  },
  statText: {
    color: '#555',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    marginTop: 5,
  },
});

export default Home;