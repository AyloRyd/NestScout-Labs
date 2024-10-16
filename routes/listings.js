import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [listings] = await pool.query('SELECT * FROM Listings');
        res.render('partials/listings', { listings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching listings');
    }
});

router.get('/adding-form', (req, res) => {
    res.render('partials/listings_form');
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

export default router;