import { loadPartial } from './loadPartial.js';

export const tabSwitchingHandler = () => {
    $('.tab-link').on('click', function(event) {
        event.preventDefault();
        $('h1').css('padding', '70px 0 30px 0');
        loadPartial($(this).attr('href'));
    });
}