import Booking from '../models/bookingModel.js';
import pool from '../db.js';

export const BookingsController = {
    async getAll(req, res) {
        try {
            const bookings = await Booking.getAll();
            res.render('partials/tables/bookings', { bookings });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).send('Error fetching bookings');
        }
    },

    async getAddingForm(req, res) {
        const { user_id, listing_id } = req.query;

        try {
            let listings = [];
            let users = [];

            if (!listing_id) {
                [listings] = await pool.query('SELECT id, title FROM Listings');
            }

            if (!user_id) {
                [users] = await pool.query('SELECT id, name FROM Users');
            }

            res.render('partials/adding-forms/bookings_form', { userId: user_id, listingId: listing_id, listings, users });
        } catch (error) {
            console.error('Error fetching data for booking form:', error);
            res.status(500).send('Error fetching data for booking form');
        }
    },

    async getByUser(req, res) {
        const { userId } = req.params;

        try {
            const bookings = await Booking.getByUserId(userId);
            const [user] = await pool.query('SELECT name FROM Users WHERE id = ?', [userId]);

            if (user.length === 0) {
                return res.status(404).send('User not found');
            }

            res.render('partials/tables/bookings', { bookings, userName: user[0].name, userId });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).send('Error fetching bookings');
        }
    },

    async getByListing(req, res) {
        const { listingId } = req.params;

        try {
            const bookings = await Booking.getByListingId(listingId);
            const [listing] = await pool.query('SELECT title FROM Listings WHERE id = ?', [listingId]);

            if (listing.length === 0) {
                return res.status(404).send('Listing not found');
            }

            res.render('partials/tables/bookings', { bookings, listingTitle: listing[0].title, listingId });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).send('Error fetching bookings');
        }
    },

    async create(req, res) {
        const { listing_id, renter_id, check_in, check_out, guest_count } = req.body;

        try {
            const [listing] = await pool.query('SELECT price_per_night, max_guests FROM Listings WHERE id = ?', [listing_id]);
            if (listing.length === 0) return res.status(404).send('Listing not found');

            const { price_per_night, max_guests } = listing[0];
            if (guest_count > max_guests) return res.status(400).send(`Max guests exceeded (${max_guests})`);

            const [user] = await pool.query('SELECT id FROM Users WHERE id = ?', [renter_id]);
            if (user.length === 0) return res.status(404).send('User not found');

            const nights = Math.floor((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
            if (nights <= 0) return res.status(400).send('Invalid date range');

            const totalPrice = nights * price_per_night * guest_count;
            await Booking.create({ listing_id, renter_id, check_in, check_out, guest_count, totalPrice, nights });

            res.status(200).send('Booking added successfully');
        } catch (error) {
            console.error('Error adding booking:', error);
            res.status(500).send('Error adding booking');
        }
    },

    async delete(req, res) {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('No IDs provided');
        }

        try {
            await Booking.delete(ids);
            res.status(200).send('Bookings deleted successfully');
        } catch (error) {
            console.error('Error deleting bookings:', error);
            res.status(500).send('Error deleting bookings');
        }
    },

    async update(req, res) {
        const { id } = req.params;
        const { check_in, check_out, guest_count } = req.body;

        try {
            const booking = await Booking.getById(id);
            if (!booking) return res.status(404).send('Booking not found');

            const [listing] = await pool.query('SELECT price_per_night, max_guests FROM Listings WHERE id = ?', [booking.listing_id]);
            if (!listing) return res.status(404).send('Listing not found');

            const { price_per_night, max_guests } = listing[0];
            if (guest_count > max_guests) return res.status(400).send(`Max guests exceeded (${max_guests})`);

            const nights = Math.floor((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
            if (nights <= 0) return res.status(400).send('Invalid date range');

            if (await Booking.checkOverlapping(id, booking.listing_id, check_in, check_out)) {
                return res.status(400).send('Dates overlap with another booking');
            }

            const totalPrice = nights * price_per_night * guest_count;
            await Booking.update({ id, check_in, check_out, guest_count, nights, totalPrice });

            res.status(200).send('Booking updated successfully');
        } catch (error) {
            console.error('Error updating booking:', error);
            res.status(500).send('Error updating booking');
        }
    }
};