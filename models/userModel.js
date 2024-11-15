import pool from '../db.js';

class User {
    static async getAll() {
        const [users] = await pool.query('SELECT * FROM Users');
        return users;
    }

    static async getById(userId) {
        const [user] = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
        return user.length ? user[0] : null;
    }

    static async create({ name, email, passwordHash }) {
        await pool.query('INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
    }

    static async update({ id, name, email, passwordHash }) {
        if (passwordHash) {
            await pool.query(
                `UPDATE Users SET name = ?, email = ?, password_hash = ? WHERE id = ?`,
                [name, email, passwordHash, id]
            );
        } else {
            await pool.query(
                `UPDATE Users SET name = ?, email = ? WHERE id = ?`,
                [name, email, id]
            );
        }
    }

    static async delete(ids) {
        const placeholders = ids.map(() => '?').join(',');
        const query = `DELETE FROM Users WHERE id IN (${placeholders})`;
        await pool.query(query, ids);
    }
}

export default User;