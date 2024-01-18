import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/components/Navigation';
import { AuthProvider } from '@/services/AuthContext';
import Toast from 'react-native-toast-message';
import { TodoProvider } from '@/services/TodoContext';

export default function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <StatusBar backgroundColor='#06bcee' />
        <Navigation />
      </TodoProvider>
      <Toast />
    </AuthProvider>
  );
}
