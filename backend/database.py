"""
SQLite database layer for CarbonLess application.
Handles tables, migrations, and database connection helpers.
"""

import sqlite3
import os
import hashlib
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "carbonless.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        points INTEGER DEFAULT 150,
        streak_days INTEGER DEFAULT 1,
        last_active_date TEXT,
        avatar TEXT DEFAULT 'leaf',
        bio TEXT DEFAULT 'Committed to a greener future.',
        target_reduction_pct INTEGER DEFAULT 25,
        created_at TEXT NOT NULL
    );
    """)

    # Auth Tokens
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS auth_tokens (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Emission calculation records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emission_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        transport_annual REAL NOT NULL,
        energy_annual REAL NOT NULL,
        food_annual REAL NOT NULL,
        waste_annual REAL NOT NULL,
        total_annual REAL NOT NULL,
        inputs_json TEXT NOT NULL,
        calculated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Daily emission & savings log (for historical trend charts)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        transport_kg REAL DEFAULT 0,
        energy_kg REAL DEFAULT 0,
        food_kg REAL DEFAULT 0,
        waste_kg REAL DEFAULT 0,
        total_kg REAL DEFAULT 0,
        savings_kg REAL DEFAULT 0,
        UNIQUE(user_id, date),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # Eco Challenges catalog
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL, -- transport, energy, food, waste, lifestyle
        points INTEGER NOT NULL,
        co2_saved_kg REAL NOT NULL,
        difficulty TEXT NOT NULL, -- Easy, Medium, Hard
        duration TEXT NOT NULL, -- Daily, Weekly
        icon TEXT NOT NULL
    );
    """)

    # User active / completed challenges
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        status TEXT NOT NULL, -- 'in_progress', 'completed'
        joined_at TEXT NOT NULL,
        completed_at TEXT,
        UNIQUE(user_id, challenge_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
    );
    """)

    # Badges catalog
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        category TEXT NOT NULL,
        points_required INTEGER DEFAULT 0,
        tier TEXT DEFAULT 'Bronze' -- Bronze, Silver, Gold, Emerald
    );
    """)

    # User unlocked badges
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        unlocked_at TEXT NOT NULL,
        UNIQUE(user_id, badge_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(badge_id) REFERENCES badges(id) ON DELETE CASCADE
    );
    """)

    # User personalized recommendation actions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS adopted_recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        rec_id TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        annual_co2_saving_kg REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'active', -- active, implemented
        adopted_at TEXT NOT NULL,
        UNIQUE(user_id, rec_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    salt = "carbonless_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
