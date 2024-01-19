import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '@/services/AuthContext';
import { Todo, TodoContext } from '@/services/TodoContext';
import TodoItem from '@/components/TodoItem/TodoItem';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [todos, setTodos] = useState<Todo[]>([]);

  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const { createTodo, toggleTodo, deleteTodo, fetchTodos, updateTodo } =
    useContext(TodoContext);

  const handleAddTodo = async () => {
    await createTodo(newTodo);
    setNewTodo('');
    const fetchedTodos = await fetchTodos();
    setTodos(fetchedTodos);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTodos = await fetchTodos();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setTodos([]);
      }
    };

    fetchData();
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === 'completed') {
      return todos.filter((todo) => todo.isCompleted);
    } else if (filter === 'inCompleted') {
      return todos.filter((todo) => !todo.isCompleted);
    } else {
      return todos;
    }
  }, [todos, filter]);

  const handleToggleTodo = async (id: string) => {
    await toggleTodo(id);
    const fetchedTodos = await fetchTodos();
    setTodos(fetchedTodos);
  };
  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    const fetchedTodos = await fetchTodos();
    setTodos(fetchedTodos);
  };

  const refreshTodos = async () => {
    const fetchedTodos = await fetchTodos();
    setTodos(fetchedTodos);
  };

  const handleUpdateTodo = async (
    id: string,
    name: string,
    isCompleted: boolean
  ) => {
    await updateTodo(id, name, isCompleted);
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, name, isCompleted } : todo
      )
    );
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.welcome}>Welcome {userInfo.user?.name}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      <View>
        <View
          style={{
            height: 220,
            width: 700,
            marginBottom: 20,
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>My Todo App </Text>
            <Text style={styles.hintText}>
              Tap on a task to view and edit details
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setNewTodo}
              value={newTodo}
              placeholder='Add Task'
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.filterButtonSelected,
              ]}
              onPress={() => setFilter('all')}
            >
              <Text style={styles.filterButtonText}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'inCompleted' && styles.filterButtonSelected,
              ]}
              onPress={() => setFilter('inCompleted')}
            >
              <Text style={styles.filterButtonText}>Active</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'completed' && styles.filterButtonSelected,
              ]}
              onPress={() => setFilter('completed')}
            >
              <Text style={styles.filterButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={filteredTodos}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              toggleTodo={() => handleToggleTodo(item.id)}
              deleteTodo={() => handleDeleteTodo(item.id)}
              updateTodo={() =>
                handleUpdateTodo(item.id, item.name, item.isCompleted)
              }
              refreshTodos={refreshTodos}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>No items to display</Text>
            </View>
          )}
        />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11031D',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    height: 'auto',
  },
  welcome: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  titleContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 10,
  },
  hintText: {
    color: '#FF6430',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  addButton: {
    width: '25%',
    backgroundColor: '#FF6438',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 6,
    marginLeft: 14,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },

  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  filterButtonText: {
    color: '#333',
    fontSize: 16,
  },
  filterButtonSelected: {
    backgroundColor: '#06bcee',
  },

  todoCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
  },
  title: {
    color: '#FF6438',
    fontSize: 50,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
