import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TodoContext } from '@/services/TodoContext';

const TodoDetailsScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const [todoName, setTodoName] = useState('');
  const [todoCompleted, setTodoCompleted] = useState(false);

  const { updateTodo, todos, fetchTodo, fetchTodos } = useContext(TodoContext);

  useEffect(() => {
    const fetchDetails = async () => {
      await fetchTodo(id);
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const todo = todos.find((t) => t._id === id);
    if (todo) {
      setTodoName(todo.name);
      setTodoCompleted(todo.isCompleted);
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!todoName.trim()) {
      return;
    }
    await updateTodo(id, todoName, todoCompleted);
    console.log('object1');
    if (route.params?.onGoBack) {
      route.params.onGoBack();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={todoName}
        onChangeText={setTodoName}
        style={styles.input}
        placeholderTextColor='#aaa'
        placeholder='Update Todo Name'
      />
      <TouchableOpacity
        style={[
          styles.button,
          todoCompleted ? { backgroundColor: 'green' } : {},
        ]}
        onPress={() => setTodoCompleted(!todoCompleted)}
      >
        <Text style={styles.buttonText}>
          {todoCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11031D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
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
    color: '#333',
  },
  button: {
    backgroundColor: '#FF6438',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 10,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TodoDetailsScreen;
