import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView, Text, FlatList, StyleSheet, View,
  Pressable, Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import {
  initDB, getAllTodos, insertTodo, toggleDone,
  updateTodoTitle, deleteTodo, findTodoByTitle, insertFromAPI
} from './db';

export default function App() {
  const [todos, setTodos] = useState<any[]>([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [editItem, setEditItem] = useState<any | null>(null);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDB();
    loadTodos();
  }, []);

  const loadTodos = useCallback(() => {
    const data = getAllTodos();
    setTodos(data);
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return Alert.alert("Lỗi", "Không được để trống!");
    insertTodo(title);
    setTitle("");
    setModalAdd(false);
    loadTodos();
  };

  const handleToggle = (item: any) => {
    toggleDone(item.id, item.done);
    loadTodos();
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setTitle(item.title);
    setModalEdit(true);
  };

  const handleSaveEdit = () => {
    if (!title.trim()) return Alert.alert("Lỗi", "Không được để trống!");
    updateTodoTitle(editItem.id, title);
    setTitle("");
    setEditItem(null);
    setModalEdit(false);
    loadTodos();
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xóa công việc?", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa", style: "destructive",
        onPress: () => {
          deleteTodo(id);
          loadTodos();
        }
      }
    ]);
  };

  const filteredTodos = useMemo(() => {
    if (!searchText.trim()) return todos;
    return todos.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, todos]);

  // ✅ Sync API đặt nút riêng không chung với Search
  const handleSyncAPI = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://68d5e8bfe29051d1c0afee26.mockapi.io/api/todo");
      if (!res.ok) throw new Error("Fetch thất bại");

      const data: any[] = await res.json();
      let inserted = 0;

      data.forEach(item => {
        if (!findTodoByTitle(item.title)) {
          insertFromAPI(item.title, item.completed);
          inserted++;
        }
      });

      Alert.alert("Đồng bộ thành công ✅", `Đã thêm ${inserted} mục mới`);
      loadTodos();
    } catch (err: any) {
      Alert.alert("Lỗi Sync!", err.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Todo Notes 📌</Text>

      {/* ✅ Search nằm riêng một dòng */}
      <TextInput
        placeholder="Tìm kiếm..."
        style={styles.search}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* ✅ Sync button đặt riêng ở ngoài */}
      <Pressable
        style={[styles.syncBtn, loading && { opacity: 0.5 }]}
        onPress={handleSyncAPI}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Đồng bộ dữ liệu </Text>
        )}
      </Pressable>

      {filteredTodos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Không có dữ liệu</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: any }) => (
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
                <Pressable onPress={() => handleDelete(item.id)}>
                  <Text style={styles.delete}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* ✅ Nút Add vẫn ở góc phải */}
      <Pressable style={styles.addBtn} onPress={() => setModalAdd(true)}>
        <Text style={{ fontSize: 22 }}>＋</Text>
      </Pressable>

      {/* Modal Add */}
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
              <Pressable style={[styles.btn, { backgroundColor: "#ddd" }]}
                onPress={() => setModalAdd(false)}>
                <Text>Hủy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Edit */}
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
              <Pressable style={[styles.btn, { backgroundColor: "#ddd" }]}
                onPress={() => setModalEdit(false)}>
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
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },

  search: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },

  syncBtn: {
    backgroundColor: "#0077b6",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 12,
  },

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
  actions: { flexDirection: "row", gap: 12 },
  edit: { fontSize: 18 },
  delete: { fontSize: 18 },

  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: 'gray' },

  addBtn: {
    position: "absolute",
    bottom: 20, right: 20,
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#90e0ef",
    justifyContent: "center", alignItems: "center"
  },

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
});
