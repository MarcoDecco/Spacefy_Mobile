import { db } from './db';

export function addRented(spaceId: string, userId: string) {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO rented (space_id, user_id) VALUES (?, ?);', [spaceId, userId]);
  });
}

export function getRented(userId: string, callback: (rented: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM rented WHERE user_id = ?;',
      [userId],
      (_, { rows }) => callback(rows._array)
    );
  });
}