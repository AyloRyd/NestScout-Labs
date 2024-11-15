import pool from '../db.js';

class Booking {
    static async getAll() {
        const [bookings] = await pool.query('SELECT * FROM Bookings');
        return bookings;
    }

    static async getById(id) {
        const [booking] = await pool.query('SELECT * FROM Bookings WHERE id = ?', [id]);
        return booking.length ? booking[0] : null;
    }

    static async getByUserId(userId) {
        const [bookings] = await pool.query('SELECT * FROM Bookings WHERE renter_id = ?', [userId]);
        return bookings;
    }

    static async getByListingId(listingId) {
        const [bookings] = await pool.query('SELECT * FROM Bookings WHERE listing_id = ?', [listingId]);
        return bookings;
    }

    static async create(data) {
        const {
            listing_id, renter_id, check_in, check_out, guest_count, totalPrice, nights
        } = data;

        await pool.query(
            `INSERT INTO Bookings (listing_id, renter_id, check_in, check_out, guest_count, total_price, nights)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [listing_id, renter_id, check_in, check_out, guest_count, totalPrice, nights]
        );
    }

    static async update(data) {
        const { id, check_in, check_out, guest_count, nights, totalPrice } = data;

        await pool.query(
            `UPDATE Bookings 
             SET check_in = ?, check_out = ?, guest_count = ?, nights = ?, total_price = ?
             WHERE id = ?`,
            [check_in, check_out, guest_count, nights, totalPrice, id]
        );
    }

    static async delete(ids) {
        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`DELETE FROM Bookings WHERE id IN (${placeholders})`, ids);
    }

    static async checkOverlapping(id, listing_id, check_in, check_out) {
        const [overlappingBookings] = await pool.query(
            `SELECT * FROM Bookings 
             WHERE listing_id = ? 
             AND id != ? 
             AND ((check_in <= ? AND check_out >= ?) 
             OR (check_in <= ? AND check_out >= ?))`,
            [listing_id, id, check_out, check_in, check_in, check_out]
        );

        return overlappingBookings.length > 0;
    }
}

export default Booking;