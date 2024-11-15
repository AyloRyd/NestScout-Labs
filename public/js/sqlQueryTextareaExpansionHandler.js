export const sqlQueryTextareaExpansionHandler = () => {
    const $textarea = $('#sql-query');
    $textarea.on('input', function() {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight + 20}px`;
    });
    $textarea.trigger('input');
}