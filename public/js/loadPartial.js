export const loadPartial = (url) => {
    window.currentUrl = url;
    const basePath = `/${currentUrl.split('/')[1]}`;

    return axios.get(url)
        .then(response => {
            $('.table-header').remove();
            $('.content')
                .find('table').remove().end()
                .find('.sql-query-container').remove().end()
                .css('display', 'block').append(response.data);

            if ($('.table-header').length) {
                $('.content').prepend($('.table-header'));
            }

            handleAddButtons();
            handleScrolling(url, basePath);
            handleTabLinks(basePath)
        })
        .catch(error => console.error('Error fetching partial:', error));
};

const handleAddButtons = () => {
    if (currentUrl.includes('/custom-sql-query')) {
        $('.action-menu').hide();
    } else {
        $('.action-menu').show();
    }

    if (currentUrl.includes('/users')) {
        $('.new-booking-to-user').show();
        $('.new-listing-to-user').show();
    } else if (currentUrl.includes('/listings')) {
        $('.new-booking-to-listing').show();
    }

    if (currentUrl.includes('/users')) {
        $('.add-button').show();
    } else {
        $('.add-button').hide();
    }

    if (!currentUrl.includes('/users')) {
        $('.new-booking-to-user').hide();
        $('.new-listing-to-user').hide();
    } else if (!currentUrl.includes('/listings')) {
        $('.new-booking-to-listing').hide();
    }

    if (currentUrl.includes('/booking')) {
        $('.new-element').hide();
    }
}

const handleScrolling = (url, basePath) => {
    const scrollToId = new URLSearchParams(url.split('?')[1]).get('id');
    if (scrollToId) {
        const $targetRow = $(`#${basePath.slice(1).split('?')[0]}-${scrollToId}`);
        if ($targetRow.length) {
            $('html, body').animate({
                scrollTop: $targetRow.offset().top
            }, 500, () => {
                $targetRow.fadeIn('slow').fadeOut('slow').fadeIn('slow');
            });
        } else {
            console.warn(`No element found with ID ${scrollToId}`);
        }
    }
}

const handleTabLinks = (basePath) => {
    $('.tab-link').removeClass('active');
    $(`.tab-link[href="${basePath.split('?')[0]}"]`).addClass('active');
}