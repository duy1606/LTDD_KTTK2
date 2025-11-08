import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

// ✅ Định nghĩa kiểu Todo
export interface Todo {
  id: number;
  title: string;
  done: number; // 0 hoặc 1
  created_at: number;
}

// ✅ Định nghĩa Props của component
interface TodoItemProps {
  item: Todo;
  onToggle: (item: Todo) => void;
  onEdit: (item: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ item, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onToggle(item)}>
        <Text style={[styles.title, item.done ? styles.done : null]}>
          {item.title}
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(item)}>
          <Text style={styles.edit}>✏️</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(item.id)}>
          <Text style={styles.delete}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  actions: { flexDirection: 'row', gap: 10 },
  edit: { fontSize: 18 },
  delete: { fontSize: 18 },
});
