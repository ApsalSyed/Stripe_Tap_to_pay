import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TapToPayScreen from './src/screens/TapToPayScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tap to Pay" component={TapToPayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
