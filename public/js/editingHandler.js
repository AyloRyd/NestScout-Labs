export const editingHandler = () => {
    $('.action-menu .edit-button').on('click', function() {
    const selectedIds = [];
    $('table .checkbox input[type="checkbox"]:checked').each(function() {
        selectedIds.push($(this).val());
    });

    if (selectedIds.length > 1) {
        alert('Please select only one item to edit.');
        return;
    }

    const activeTab = $('.tab-link.active').attr('href').split('/')[1];
    const editUrl = `/${activeTab}/edit-form/${selectedIds[0]}`;

    axios.get(editUrl)
        .then(response => {
            $('.dialog-form').html(response.data);
            $('dialog').addClass('active');
            $('.overlay').addClass('active');
        })
        .catch(error => console.error('Error loading edit form:', error));
    });
}