export const loadForm = (tableName) => {
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
        }).catch(error => console.error('Error loading form:', error));
};