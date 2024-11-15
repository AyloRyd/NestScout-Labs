import express from 'express';
import { BookingsController } from '../controllers/bookingsController.js';

const router = express.Router();

router.get('/', BookingsController.getAll);
router.get('/adding-form', BookingsController.getAddingForm);
router.get('/user/:userId', BookingsController.getByUser);
router.get('/listing/:listingId', BookingsController.getByListing);
router.post('/', BookingsController.create);
router.post('/delete', BookingsController.delete);
router.post('/:id/update', BookingsController.update);

export default router;

// import express from 'express';
// import pool from '../db.js';
//
// const router = express.Router();
//
// router.get('/', async (req, res) => {
//     try {
//         const [bookings] = await pool.query('SELECT * FROM Bookings');
//         res.render('partials/tables/bookings', { bookings });
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).send('Error fetching bookings');
//     }
// });
//
// router.get('/adding-form', async (req, res) => {
//     const userId = req.query.user_id;
//     const listingId = req.query.listing_id;
//
//     try {
//         let listings = [];
//         let users = [];
//
//         if (!listingId) {
//             [listings] = await pool.query('SELECT id, title FROM Listings');
//         }
//
//         if (!userId) {
//             [users] = await pool.query('SELECT id, name FROM Users');
//         }
//
//         res.render('partials/adding-forms/bookings_form', { userId, listingId, listings, users });
//     } catch (error) {
//         console.error('Error fetching data for booking form:', error);
//         res.status(500).send('Error fetching data for booking form');
//     }
// });
//
// router.get('/user/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const [bookings] = await pool.query('SELECT * FROM Bookings WHERE renter_id = ?', [userId]);
//         const [user] = await pool.query('SELECT name FROM Users WHERE id = ?', [userId]);
//
//         if (user.length === 0) {
//             return res.status(404).send('User not found');
//         }
//
//         const userName = user[0].name;
//         res.render('partials/tables/bookings', { bookings, userName, userId });
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).send('Error fetching bookings');
//     }
// });
//
// router.get('/listing/:listingId', async (req, res) => {
//     const listingId = req.params.listingId;
//     try {
//         const [bookings] = await pool.query('SELECT * FROM Bookings WHERE listing_id = ?', [listingId]);
//         const [listing] = await pool.query('SELECT title FROM Listings WHERE id = ?', [listingId]);
//
//         if (listing.length === 0) {
//             return res.status(404).send('Listing not found');
//         }
//
//         const listingTitle = listing[0].title;
//         res.render('partials/tables/bookings', { bookings, listingTitle, listingId });
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).send('Error fetching bookings');
//     }
// });
//
// router.post('/', async (req, res) => {
//     const { listing_id, renter_id, check_in, check_out, guest_count } = req.body;
//
//     try {
//         const [listing] = await pool.query(
//             'SELECT price_per_night, max_guests FROM Listings WHERE id = ?',
//             [listing_id]
//         );
//
//         if (listing.length === 0) {
//             return res.status(404).send('Listing not found');
//         }
//
//         const pricePerNight = listing[0].price_per_night;
//         const maxGuests = listing[0].max_guests;
//
//         if (guest_count > maxGuests) {
//             return res.status(400).send(`Guest count exceeds maximum allowed (${maxGuests} guests)`);
//         }
//
//         const [user] = await pool.query('SELECT id FROM Users WHERE id = ?', [renter_id]);
//         if (user.length === 0) {
//             return res.status(404).send('User not found');
//         }
//
//         const nights = Math.floor((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
//
//         if (nights <= 0) {
//             return res.status(400).send('Check-out date must be after check-in date');
//         }
//
//         const totalPrice = nights * pricePerNight * guest_count;
//         await pool.query(
//             `INSERT INTO Bookings (listing_id, renter_id, check_in, check_out, guest_count, total_price, nights)
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [listing_id, renter_id, check_in, check_out, guest_count, totalPrice, nights]
//         );
//
//         res.status(200).send('Booking added successfully');
//     } catch (error) {
//         console.error('Error adding booking:', error);
//         res.status(500).send('Error adding booking');
//     }
// });
//
// router.post('/delete', async (req, res) => {
//     const { ids } = req.body;
//     console.log('Received IDs for deletion:', ids);
//
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//         return res.status(400).send('No IDs provided');
//     }
//
//     try {
//         const placeholders = ids.map(() => '?').join(',');
//         const query = `DELETE FROM Bookings WHERE id IN (${placeholders})`;
//
//         await pool.query(query, ids);
//         res.status(200).send('Bookings deleted successfully');
//     } catch (error) {
//         console.error('Error deleting bookings:', error);
//         res.status(500).send('Error deleting bookings');
//     }
// });
//
// router.get('/edit-form/:id', async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         const [booking] = await pool.query('SELECT * FROM Bookings WHERE id = ?', [id]);
//         if (booking.length === 0) {
//             return res.status(404).send('Booking not found');
//         }
//
//         res.render('partials/editing-forms/bookings_edit_form', { booking: booking[0] });
//     } catch (error) {
//         console.error('Error fetching booking for edit:', error);
//         res.status(500).send('Error fetching booking for edit');
//     }
// });
//
// router.post('/:id/update', async (req, res) => {
//     const { id } = req.params;
//     const { check_in, check_out, guest_count } = req.body;
//
//     try {
//         const [booking] = await pool.query(
//             'SELECT listing_id FROM Bookings WHERE id = ?',
//             [id]
//         );
//
//         if (booking.length === 0) {
//             return res.status(404).send('Booking not found');
//         }
//
//         const listing_id = booking[0].listing_id;
//
//         const [listing] = await pool.query(
//             'SELECT price_per_night, max_guests FROM Listings WHERE id = ?',
//             [listing_id]
//         );
//
//         if (listing.length === 0) {
//             return res.status(404).send('Listing not found');
//         }
//
//         const pricePerNight = listing[0].price_per_night;
//         const maxGuests = listing[0].max_guests;
//
//         if (guest_count > maxGuests) {
//             return res.status(400).send(`Guest count exceeds the maximum allowed guests (${maxGuests})`);
//         }
//
//         const nights = Math.floor((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
//
//         if (nights <= 0) {
//             return res.status(400).send('Check-out date must be after check-in date');
//         }
//
//         const [overlappingBookings] = await pool.query(
//             `SELECT * FROM Bookings
//              WHERE listing_id = ?
//              AND id != ?
//              AND ((check_in <= ? AND check_out >= ?)
//              OR (check_in <= ? AND check_out >= ?))`,
//             [listing_id, id, check_out, check_in, check_in, check_out]
//         );
//
//         if (overlappingBookings.length > 0) {
//             return res.status(400).send('The listing is already booked for the selected dates');
//         }
//
//         const totalPrice = nights * pricePerNight * guest_count;
//
//         await pool.query(
//             `UPDATE Bookings
//              SET check_in = ?, check_out = ?, guest_count = ?, nights = ?, total_price = ?
//              WHERE id = ?`,
//             [check_in, check_out, guest_count, nights, totalPrice, id]
//         );
//
//         res.status(200).send('Booking updated successfully');
//     } catch (error) {
//         console.error('Error updating booking:', error);
//         res.status(500).send('Error updating booking');
//     }
// });
//
// export default router;