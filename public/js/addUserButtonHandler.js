import { loadAddingForm } from './loadAddingForm.js';

export const addUserButtonHandler = () => {
    $(document).on('click', '.add-button', function(event) {
        event.preventDefault();
        loadAddingForm($('.tab-link.active').attr('href').split('/')[1]);
    });
}