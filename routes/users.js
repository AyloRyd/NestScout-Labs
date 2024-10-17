import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();

router.get('/adding-form', (req, res) => {
    res.render('partials/users_form');
});

router.get('/:id?', async (req, res) => {
    const userId = req.params.id;
    try {
        const [users] = await pool.query('SELECT * FROM Users');
        res.render('partials/users', { users, userId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
    }
});

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]);

        res.status(200).send('User added successfully');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
});

router.post('/delete', async (req, res) => {
    const { ids } = req.body;
    console.log('Received IDs:', ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send('No IDs provided');
    }

    try {
        const placeholders = ids.map(() => '?').join(',');
        const query = `DELETE FROM Users WHERE id IN (${placeholders})`;

        await pool.query(query, ids);
        res.status(200).send('Items deleted successfully');
    } catch (error) {
        console.error('Error deleting items:', error);
        res.status(500).send('Error deleting items');
    }
});

export default router;