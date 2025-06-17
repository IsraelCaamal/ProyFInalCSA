import Home from './screens/Home';
import AddDevice from './screens/AddDevice';
import DeviceDetail from './screens/DeviceDetail';


<Stack.Navigator initialRouteName="Home">
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="AddDevice" component={AddDevice} />
  <Stack.Screen name="DeviceManager" component={DeviceDetail} />
</Stack.Navigator>
