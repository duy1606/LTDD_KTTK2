import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View, Pressable, Modal, TextInput, Alert } from 'react-native';
import { initDB, getAllTodos, insertTodo } from './db';

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    initDB();
    loadTodos();
  }, []);

  function loadTodos() {
    const data = getAllTodos();
    setTodos(data);
  }

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Không được để trống!");
      return;
    }
    insertTodo(title); // ✅ Insert DB
    setTitle("");
    setModalVisible(false);
    loadTodos(); // ✅ Refresh list
  };

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

      {/* ✅ Nút "+" */}
      <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 22 }}>＋</Text>
      </Pressable>

      {/* ✅ Modal thêm mới */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Thêm việc mới</Text>

            <TextInput
              placeholder="Nhập công việc..."
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <Pressable style={styles.btn} onPress={handleAdd}>
                <Text>Lưu</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: "#ddd" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Hủy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: 'gray' },

  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#90e0ef",
    justifyContent: "center",
    alignItems: "center",
  },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    backgroundColor: "#ade8f4",
    padding: 10,
    borderRadius: 6,
    width: "45%",
    alignItems: "center",
  },
});
