import React, { useContext } from 'react';
import {
  Button,
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../services/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, 'Name must be at least 5 characters long.')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(5, 'Password must be at least 5 characters long.')
    .required('Password is required'),
});

type RegisterScreenNavigationProp = NativeStackNavigationProp<any, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { isLoading, register } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          register(values.name, values.email, values.password);
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
          <View style={styles.wrapper}>
            <TextInput
              style={styles.input}
              value={values.name}
              placeholder='Enter name'
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              value={values.email}
              placeholder='Enter email'
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.name && errors.email ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              value={values.password}
              placeholder='Enter password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {touched.name && errors.password ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
            <Button
              title='Register'
              onPress={(event: GestureResponderEvent) => handleSubmit()}
            />
          </View>
        )}
      </Formik>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
      <Toast />
    </View>
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
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
