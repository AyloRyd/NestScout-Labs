import express from 'express';
import { CustomSQLQueryController } from '../controllers/customSQLQueryController.js';

const router = express.Router();

router.get('/', CustomSQLQueryController.renderForm);
router.post('/run', CustomSQLQueryController.executeQuery);

export default router;

// import express from 'express';
// import pool from '../db.js';
//
// const router = express.Router();
//
// router.get('/', (req, res) => {
//     res.render('partials/custom-sql-query');
// });
//
// router.post('/run', async (req, res) => {
//     const query = req.body.query;
//
//     if (!query) {
//         return res.status(400).json({ error: 'No SQL query provided' });
//     }
//
//     try {
//         const [rows] = await pool.query(query);
//         const columns = Object.keys(rows[0] || {});
//         res.json({ rows, columns });
//     } catch (error) {
//         console.error('Error executing SQL query:', error);
//         res.status(500).json({ error: 'Error executing SQL query' });
//     }
// });
//
// export default router;