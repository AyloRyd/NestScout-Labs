export const addButtonsHandler = () => {
    $(document).on('click', '.new-listing-to-user, .new-booking-to-user, .new-booking-to-listing', function(event) {
        event.preventDefault();

        const selectedIds = [];
        $('table .checkbox input[type="checkbox"]:checked').each(function() {
            selectedIds.push($(this).val());
        });

        if (selectedIds.length > 1) {
            alert("Please select only one item.");
            return;
        }

        if (selectedIds.length === 0) {
            alert("Please select an item.");
            return;
        }

        const elementType = $(this).hasClass('new-listing-to-user') ? 'user_listing'
            : $(this).hasClass('new-booking-to-user') ? 'user_booking'
                : 'listing_booking';

        const addingUrl = {
            'user_listing': `/listings/adding-form?user_id=${selectedIds[0]}`,
            'user_booking': `/bookings/adding-form?user_id=${selectedIds[0]}`,
            'listing_booking': `/bookings/adding-form?listing_id=${selectedIds[0]}`
        }[elementType];

        if (!addingUrl) {
            console.error('Unknown element type');
            return;
        }

        axios.get(addingUrl)
            .then(response => {
                $('.dialog-form').html(response.data);
                $('dialog').addClass('active');
                $('.overlay').addClass('active');
            })
            .catch(error => console.error('Error loading form:', error));
    });
}