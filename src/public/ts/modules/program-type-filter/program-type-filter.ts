import * as $ from 'jquery';
import { MDCSelect } from '@material/select';

import BaseModule from '@core/base-module';

export default class ProgramTypeFilter extends BaseModule{
    private items:JQuery = $.hook('filter-item');
    private filterSelect:JQuery =  $.hook('filter-select');
    private noResults:JQuery =  $.hook('filter-no-results');
    private selectedFilters: any = {};

    constructor() {
        super();
        this.initSelectField();
    }

    private initSelectField() {
        this.filterSelect.on('change.ProgramTypeFilter', this.filterSelected.bind(this))
    }

    private filterSelected(e:JQueryEventObject) {
        const $el = $(e.currentTarget);
        this.selectedFilters[$el.attr('name')] = $el.val();
        this.updateFilters();
    }

    private updateFilters() {
        let selector = this.selector();
        if ( Boolean(selector) ) {
            this.showResults(selector);
        } else {
            this.showAllItems()
        }
    }

    private showResults(selector) {
        let itemsToShow = this.items.filter(selector)

        if (itemsToShow.length == 0) {
            this.noResults.removeClass('hide')
        } else {
            this.noResults.addClass('hide')
        }
        itemsToShow.removeClass('hide');
        this.items.not(selector).addClass('hide');
    }

    private showAllItems() {
     this.items.removeClass('hide');
     this.noResults.addClass('hide')
    }

    private selector() {
        return $.map(
            this.selectedFilters,
            (val, key)=> Boolean(val) ? `[data-${key}~="${val}"]` : ''
        ).join('');
    }
}
