export const toggleCheckboxesHandler = () => {
    $('.action-menu .checkbox input[type="checkbox"]').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('.content table input[type="checkbox"]').prop('checked', isChecked);
    });
}