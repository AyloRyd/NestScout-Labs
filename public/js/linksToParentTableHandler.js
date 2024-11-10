import { loadPartial } from './loadPartial.js';

export const linksToParentTableHandler = () => {
    $(document).on('click', '.ajax-link', function(event) {
        event.preventDefault();
        loadPartial($(this).attr('href'));
    });
}