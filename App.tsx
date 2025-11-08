import { useEffect } from 'react';
import { initDB, getAllTodos } from './db';
import { SafeAreaView, Text } from 'react-native';

export default function App() {
  useEffect(() => {
    initDB();
    const todos = getAllTodos();
    console.log('Todos:', todos);
  }, []);

  return (
    <SafeAreaView>
      <Text>Todo Notes DB Initialized ✅</Text>
    </SafeAreaView>
  );
}
