import * as $ from 'jquery';
import BaseModule from '@core/base-module';
import { breakpoints } from '@core/helpers'
import TruncText from '@service/truncate';
import { Foundation } from 'foundation-sites/js/foundation.core';

import Search from '@service/search';

export default class ShopSearch extends BaseModule {
    private $form: JQuery = $.hook('search-bar-shop');
    private $searchResults: JQuery = $.hook('shop-search-results');
    private $searchResultContent: JQuery = $.hook('shop-results-content');
    private $searchContainer: JQuery = $.hook('shop-search');
    private $searchInput: JQuery = this.$form.find('input');
    private searchEndpoint: string = '/shop/results/';
    private ACTIVE_CLASS: string = 'shop-search--open';
    private truncInstance: TruncText;
    private search: Search = new Search({
        form: this.$form,
        submitUrl: '/xhr/predictive-search',
        renderResults: this.renderResults.bind(this),
        action: '/search/shop'
    });

    constructor() {
        super();
        // Set default search params
        this.setDefaultParams();

        this.initListerners();
    }

    private initListerners() {
        this.$form.on('keyup.shop-search', this.search.updateParams.bind(this.search));
        $(window).on('click', this.closeShopSearch.bind(this));
        this.$searchInput.on('focus', this.openShopSearch.bind(this));
        // Stop propagation on search container
        this.$searchContainer.on('click', (e) => e.stopPropagation() );
    }

    /**
     * Remove active class when clossing search
     * @param {JqueryEventObject} e
     */
    private closeShopSearch(e) {
        this.$searchContainer.removeClass(this.ACTIVE_CLASS);
    }

    /**
     * Add active class when opening search
     * @param {JqueryEventObject} e
     */
    private openShopSearch(e) {
        this.$searchContainer.addClass(this.ACTIVE_CLASS);
    }

    /**
     * Set default params for shop specific search
     */
    private setDefaultParams() {
        this.search.params = $.extend({}, this.search.params, {
            queryType: 'shop',
        });
    }

    /**
     * Renders results onto the appropriate container
     * @param {any} data
     */
    private renderResults(data) {
        this.$searchResults.html(data);

        // Update components results to make them 2 columns
        const $results = $.hook('result-summary');
        const isDesktop = $(window).width() >= breakpoints.large;
        const isTablet = $(window).width() >= breakpoints.medium;
        const $list = $.hook('result-summary-list').filter('[data-type*="products"]');
        const itemSelector = $.hookStr('result-summary-item');
        const $items = $list.find(itemSelector);
        const $links = $items.find('a');

        if ($results.data('results') === 'shop' && isTablet) {
            // Trim titles
            new TruncText($links);
        }

        if ($results.data('results') === 'shop' && isDesktop) {
            // Make 2 columns each containing 4 elements
            let col1 = 0;
            let col2 = 0;
            $items.each((i, el) => {
                let height = $(el).outerHeight(true);
                if (i < 4) {
                    col1 += height;
                } else {
                    col2 += height;
                }
            });

            // Add height to items list of the tallest column
            $list.height(Math.max(col1, col2));
        }
    }
}
