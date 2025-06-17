import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import AddDevice from '../screens/AddDevice';
import DeviceDetail from '../screens/DeviceDetail';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ title: 'Dispositivos del Hogar' }} 
      />
      <Stack.Screen 
        name="AddDevice" 
        component={AddDevice} 
        options={{ title: 'Agregar Dispositivo' }} 
      />
      <Stack.Screen 
        name="DeviceDetail" 
        component={DeviceDetail} 
        options={{ title: 'Control de Dispositivo' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;