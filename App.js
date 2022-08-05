import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import TestScreen from './src/screens/TestScreen';
import FoodScreen from './src/screens/FoodScreen';
import FoodDetails from './src/screens/FoodDetails';
import InformationScreen from './src/screens/InformationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './src/components/Tabs';

const Stack = createNativeStackNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          transitionSpec: {
            open: config,
            close: config
          }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'New pix',
          headerStyle: {
            backgroundColor: '#162b54',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

        }} />
        <Stack.Screen name="Information" component={Tabs} />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetails} />
        <Stack.Screen name="Food" component={FoodScreen} />
        <Stack.Screen name="TestScreen" component={TestScreen} options={{
          title: 'New pix',
          headerStyle: {
            backgroundColor: '#162b54',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
