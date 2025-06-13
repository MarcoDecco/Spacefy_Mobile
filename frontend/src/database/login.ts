import { db } from './db';

export function saveLogin(userId: string, token: string) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO login (user_id, token) VALUES (?, ?);',
      [userId, token]
    );
  });
}

export function getLogin(callback: (login: { user_id: string, token: string } | null) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM login ORDER BY id DESC LIMIT 1;',
      [],
      (_, { rows }) => callback(rows.length ? rows._array[0] : null)
    );
  });
}

export function clearLogin() {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM login;');
  });
}