import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';
import Toast from 'react-native-toast-message';

export type Todo = {
  id: string;
  name: string;
  isCompleted: boolean;
  user: string;
};

type TodoContextState = {
  todos: Todo[];
  fetchTodos: () => Promise<Todo[]>;
  createTodo: (name: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, name: string, isCompleted: boolean) => Promise<void>;
  deleteTodo: (id: string) => void;
  fetchCompletedTodos: () => Promise<Todo[]>;
  fetchInCompletedTodos: () => Promise<Todo[]>;
  fetchTodo: (id: string) => Promise<void>;
};

export const TodoContext = createContext<TodoContextState>({
  todos: [],
  fetchTodos: () => Promise.resolve([]),
  createTodo: () => Promise.resolve(),
  toggleTodo: () => Promise.resolve(),
  updateTodo: () => Promise.resolve(),
  deleteTodo: () => {},
  fetchCompletedTodos: () => Promise.resolve([]),
  fetchInCompletedTodos: () => Promise.resolve([]),
  fetchTodo: () => Promise.resolve(),
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async (): Promise<Todo[]> => {
    console.log('object3');
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        console.log('4');
        const { token } = JSON.parse(userInfo);
        const response = await axios.get(`${BASE_URL}/todo/find/all`, {
          headers: { Authorization: token },
        });
        setTodos(response.data);
        return response.data;
      }
      return [];
    } catch (error: any) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Fetching Todos Failed',
        text2: error.response.data.message || 'An error occurred',
        visibilityTime: 4000,
      });
    }
    return [];
  };
  const fetchTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const { token } = JSON.parse(userInfo);
          const response = await axios.get(`${BASE_URL}/todo/get/${id}`, {
            headers: { Authorization: token },
          });
          setTodos(todos.map((t) => (t.id === id ? response.data : t)));
        }
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'fetching Todo Failed',
        text2: error.response.data.message || 'An error occurred',
      });
    }
  };
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const { token } = JSON.parse(userInfo);
          const response = await axios.put(
            `${BASE_URL}/todo/toggle/${id}`,
            { isCompleted: !todo.isCompleted },
            { headers: { Authorization: token } }
          );
          setTodos(todos.map((t) => (t.id === id ? response.data : t)));
        }
        fetchTodos();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Toggling Todo Failed',
        text2: error.response.data.message || 'An error occurred',
      });
    }
  };

  const fetchCompletedTodos = async (): Promise<Todo[]> => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get(`${BASE_URL}/todo/completed/all`, {
          headers: { Authorization: token },
        });
        setTodos(response.data);
        return response.data;
      }
      return [];
    } catch (error: any) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Fetching completed Todos Failed',
        text2: error.response.data.message || 'An error occurred',
        visibilityTime: 4000,
      });
    }
    return [];
  };

  const fetchInCompletedTodos = async (): Promise<Todo[]> => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.get(`${BASE_URL}/todo/incompleted/all`, {
          headers: { Authorization: token },
        });
        setTodos(response.data);
        return response.data;
      }
      return [];
    } catch (error: any) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Fetching incompleted Todos Failed',
        text2: error.response.data.message || 'An error occurred',
        visibilityTime: 4000,
      });
    }
    return [];
  };
  const createTodo = async (name: string) => {
    if (!name.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Todo cannot be empty',
      });
      return;
    }

    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.post(
          `${BASE_URL}/todo/create`,
          { name },
          { headers: { Authorization: `${token}` } }
        );
        setTodos((prevTodos) => [...prevTodos, response.data]);
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        Toast.show({
          type: 'info',
          text1: 'Adding Todo Failed',
          text2: 'You have that Todo Already',
          visibilityTime: 3000,
        });
      }
    }
  };

  const updateTodo = async (id: string, name: string, isCompleted: boolean) => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        const response = await axios.put(
          `${BASE_URL}/todo/update/${id}`,
          { name, isCompleted },
          { headers: { Authorization: token } }
        );
        setTodos((currentTodos) =>
          currentTodos.map((t) => (t.id === id ? response.data : t))
        );
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        Toast.show({
          type: 'info',
          text1: 'Updating Todo Failed',
          text2: 'You have Todo with that Name',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Updating Todo Failed',
          text2: 'An error occurred',
        });
      }
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        await axios.delete(`${BASE_URL}/todo/delete/${id}`, {
          headers: { Authorization: token },
        });
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Deleting Todo Failed',
        text2: error.response.data.message || 'An error occurred',
      });
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        fetchTodos,
        createTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        fetchCompletedTodos,
        fetchInCompletedTodos,
        fetchTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
