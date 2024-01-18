import React, { useContext, FC } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../services/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

type LoginScreenNavigationProp = NativeStackNavigationProp<any, 'LoginScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen: FC<Props> = ({ navigation }) => {
  const { isLoading, login } = useContext(AuthContext);
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Login Error',
        text2: error.message,
        visibilityTime: 4000,
      });
    }
  };
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleLogin(values.email, values.password);
        setSubmitting(false);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={styles.wrapper}>
            <TextInput
              style={styles.input}
              value={values.email}
              placeholder='Enter email'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              value={values.password}
              placeholder='Enter password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Button title='Login' onPress={() => handleSubmit()} />

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'blue',
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  // ... any other styles you have
});

export default LoginScreen;
