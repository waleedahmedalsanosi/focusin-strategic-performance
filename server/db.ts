/**
 * db.ts – SQLite database connection and schema initialisation.
 *
 * Uses better-sqlite3 for synchronous, zero-config SQLite access.
 * The database file is stored at /data/focusin.db (relative to the project root).
 * The /data directory is created automatically if it does not exist.
 *
 * Pragmas applied:
 *  - WAL mode     → faster concurrent reads, safer writes
 *  - Foreign keys → enforces referential integrity (CASCADE deletes)
 *
 * Schema overview:
 *  users        – registered accounts (email + hashed password)
 *  sessions     – active session tokens (FK → users, CASCADE delete on logout)
 *  kpis         – Key Performance Indicators per user
 *  bsc_items    – Balanced Scorecard items (stored flat, grouped by perspective in the frontend)
 *  initiatives  – strategic initiatives with progress/budget tracking
 *  strategies   – high-level strategic plans
 *  departments  – org chart nodes (self-referential tree via parent_id)
 */

import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the SQLite database file. */
const DB_PATH = join(__dirname, '..', 'data', 'focusin.db');

// Ensure the /data directory exists before opening the database.
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables if they don't already exist (safe to run on every startup).
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Sessions store opaque UUID tokens; deleted automatically when the user is deleted.
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS kpis (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    objective TEXT NOT NULL,
    target REAL NOT NULL,
    baseline REAL NOT NULL,
    actual REAL NOT NULL,
    unit TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- perspective values: 'financial' | 'customer' | 'internal' | 'learning'
  CREATE TABLE IF NOT EXISTS bsc_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    perspective TEXT NOT NULL,
    objective TEXT NOT NULL,
    kpi TEXT NOT NULL,
    target TEXT NOT NULL,
    actual TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'On Track',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS initiatives (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    budget TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS strategies (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    period TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    pillars INTEGER NOT NULL DEFAULT 0,
    objectives INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- parent_id is NULL for root-level departments.
  CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    head TEXT NOT NULL,
    parent_id TEXT,
    members INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
