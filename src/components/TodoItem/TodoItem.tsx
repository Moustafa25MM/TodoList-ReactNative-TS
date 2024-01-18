import { Todo } from '@/services/TodoContext';
import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TodoDetailsNavigationProp = NativeStackNavigationProp<any, 'TodoDetails'>;
type TodoItemProps = {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, name: string, isCompleted: boolean) => Promise<void>;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
}) => {
  const navigation = useNavigation<TodoDetailsNavigationProp>();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handlePress = () => {
    navigation.navigate('TodoDetails', { id: todo._id });
  };
  const handleDeleteTodo = () => {
    deleteTodo(todo._id);
    setDeleteModalVisible(false);
  };

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={handlePress} style={{ flex: 1 }}>
        <Text
          style={[styles.todoText, todo?.isCompleted && styles.todoCompleted]}
        >
          {todo?.name}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <Button title='Toggle' onPress={() => toggleTodo(todo._id)} />
        <Button
          title='Delete'
          onPress={() => setDeleteModalVisible(true)}
          color='red'
        />
      </View>
      <Modal
        visible={deleteModalVisible}
        animationType='fade'
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              Are you sure you want to delete this todo?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%', // Width should be 100% of the modalView
              }}
            >
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteTodo}
              >
                <Text style={{ fontSize: 15, color: '#fff' }}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={{ fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
  },
  confirmButton: {
    backgroundColor: '#FF6438',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 50,
  },
});

export default TodoItem;
