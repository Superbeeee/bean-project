import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data.db')

const db = new Database(DB_PATH)

// 啟用 WAL 模式提升效能
db.pragma('journal_mode = WAL')

// 建表（idempotent）
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    photo_url TEXT,
    saved_address TEXT,   -- JSON string
    password_hash TEXT,   -- SHA-256 hex，Email 登入用（Google OAuth 使用者為 NULL）
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,  -- JSON string（完整商品資料）
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL   -- JSON string（多語言 name 物件）
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    data TEXT NOT NULL,  -- JSON string（完整訂單資料）
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,  -- JSON string（完整問卷資料）
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

export default db
