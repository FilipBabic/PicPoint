import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import TestScreen from './src/screens/TestScreen';
import FoodScreen from './src/screens/FoodScreen';
import FoodDetails from './src/screens/FoodDetails';
import AttractionScreen from './src/screens/AttractionScreen';
import AttractionDetails from './src/screens/AttractionDetails';
import AccommodationScreen from './src/screens/AccommodationsScreen';
import AccommodationDetails from './src/screens/AccommodationDetails';
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
      // screenOptions={{
      //   transitionSpec: {
      //     open: config,
      //     close: config
      //   }
      // }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'PicPoint',
          headerStyle: {
            backgroundColor: '#6A2B90',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

        }} />
        <Stack.Screen name="Information" component={Tabs} options={{
          headerBackTitle: '',
          headerTitle: 'Gallery',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="Details" component={DetailScreen} />
        <Stack.Screen name="FoodDetails" component={FoodDetails} options={{
          headerBackTitle: '',
          headerTitle: 'Details',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="Food" component={FoodScreen} options={{
          headerBackTitle: '',
          headerTitle: 'Food',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="AttractionDetails" component={AttractionDetails} options={{
          headerBackTitle: '',
          headerTitle: 'Details',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="Attraction" component={AttractionScreen} options={{
          headerBackTitle: '',
          headerTitle: 'Attractions',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="AccommodationDetails" component={AccommodationDetails} options={{
          headerBackTitle: '',
          headerTitle: 'Details',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
        <Stack.Screen name="Accommodation" component={AccommodationScreen} options={{
          headerBackTitle: '',
          headerTitle: 'Accommodations',
          headerTitleStyle: {
            fontWeight: '900',
            color: '#393939'
          },
          headerTintColor: '#393939',
        }} />
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
