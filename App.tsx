import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from '@/services/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor='#06bcee' />
      <Navigation />
      <Toast />
    </AuthProvider>
  );
}
