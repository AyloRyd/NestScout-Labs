import { loadPartial } from './loadPartial.js';

export const deletionHandler = () => {
    $('.action-menu .delete-button').on('click', function() {
    const selectedIds = [];
    $('table .checkbox input[type="checkbox"]:checked').each(function() {
        selectedIds.push($(this).val());
    });

    if (selectedIds.length === 0 || !confirm('Are you sure you want to delete the selected items?')) {
        return;
    }

    console.log(currentUrl);

    const baseUrl = currentUrl.split('/')[1].split('?')[0];
    const deleteUrl = `/${baseUrl}/delete`;
    axios.post(deleteUrl, { ids: selectedIds })
        .then(response => {
            loadPartial(currentUrl).then(() => {
                $('.action-menu .checkbox input[type="checkbox"]').prop('checked', false);
            });
        })
        .catch(error => {
            console.error('Error deleting items:', error);
            alert('Error deleting items');
        });
});
}