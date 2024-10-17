$(document).ready(function() {
    // Loads a partial view and optionally scrolls to an ID within the table
    const loadPartial = (url) => {
        axios.get(url)
            .then(response => {
                $('.content').find('table').remove().end()
                    .css('display', 'block').append(response.data);
                $('.add-button').show();

                const pathParts = url.split('?')[0].split('/');
                const tableName = `/${pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]}`;

                $('.tab-link').removeClass('active');
                $(`.tab-link[href="${tableName}"]`).addClass('active');

                const scrollToId = new URLSearchParams(url.split('?')[1]).get('id');
                if (scrollToId) {
                    const $targetRow = $(`#${tableName.replace('/', '')}-${scrollToId}`);

                    $('html, body').animate({
                        scrollTop: $targetRow.offset().top
                    }, 500, () => {
                        $targetRow.fadeIn('slow').fadeOut('slow').fadeIn('slow');
                    });
                }
            })
            .catch(error => console.error('Error fetching partial:', error));
    };

    // Loads the form for adding a new entry and displays it in the dialog
    const loadForm = (tableName) => {
        axios.get(`/${tableName}/adding-form`)
    .then(response => {
            if (response.data.includes('<form')) {
                console.log("Form loaded successfully.");
                $('.dialog-form').html(response.data);
            } else {
                console.error("Unexpected content, expected a form.");
            }
            $('dialog').addClass('active');
            $('.overlay').addClass('active');
        })
            .catch(error => console.error('Error loading form:', error));
    };

    // Closes the dialog and clears the form content
    const removeDialog = () => {
        $('dialog').removeClass('active');
        $('.overlay').removeClass('active');
        $('.dialog-form').html('');
    };

    // Handles tab switching, highlights the active tab, and loads the content for the selected tab
    $('.tab-link').on('click', function(event) {
        event.preventDefault();

        $('h1').css('padding', '70px 0 30px 0');

        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        loadPartial($(this).attr('href'));
    });

    // Opens the form dialog for adding a new entry when the "add" button is clicked
    $('.add-button').on('click', function(event) {
        event.preventDefault();
        loadForm($('.tab-link.active').attr('href').split('/')[1]);
    });

    // Submits the form via AJAX, closes the dialog, and reloads the current tab content
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

    // Closes the dialog when the "Cancel" button is clicked inside the dialog
    $(document).on('click', 'dialog .transparent.link', function(event) {
        if ($(this).text().trim() === 'Cancel') {
            removeDialog();
        }
    });

    // Closes the dialog when clicking outside of it (on the overlay)
    $('.overlay').on('click', function(event) {
        removeDialog();
    });

    // Toggles all checkboxes in the table when the main checkbox in the action menu is clicked
    $('.action-menu .checkbox input[type="checkbox"]').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('.content table input[type="checkbox"]').prop('checked', isChecked);
    });

    // Sends selected IDs to the server for deletion, and reloads the table after deletion
    $('.action-menu .square.round i:contains("delete")').parent().on('click', function() {
        const selectedIds = [];
        $('table .checkbox input[type="checkbox"]:checked').each(function() {
            selectedIds.push($(this).val());
        });

        if (selectedIds.length === 0 ||
            !confirm('Are you sure you want to delete the selected items?')) {
            return;
        }

        const activeTab = $('.tab-link.active').attr('href').split('/')[1];
        axios.post(`/${activeTab}/delete, { ids: selectedIds }`)
            .then(response => {
                loadPartial($('.tab-link.active').attr('href'));
            })
            .catch(error => {
                console.error('Error deleting items:', error);
                alert('Error deleting items');
            });
    });

    // Loads a partial view when an element with the class "ajax-link" is clicked
    $(document).on('click', '.ajax-link', function(event) {
        event.preventDefault();
        loadPartial($(this).attr('href'));
    });
});