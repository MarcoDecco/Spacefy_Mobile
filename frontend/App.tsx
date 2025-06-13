import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import NavigationContext from '~/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';

const db = SQLite.openDatabase('app.db');

export default function App() {
useEffect(() => {
    db.transaction(tx => {
      // Tabela de login
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS login (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          token TEXT
        );`
      );
      // Tabela de favoritos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS favoritos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          space_id TEXT,
          user_id TEXT
        );`
      );
      // Tabela de alugados
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS alugados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          space_id TEXT,
          user_id TEXT
        );`
      );
    });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContext />
      </AuthProvider>
    </ThemeProvider>
  );
}