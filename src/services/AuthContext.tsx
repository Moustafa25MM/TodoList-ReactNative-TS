import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { BASE_URL } from './config';
import Toast from 'react-native-toast-message';

type UserInfo = {
  access_token?: string;
};

interface AuthContextProps {
  isLoading: boolean;
  userInfo: UserInfo;
  splashLoading: boolean;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoading: false,
  userInfo: {},
  splashLoading: false,
  register: () => {},
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [splashLoading, setSplashLoading] = useState<boolean>(false);

  const register = (name: string, email: string, password: string) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/create`, { name, email, password })
      .then((res) => {
        let userInfo = res.data as UserInfo;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch((e: any) => {
        if (e.response.status === 409) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Register Error',
            text2: 'Email is already Exist',
            visibilityTime: 4000,
          });
        }
        setIsLoading(false);
      });
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Registered Successfully',
      visibilityTime: 4000,
    });
  };

  const login = (email: string, password: string) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/user/login`, { email, password })
      .then((res) => {
        let userInfo = res.data as UserInfo;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
      })
      .catch((e: any) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login Error',
          text2: 'Invalid Email or Password',
          visibilityTime: 4000,
        });
        setIsLoading(false);
        throw e;
      });
    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Login Successfully',
      visibilityTime: 4000,
    });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .post(
        `${BASE_URL}/logout`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.access_token}` } }
      )
      .then((res) => {
        console.log(res.data);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let storedUserInfo = await AsyncStorage.getItem('userInfo');
      let userInfo = storedUserInfo
        ? (JSON.parse(storedUserInfo) as UserInfo)
        : null;

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
