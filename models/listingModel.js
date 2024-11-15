import pool from '../db.js';

class Listing {
    static async getAll() {
        const [listings] = await pool.query('SELECT * FROM Listings');
        return listings;
    }

    static async getById(listingId) {
        const [listing] = await pool.query('SELECT * FROM Listings WHERE id = ?', [listingId]);
        return listing.length ? listing[0] : null;
    }

    static async getByUserId(userId) {
        const [listings] = await pool.query('SELECT * FROM Listings WHERE owner_id = ?', [userId]);
        return listings;
    }

    static async create(data) {
        const {
            owner_id, title, description,
            price_per_night, country, city,
            street, house_number, property_type,
            rooms, area, has_bathroom,
            has_wifi, has_kitchen, max_guests
        } = data;

        await pool.query(
            `INSERT INTO Listings (owner_id, title, description, price_per_night, country, city,
                                   street, house_number, property_type, rooms, area, 
                                   has_bathroom, has_wifi, has_kitchen, max_guests) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                owner_id, title, description,
                price_per_night, country, city,
                street, house_number, property_type,
                rooms, area, has_bathroom, has_wifi, has_kitchen, max_guests
            ]
        );
    }

    static async update(data) {
        const {
            id, title, description, price_per_night,
            property_type, rooms, area,
            has_bathroom, has_wifi, has_kitchen, max_guests
        } = data;

        await pool.query(
            `UPDATE Listings SET title = ?, description = ?, price_per_night = ?, 
                                 property_type = ?, rooms = ?, area = ?, 
                                 has_bathroom = ?, has_wifi = ?, has_kitchen = ?, max_guests = ? 
             WHERE id = ?`,
            [
                title, description, price_per_night,
                property_type, rooms, area,
                has_bathroom, has_wifi, has_kitchen, max_guests, id
            ]
        );
    }

    static async delete(ids) {
        const placeholders = ids.map(() => '?').join(',');
        await pool.query(`DELETE FROM Listings WHERE id IN (${placeholders})`, ids);
    }
}

export default Listing;