import { loadForm } from './loadForm.js';

export const addUserButtonHandler = () => {
    $(document).on('click', '.add-button', function(event) {
        event.preventDefault();
        loadForm($('.tab-link.active').attr('href').split('/')[1]);
    });
}