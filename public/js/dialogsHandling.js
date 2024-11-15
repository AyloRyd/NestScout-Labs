import { loadPartial } from './loadPartial.js';
import { removeDialog } from './removeDialog.js';

export const dialogsHandling = () => {
    $(document).on('submit', 'form', function(event) {
        event.preventDefault();

        if ($(this).hasClass('sql-form')) {
            return;
        }

        const actionUrl = $(this).attr('action');
        const formData = $(this).serialize();

        axios.post(actionUrl, formData)
            .then(response => {
                removeDialog();
                loadPartial(window.currentUrl);
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                const errorMessage = error.response && error.response.data
                    ? error.response.data
                    : 'An error occurred while submitting the form.';
                alert(errorMessage);
            });
    });

    $(document).on('click', 'dialog .transparent.link', function(event) {
        if ($(this).text().trim() === 'Cancel') {
            removeDialog();
        }
    });

    $('.overlay').on('click', function(event) {
        removeDialog();
    });
}