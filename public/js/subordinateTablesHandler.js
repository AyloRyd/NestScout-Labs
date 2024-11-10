import { loadPartial } from './loadPartial.js';

export const subordinateTablesHandler = () => {
    $(document).on('click', '.filled-button:contains("Listings")', function() {
        const userId = $(this).closest('tr').find('input[name="selectedUsers"]').val();
        const url = `/listings/user/${userId}`;
        loadPartial(url);
    });

    $(document).on('click', '.user-bookings', function() {
        const userId = $(this).closest('tr').find('input[name="selectedUsers"]').val();
        const url = `/bookings/user/${userId}`;
        loadPartial(url);
    });

    $(document).on('click', '.back-to-users', function() {
        loadPartial('/users');
    });

    $(document).on('click', '.listing-bookings', function() {
        const listingId = $(this).closest('tr').find('input.row-checkbox').val();
        const url = `/bookings/listing/${listingId}`;
        loadPartial(url);
    });

    $(document).on('click', '.back-to-listings', function() {
        loadPartial('/listings');
    });
}