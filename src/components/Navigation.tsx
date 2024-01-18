import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthContext } from '../services/AuthContext';
import LoginScreen from '@/screens/LoginScreen';
import HomeScreen from '@/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          <Stack.Screen name='Home' component={HomeScreen} />

          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Register'
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
