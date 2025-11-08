// hooks/useTodos.ts
import { useState, useEffect, useCallback } from "react";
import * as db from "../../db";
import { Alert } from "react-native";

export interface Todo {
  id: number;
  title: string;
  done: number;
  created_at: number;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /** 📌 Load list */
  const loadTodos = useCallback(() => {
    const results:any[] = db.getAllTodos();
    setTodos(results);
  }, []);

  /** ✅ Insert Todo */
  const addTodo = useCallback((title: string) => {
    if (!title.trim()) return;
    db.insertTodo(title);
    loadTodos();
  }, [loadTodos]);

  /** ✅ Toggle Done */
  const toggleTodo = useCallback((id: number, done: number) => {
    db.toggleDone(id, done);
    loadTodos();
  }, [loadTodos]);

  /** ✅ Delete */
  const deleteTodo = useCallback((id: number) => {
    db.deleteTodo(id);
    loadTodos();
  }, [loadTodos]);

  /** ✅ Search realtime */
  const search = useCallback((text: string) => {
    if (!text.trim()) {
      loadTodos();
      return;
    }
   const result:any[] = db.getAllTodos().filter((t: any) =>
  (t.title ?? "").toLowerCase().includes((text ?? "").toLowerCase())
);
    setTodos(result);
  }, [loadTodos]);

  /** ✅ Import API */
  const syncAPI = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch("https://68d5e8bfe29051d1c0afee26.mockapi.io/api/todo");
      if (!res.ok) throw new Error("Fetch API thất bại");

      const data = await res.json() as any[];
      let inserted = 0;

      data.forEach(item => {
        if (!db.findTodoByTitle(item.title)) {
          db.insertFromAPI(item.title, item.completed);
          inserted++;
        }
      });

      Alert.alert("✅ Đồng bộ xong", `Đã thêm ${inserted} mục mới`);
      loadTodos();

    } catch (err: any) {
      Alert.alert("❌ Lỗi đồng bộ", err.message ?? "Unknown");
    } finally {
      setLoading(false);
    }
  }, [loadTodos]);

  /** ✅ Pull-to-refresh */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadTodos();
      setRefreshing(false);
    }, 300);
  }, [loadTodos]);
  /** ✅ Update Todo */
const updateTodo = useCallback((id: number, newTitle: string) => {
  if (!newTitle.trim()) return;

  db.updateTodoTitle(id, newTitle);
  loadTodos();
}, [loadTodos]);

  /** ✅ Init DB + Load data 1 lần */
  useEffect(() => {
    db.initDB();
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    refreshing,
    addTodo,
    toggleTodo,
    deleteTodo,
    search,
    syncAPI,
    updateTodo,
    onRefresh,
  };
}
