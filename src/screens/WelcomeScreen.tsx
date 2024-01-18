import SafeAreaWrapper from '@/components/shared/SafeAreaWrapper';
import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TodoImage =
  'https://res.cloudinary.com/das9oh9bs/image/upload/v1705509830/todo1_zskabc.jpg';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<any, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const navigateToSignUpScreen = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: TodoImage,
              width: 320,
              height: 320,
            }}
          />
        </View>
        <Text style={styles.title}>Do you want to be more productive?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToSignUpScreen}
          >
            <Text style={styles.buttonText}>Start your journey</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>26,698 registered today</Text>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
    color: 'gray',
  },
});

export default WelcomeScreen;
