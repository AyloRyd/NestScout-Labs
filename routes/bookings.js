import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [bookings] = await pool.query('SELECT * FROM Bookings');
        res.render('partials/bookings', { bookings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching bookings');
    }
});

router.get('/adding-form', (req, res) => {
    res.render('partials/bookings_form');
});

router.post('/', async (req, res) => {
    const { listing_id, renter_id, check_in, check_out, guest_count } = req.body;

    try {
        const [listing] = await pool.query(
            'SELECT price_per_night FROM Listings WHERE id = ?',
            [listing_id]
        );

        if (listing.length === 0) {
            return res.status(404).send('Listing not found');
        }

        const pricePerNight = listing[0].price_per_night;
        const nights = Math.floor((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            return res.status(400).send('Check-out date must be after check-in date');
        }

        const totalPrice = nights * pricePerNight * guest_count;
        await pool.query(
            `INSERT INTO Bookings (listing_id, renter_id, check_in, check_out, guest_count, total_price) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [listing_id, renter_id, check_in, check_out, guest_count, totalPrice]
        );

        res.status(200).send('Booking added successfully');
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).send('Error adding booking');
    }
});

export default router;