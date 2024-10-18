import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/adding-form', (req, res) => {
    res.render('partials/listings_form');
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

router.post('/', async (req, res) => {
    const {
        owner_id, title, description,
        price_per_night, country, city,
        street, house_number, property_type,
        rooms, area, has_bathroom,
        has_wifi, has_kitchen, max_guests
    } = req.body;

    try {
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
                has_bathroom === 'false',
                has_wifi === 'false',
                has_kitchen === 'false',
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

export default router;