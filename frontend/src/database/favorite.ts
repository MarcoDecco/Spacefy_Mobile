import { db } from './db';

export function addFavorite(spaceId: string, userId: string) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO favorites (space_id, user_id) VALUES (?, ?);', [spaceId, userId]);
  });
}

export function removeFavorite(spaceId: string, userId: string) {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM favorites WHERE space_id = ? AND user_id = ?;', [spaceId, userId]);
  });
}

export function getFavorites(userId: string, callback: (favorites: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM favorites WHERE user_id = ?;',
      [userId],
      (_, { rows }) => callback(rows._array)
    );
  });
}