import express from 'express';
import { config } from 'dotenv';

import indexRoutes from './routes/index.js';
import userRoutes from './routes/users.js';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import customSQLqueryRoutes from './routes/custom-sql-query.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/listings', listingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/custom-sql-query', customSQLqueryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;