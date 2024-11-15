import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const UsersController = {
    async getAddingForm(req, res) {
        res.render('partials/adding-forms/users_form');
    },

    async getAll(req, res) {
        try {
            const users = await User.getAll();
            const userId = req.params.id || null;
            res.render('partials/tables/users', { users, userId });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Error fetching users');
        }
    },

    async create(req, res) {
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name, email, passwordHash: hashedPassword });
            res.status(200).send('User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send('Error adding user');
        }
    },

    async delete(req, res) {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send('No IDs provided');
        }

        try {
            await User.delete(ids);
            res.status(200).send('Items deleted successfully');
        } catch (error) {
            console.error('Error deleting items:', error);
            res.status(500).send('Error deleting items');
        }
    },

    async getEditForm(req, res) {
        const userId = req.params.id;
        try {
            const user = await User.getById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.render('partials/editing-forms/users_edit_form', { user });
        } catch (error) {
            console.error('Error fetching user for edit:', error);
            res.status(500).send('Error loading edit form');
        }
    },

    async update(req, res) {
        const { id, name, email, password } = req.body;

        try {
            const passwordHash = password ? await bcrypt.hash(password, 10) : null;
            await User.update({ id, name, email, passwordHash });
            res.status(200).send('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Error updating user');
        }
    }
};
