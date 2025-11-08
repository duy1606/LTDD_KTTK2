import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View, Pressable, Modal, TextInput, Alert } from 'react-native';
import { initDB, getAllTodos, insertTodo, toggleDone, updateTodoTitle,deleteTodo } from './db';

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [editItem, setEditItem] = useState<any | null>(null);

  useEffect(() => {
    initDB();
    loadTodos();
  }, []);

  function loadTodos() {
    const data = getAllTodos();
    setTodos(data);
  }

  // ✅ Thêm mới
  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Không được để trống!");
      return;
    }
    insertTodo(title);
    setTitle("");
    setModalAdd(false);
    loadTodos();
  };

  // ✅ Toggle Done
  const handleToggle = (item: any) => {
    toggleDone(item.id, item.done);
    loadTodos();
  };

  // ✅ Mở Modal Edit
  const openEdit = (item: any) => {
    setEditItem(item);
    setTitle(item.title);
    setModalEdit(true);
  };

  // ✅ Lưu Edit
  const handleSaveEdit = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Không được để trống!");
      return;
    }
    updateTodoTitle(editItem.id, title);
    setTitle("");
    setEditItem(null);
    setModalEdit(false);
    loadTodos();
  };

  // ✅ Hàm xóa Todo có xác nhận
const handleDelete = (id: number) => {
  Alert.alert(
    "Xóa công việc?",
    "Bạn có chắc chắn muốn xóa không?",
    [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          deleteTodo(id);
          loadTodos();
        },
      },
    ]
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Todo Notes 📌</Text>

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
    <Pressable onPress={() => handleToggle(item)}>
      <Text style={[styles.title, item.done ? styles.done : null]}>
        {item.title}
      </Text>
    </Pressable>

    <View style={styles.actions}>
      <Pressable onPress={() => openEdit(item)}>
        <Text style={styles.edit}>✏️</Text>
      </Pressable>

      {/* ✅ Nút Delete */}
      <Pressable onPress={() => handleDelete(item.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </Pressable>
    </View>
  </View>
)}

        />
      )}

      {/* ✅ Nút thêm */}
      <Pressable style={styles.addBtn} onPress={() => setModalAdd(true)}>
        <Text style={{ fontSize: 22 }}>＋</Text>
      </Pressable>


      {/* ✅ Modal Thêm mới */}
      <Modal visible={modalAdd} transparent animationType="slide">
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
              <Pressable style={[styles.btn, { backgroundColor: "#ddd" }]} onPress={() => setModalAdd(false)}>
                <Text>Hủy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>


      {/* ✅ Modal Edit */}
      <Modal visible={modalEdit} transparent animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sửa công việc</Text>

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <Pressable style={styles.btn} onPress={handleSaveEdit}>
                <Text>Lưu</Text>
              </Pressable>

              <Pressable style={[styles.btn, { backgroundColor: "#ddd" }]} onPress={() => setModalEdit(false)}>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: 'gray' },
  addBtn: {
    position: "absolute", bottom: 20, right: 20,
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#90e0ef",
    justifyContent: "center", alignItems: "center"
  },
  edit: { fontSize: 18 },
  modalWrap: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center", alignItems: "center"
  },
  modalBox: {
    width: "80%", backgroundColor: "#fff",
    padding: 20, borderRadius: 10, gap: 10
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1, borderColor: "#ccc",
    padding: 10, borderRadius: 5
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    backgroundColor: "#ade8f4",
    padding: 10,
    borderRadius: 6,
    width: "45%",
    alignItems: "center",
  },
  actions: {
  flexDirection: "row",
  gap: 12,
},
delete: {
  fontSize: 18,
}

});
