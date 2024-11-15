import Listing from '../models/listingModel.js';
import pool from '../db.js';

export const ListingsController = {
    async getAddingForm(req, res) {
        const userId = req.query.user_id;
        res.render('partials/adding-forms/listings_form', { userId });
    },

    async getAll(req, res) {
        try {
            const listings = await Listing.getAll();
            const listingId = req.params.id || null;
            res.render('partials/tables/listings', { listings, listingId });
        } catch (error) {
            console.error('Error fetching listings:', error);
            res.status(500).send('Error fetching listings');
        }
    },

    async getByUser(req, res) {
        const userId = req.params.userId;
        try {
            const listings = await Listing.getByUserId(userId);
            const [user] = await pool.query('SELECT name FROM Users WHERE id = ?', [userId]);

            if (user.length === 0) {
                return res.status(404).send('User not found');
            }

            const userName = user[0].name;
            res.render('partials/tables/listings', { listings, userName, userId });
        } catch (error) {
            console.error('Error fetching listings by user:', error);
            res.status(500).send('Error fetching listings by user');
        }
    },

    async create(req, res) {
        const data = req.body;

        try {
            const [user] = await pool.query('SELECT id FROM Users WHERE id = ?', [data.owner_id]);
            if (user.length === 0) {
                return res.status(404).send('User not found');
            }

            await Listing.create({
                ...data,
                has_bathroom: data.has_bathroom === 'true',
                has_wifi: data.has_wifi === 'true',
                has_kitchen: data.has_kitchen === 'true',
            });

            res.status(200).send('Listing added successfully');
        } catch (error) {
            console.error('Error adding listing:', error);
            res.status(500).send('Error adding listing');
        }
    },

    async delete(req, res) {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('No IDs provided');
        }

        try {
            await Listing.delete(ids);
            res.status(200).send('Listings deleted successfully');
        } catch (error) {
            console.error('Error deleting listings:', error);
            res.status(500).send('Error deleting listings');
        }
    },

    async getEditForm(req, res) {
        const listingId = req.params.id;

        try {
            const listing = await Listing.getById(listingId);
            if (!listing) {
                return res.status(404).send('Listing not found');
            }

            res.render('partials/editing-forms/listings_edit_form', { listing });
        } catch (error) {
            console.error('Error fetching listing data:', error);
            res.status(500).send('Error fetching listing data');
        }
    },

    async update(req, res) {
        try {
            await Listing.update({
                ...req.body,
                has_bathroom: req.body.has_bathroom === 'true',
                has_wifi: req.body.has_wifi === 'true',
                has_kitchen: req.body.has_kitchen === 'true',
            });

            res.status(200).send('Listing updated successfully');
        } catch (error) {
            console.error('Error updating listing:', error);
            res.status(500).send('Error updating listing');
        }
    },
};