$(document).ready(function() {
    const loadPartial = (url) => {
        axios.get(url)
            .then(response => {
                $('.content').find('table').remove().end()
                    .css('display', 'block').append(response.data);
                $('.add-button').show();
            })
            .catch(error => console.error('Error fetching partial:', error));
    };

    // Loads the form for adding a new entry, opens the dialog with the form
    const loadForm = (tableName) => {
        axios.get(`/${tableName}/adding-form`)
            .then(response => {
                $('.dialog-form').html(response.data);
                $('dialog').addClass('active');
                $('.overlay').addClass('active');
            })
            .catch(error => console.error('Error loading form:', error));
    };

    // Closes the dialog and clears the content inside
    const removeDialog = () => {
        $('dialog').removeClass('active');
        $('.overlay').removeClass('active');
        $('.dialog-form').html('');
    };

    // Handles tab switching and loads the content of the clicked tab
    $('.tab-link').on('click', function(event) {
        event.preventDefault();

        $('h1').css('padding', '70px 0 30px 0');

        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        loadPartial($(this).attr('href'));
    });

    // Opens the add form for the active tab when the "add" button is clicked
    $('.add-button').on('click', function(event) {
        event.preventDefault();
        loadForm($('.tab-link.active').attr('href').split('/')[1]);
    });

    // Submits the form via AJAX, closes the dialog, and reloads the active tab content
    $(document).on('submit', 'form', function(event) {
        event.preventDefault();
        const actionUrl = $(this).attr('action');
        const formData = $(this).serialize();

        axios.post(actionUrl, formData)
            .then(response => {
                removeDialog();
                loadPartial($('.tab-link.active').attr('href'));
            })
            .catch(error => console.error('Error submitting form:', error));
    });

    // Closes the dialog when the "Cancel" button inside the dialog is clicked
    $(document).on('click', 'dialog .transparent.link', function(event) {
        if ($(this).text().trim() === 'Cancel') {
            removeDialog();
        }
    });

    // Closes the dialog when clicking outside of it (on the overlay)
    $('.overlay').on('click', function(event) {
        removeDialog();
    });

    // Selects or deselects all checkboxes in the table when the main checkbox is clicked
    $('.action-menu .checkbox input[type="checkbox"]').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('.content table input[type="checkbox"]').prop('checked', isChecked);
    });

    // Handles the delete button click, sends selected IDs to the server for deletion, and reloads the table
    $('.action-menu .square.round i:contains("delete")').parent().on('click', function() {
        const selectedIds = [];
        $('table .checkbox input[type="checkbox"]:checked').each(function() {
            selectedIds.push($(this).val());
        });

        if (selectedIds.length === 0) {
            return;
        }

        if (!confirm('Are you sure you want to delete the selected items?')) {
            return;
        }

        const activeTab = $('.tab-link.active').attr('href').split('/')[1];
        axios.post(`/${activeTab}/delete`, { ids: selectedIds })
            .then(response => {
                loadPartial($('.tab-link.active').attr('href'));
            })
            .catch(error => {
                console.error('Error deleting items:', error);
                alert('Error deleting items');
            });
    });
});