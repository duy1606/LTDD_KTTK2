import * as SQLite from 'expo-sqlite';

// Mở DB Sync
export const db = SQLite.openDatabaseSync('todos.db');

// Khởi tạo DB + Tạo bảng + Seed nhẹ (nếu rỗng)
export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER DEFAULT 0,
      created_at INTEGER
    );
  `);

  const countRes = db.getAllSync<{ c: number }>(`SELECT COUNT(*) AS c FROM todos;`);
  const count = countRes[0]?.c ?? 0;

  if (count === 0) {
    const now = Date.now();
    db.runSync(
      `INSERT INTO todos (title, done, created_at)
       VALUES (?, ?, ?), (?, ?, ?)`,
      [
        'Todo mẫu 1', 0, now,
        'Todo mẫu 2', 1, now - 3600000
      ]
    );
    console.log('[DB] Seeded 2 sample todos ✅');
  }

  console.log('[DB] initDB OK ✅');
}

// ✅ GET ALL
export function getAllTodos() {
  return db.getAllSync(`
    SELECT * FROM todos ORDER BY id DESC;
  `);
}

// ✅ GET BY ID
export function getTodoById(id: number) {
  return db.getFirstSync(
    `SELECT * FROM todos WHERE id = ?`,
    [id]
  );
}

// ✅ INSERT
export function insertTodo(title: string) {
  return db.runSync(
    `INSERT INTO todos (title, done, created_at)
     VALUES (?, 0, strftime('%s','now') * 1000)`,
    [title]
  );
}

// ✅ UPDATE
export function updateTodo(
  id: number,
  title: string,
  done: number
) {
  return db.runSync(
    `UPDATE todos SET title = ?, done = ? WHERE id = ?`,
    [title, done, id]
  );
}

// ✅ DELETE thật sự (không soft delete)
export function deleteTodo(id: number) {
  return db.runSync(
    `DELETE FROM todos WHERE id = ?`,
    [id]
  );
}
export function toggleDone(id: number, current: number) {
  return db.runSync(
    `UPDATE todos SET done = ? WHERE id = ?`,
    [current === 1 ? 0 : 1, id]
  );
}
export function updateTodoTitle(id: number, title: string) {
  return db.runSync(
    `UPDATE todos SET title = ? WHERE id = ?`,
    [title, id]
  );
}