import { tabSwitchingHandler } from './tabSwitchingHandler.js'
import { addUserButtonHandler } from './addUserButtonHandler.js';
import { addButtonsHandler } from './addButtonsHandler.js';
import { dialogsHandling } from './dialogsHandling.js';
import { toggleCheckboxesHandler } from './toggleCheckboxesHandler.js';
import { deletionHandler } from './deletionHandler.js';
import { linksToParentTableHandler } from './linksToParentTableHandler.js';
import { editingHandler } from './editingHandler.js';
import { subordinateTablesHandler } from './subordinateTablesHandler.js';
import { sqlQueryHandler } from './sqlQueryHandler.js';
import { sqlQueryTextareaExpansionHandler } from './sqlQueryTextareaExpansionHandler.js';

$(document).ready(function() {
    window.currentUrl = '';

    tabSwitchingHandler();
    addUserButtonHandler();
    addButtonsHandler();
    dialogsHandling();
    toggleCheckboxesHandler();
    deletionHandler();
    linksToParentTableHandler();
    editingHandler();
    subordinateTablesHandler();
    sqlQueryHandler();
    sqlQueryTextareaExpansionHandler();
});