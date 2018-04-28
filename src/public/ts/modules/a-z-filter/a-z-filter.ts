import * as $ from 'jquery';
import * as is from 'is_js';

import BaseModule from '@core/base-module';

export default class AZFilter extends BaseModule {
    protected expandIconSelector: string = $.hookStr('a-z-filter__expand-icon');
    protected programListSelector: string = $.hookStr('a-z-filter__program-list-wrapper');
    protected $expandIcon: JQuery;
    protected $programList: JQuery;
    protected $filterOptions: JQuery;
    protected $itemLinks: JQuery;

    constructor() {
        super();

        this.getElements();

        this.initListeners();
    }

    /**
     * Get elements needed for AZ Filter
     */
    protected getElements() {
        this.$expandIcon = $.hook('a-z-filter__expand-icon');
        this.$programList = $.hook('a-z-filter__program-list-wrapper');
        this.$filterOptions = $.hook('a-z-filter__filter-option');
        this.$itemLinks = $.hook('a-z-filter__item-link');
    }

    private initListeners() {
        if (this.elementsExist()) {
            this.$expandIcon.on('click', this.togglePrograms.bind(this));
            this.$filterOptions.on('click', this.changeFilterState.bind(this));
        } else {
            console.warn('Cannot listen for "AZ Filter" events", some elements may be missing');
        }
    }

    protected elementsExist() {
        return ( this.$expandIcon.length > 0 );
    }

    protected togglePrograms(e) {
        e.preventDefault();
        this.$programList.toggleClass('a-z-filter__program-list-wrapper-expanded');
        this.$expandIcon.toggleClass('a-z-filter__expand-icon-expanded');
        // this.$filterOptions.first().click();
    }

    protected changeFilterState(e) {
        let selectedClass = 'a-z-filter__letter-filter-option-selected';
        e.preventDefault();
        this.$filterOptions.removeClass(selectedClass)
        let $el = $(e.currentTarget);
        $el.addClass(selectedClass);
        let filterLetters = JSON.parse($el.attr('data-letters'))

        this.$itemLinks.each((i, el) => {
            let link = $(el);
            let linkLetter = link.attr('data-letter');
            if (filterLetters.includes(linkLetter)) {
                link.show();
            } else {
                link.hide();
            }
        });
    }
}
