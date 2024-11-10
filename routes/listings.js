import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/adding-form', (req, res) => {
    const userId = req.query.user_id;
    res.render('partials/listings_form', { userId });
});

router.get('/:id?', async (req, res) => {
    const listingId = req.params.id;
    try {
        const [listings] = await pool.query('SELECT * FROM Listings');
        res.render('partials/listings', { listings, listingId });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('Error fetching listings');
    }
});

router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [listings] = await pool.query('SELECT * FROM Listings WHERE owner_id = ?', [userId]);
        const [user] = await pool.query('SELECT name FROM Users WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).send('User not found');
        }

        const userName = user[0].name;
        res.render('partials/listings', { listings, userName, userId });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).send('Error fetching listings');
    }
});

router.post('/', async (req, res) => {
    const {
        owner_id, title, description,
        price_per_night, country, city,
        street, house_number, property_type,
        rooms, area, has_bathroom,
        has_wifi, has_kitchen, max_guests
    } = req.body;

    try {
        const [user] = await pool.query('SELECT id FROM Users WHERE id = ?', [owner_id]);
        if (user.length === 0) {
            return res.status(404).send('User not found');
        }

        await pool.query(
            `INSERT INTO Listings (owner_id, title, description, 
                                   price_per_night, country, city,     
                                   street, house_number, property_type, 
                                   rooms, area, has_bathroom, has_wifi, has_kitchen, max_guests) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                owner_id, title, description,
                price_per_night, country, city,
                street, house_number, property_type,
                rooms, area,
                has_bathroom === 'true',
                has_wifi === 'true',
                has_kitchen === 'true',
                max_guests
            ]
        );

        res.status(200).send('Listing added successfully');
    } catch (error) {
        console.error('Error adding listing:', error);
        res.status(500).send('Error adding listing');
    }
});

router.post('/delete', async (req, res) => {
    const { ids } = req.body;
    console.log('Received IDs for deletion:', ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send('No IDs provided');
    }

    try {
        const placeholders = ids.map(() => '?').join(',');
        const query = `DELETE FROM Listings WHERE id IN (${placeholders})`;

        await pool.query(query, ids);
        res.status(200).send('Listings deleted successfully');
    } catch (error) {
        console.error('Error deleting listings:', error);
        res.status(500).send('Error deleting listings');
    }
});

router.get('/edit-form/:id', async (req, res) => {
    const listingId = req.params.id;

    try {
        const [listingResult] = await pool.query('SELECT * FROM Listings WHERE id = ?', [listingId]);

        if (listingResult.length === 0) {
            return res.status(404).send('Listing not found');
        }

        const listing = listingResult[0];

        res.render('partials/listings_edit_form', { listing });
    } catch (error) {
        console.error('Error fetching listing data:', error);
        res.status(500).send('Error fetching listing data');
    }
});

router.post('/update', async (req, res) => {
    const {
        id, title, description, price_per_night,
        property_type, rooms, area,
        has_bathroom, has_wifi, has_kitchen, max_guests
    } = req.body;

    try {
        await pool.query(
            `UPDATE Listings SET title = ?, description = ?, price_per_night = ?, 
                                 property_type = ?, rooms = ?, area = ?, 
                                 has_bathroom = ?, has_wifi = ?, has_kitchen = ?, max_guests = ? 
             WHERE id = ?`,
            [
                title, description, price_per_night,
                property_type, rooms, area,
                has_bathroom === 'true', has_wifi === 'true', has_kitchen === 'true',
                max_guests, id
            ]
        );

        res.status(200).send('Listing updated successfully');
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).send('Error updating listing');
    }
});

export default router;