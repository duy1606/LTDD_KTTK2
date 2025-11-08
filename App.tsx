
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View } from 'react-native';
import { initDB, getAllTodos } from './db';

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    initDB(); // tạo bảng và seed nếu trống
    loadTodos();
  }, []);

  function loadTodos() {
    const data = getAllTodos();
    setTodos(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Todo Notes 📌</Text>

      {/* ✅ Empty State */}
      {todos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Chưa có việc nào</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={[styles.title, item.done ? styles.done : null]}>
                {item.title}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  item: {
    backgroundColor: '#eee',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  title: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: 'gray' },
});
