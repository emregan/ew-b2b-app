import * as $ from 'jquery';
import * as is from 'is_js';

import BaseModule from '@core/base-module';

export default class ContextualContentPopup extends BaseModule {
    protected $btnContainer: JQuery = $.hook('contextual-content-popup-btn');
    protected $seeMoreButton: JQuery = this.$btnContainer.find( $.hookStr('ui-btn-primary__btn') );

    constructor() {
        super();
        this.initListeners();
    }

    private initListeners() {
        if (this.elementsExist()) {
            this.$seeMoreButton.on('click', this.showAllItems.bind(this));
        } else {
            console.warn('Cannot listen for "Contextual Content Popup" events, some elements may be missing');
        }
    }

    protected elementsExist() {
        return ( this.$seeMoreButton.length > 0 );
    }

    protected showAllItems(e) {
        e.preventDefault();
        let $el = $(e.currentTarget);
        let $container = $el.closest('.contextual-content-popup');
        let $items = $container.find('.contextual-content-popup__item');
        $items.removeClass('contextual-content-popup__item-hidden');
        $el.hide();
    }
}
