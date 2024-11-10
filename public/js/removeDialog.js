export const removeDialog = () => {
    $('dialog').removeClass('active');
    $('.overlay').removeClass('active');
    $('.dialog-form').html('');
    $(document).off('submit', 'form');
};