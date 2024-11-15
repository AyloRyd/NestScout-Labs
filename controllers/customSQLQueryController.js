import pool from '../db.js';

export const CustomSQLQueryController = {
    renderForm(req, res) {
        res.render('partials/custom-sql-query');
    },

    async executeQuery(req, res) {
        const query = req.body.query;

        if (!query) {
            return res.status(400).json({ error: 'No SQL query provided' });
        }

        try {
            const [rows] = await pool.query(query);
            const columns = Object.keys(rows[0] || {});
            res.json({ rows, columns });
        } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ error: 'Error executing SQL query' });
        }
    }
};