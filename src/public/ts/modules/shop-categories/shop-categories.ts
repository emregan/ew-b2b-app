import * as $ from 'jquery';
import * as anime from 'animejs';
import * as is from 'is_js';
// import * as scrollReveal from 'scrollreveal';
import * as querystring from "querystring";
import { Foundation } from 'foundation-sites/js/foundation.core';
// This is a Server side service that was also Needed on the FE
import { slugify, deslugify } from '../../../../services/slugifier'


import TruncText from '@service/truncate';
import BaseModule from '@core/base-module';
import History from '@service/history';
import Analytics from '@service/analytics';

import { breakpoints, ScrollControl } from '@core/helpers'

export default class ShopCategories extends BaseModule {
    private columns: any = {
        large: 4,
        medium: 3,
    };

    private animationOpen: any = {
        targets: $.hookStr('filter-container'),
        opacity: [0, 1],
        duration: 600,
    }

    private animationClose: any;

    private $activeFiltersContainer: JQuery = $.hook('shop-results-filter__active-filters');
    private $filtersContainer: JQuery = $.hook('shop-results-filter-container');
    private $filterToggle: JQuery = $.hook('shop-results-filter-toggle');
    private $searchResults: JQuery = $.hook('shop-results-content');
    private $sideBarResults: JQuery = $.hook('sidebar-results');
    private $shopViewButton: JQuery = $.hook('shop-view-button');
    private $clearFilters: JQuery = $.hook('clear-filters');
    private $filterCat: JQuery = $.hook('filter-category');
    private $main: JQuery = $.hook('shop-results-filter');
    private $filterItem: JQuery = $.hook('filter-item');
    private $filters: JQuery = $.hook('shop-filter');
    private $close: JQuery = $.hook('close-filters');
    private $opener: JQuery = $.hook('opener-tag');
    private $cats: JQuery = $.hook('search-cats');
    private $activeFilterTmpl: JQuery = $.hook('shop-results-filter__active-filter-tmpl').remove();

    // Tabs/Accordion
    private $filterTabsAccordion: JQuery = $.hook('shop-results-filter-tabs-accordion-container');
    private $filterTabsContainer: JQuery = $.hook('shop-results-filter__refinements');
    private $tabs: JQuery = $.hook('shop-results-filter__refine-item');
    private $tagsContainer: JQuery;
    private $tags: JQuery;

    private PANEL_ACTIVE_CLASS: string = 'shop-results-filter__refine-content--active';
    private FILTER_INACTIVE_CLASS: string = 'shop-results-filter__anchor--inactive';
    private TAB_ACTIVE_CLASS: string = 'shop-results-filter__refine-item--active';
    private MAIN_OPEN_CLASS: string = 'shop-results-filter--open';
    private TOGGLE_BTN_OPEN: string = 'filters__button--open';
    private ACTIVE_CLASS: string = 'u-style-weight-bold';

    private paginationSelector: string = '.ui-pagination';
    private baseUrl: string = '/xhr/shop-search';

    private filterTabsAccordionSelector: string = $.hookStr('shop-results-filter-tabs-accordion-container');
    private tagsContainerSelector: string = $.hookStr('filter-items');
    private openerSelector: string = $.hookStr('opener-tag');

    private activePlugin: any = Foundation.Tabs;
    private Analytics: any;
    private combinedHeight: number = 0;
    private filterOpen: boolean = false;
    private replaceFilters: boolean = false;
    private activeFilters: any;
    private specialFilters: string[] = ['price' , 'grades', 'age'];

    private history: History = new History({
        ctx: this,
        change: this.onChangeHandler
    });

    private params: any = {};

    constructor(private App) {
        super();

        this.setAnimations();
        this.initListerners();
        this.Analytics = new Analytics(true);
    }

    /**
     *
     * On Change Handler
     * @desc on a browser history change inspect the state and change the DOM
     * accordingly. If we're at the beginning and there aren't any params
     * then reset with no params
     *
     */
    public onChangeHandler(e: PopStateEvent) {
        // starting from a clean slate
        if (e.state === null) {
            // clear out all params
            const term = this.params.term || false;
            this.params = {};
            this.$cats.removeClass(this.ACTIVE_CLASS);
            this.$opener.addClass(this.ACTIVE_CLASS);
            const category = ShopCategories.parseCat(window.location.href);
            if (category) {
                this.params.category = category;
            }

            if (term) {
                this.params.term = term;
            }

            this.makeRequest();

            return;
        }
        const params = e.state.params;
        this.params = params;

        const url: string = e.state.url;

        this.$opener.removeClass(this.ACTIVE_CLASS);
        this.$cats.removeClass(this.ACTIVE_CLASS);
        const $el = this.$cats.filter(function(){
            return $(this).attr('href') === url;
        });
        $el.addClass(this.ACTIVE_CLASS);

        this.makeRequest(params);
    }

    private initListerners() {
        this.$activeFiltersContainer.on('click', 'a', this.removeFilter.bind(this));
        this.$cats.on('click', this.query.bind(this));
        $(document).on('click', this.openerSelector, this.query.bind(this));
        this.$filters.on('click', this.filter.bind(this));
        this.$clearFilters.on('click', this.clearFilters.bind(this));
        this.$close.on('click', this.closeFilter.bind(this));
        this.$filterToggle.on('click', this.toggleFilter.bind(this));

        this.initFoundationListeners();

        $(window).on('load', this.paramCheck.bind(this));
    }

    /**
     *
     * Init Foundation Listeners
     * @desc Initialize Foundation specific listeners
     *
     */
    private initFoundationListeners() {
        // Tabs/Accordion
        this.$filterTabsContainer.off('change.zf.tabs');
        this.$filterTabsContainer.on('change.zf.tabs', this.openFilter.bind(this));
        this.$filterTabsContainer.on('change.zf.tabs', this.updateFilterHeight.bind(this));
    }

    private setAnimations(){
        this.animationClose = $.extend(true, {}, this.animationOpen);

        this.animationClose.height = 0;
        this.animationClose.opacity = this.animationClose.opacity.reverse();
    }

    public debounceResize(){
        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';

        this.initPlugins(breakpoint);
        this.updateFilterHeight();
    }

    private storeHeight() {
        this.$tags = this.getTags();

        this.combinedHeight = 0;
        this.$filterItem.each((i, el) => {
            this.combinedHeight += $(el).outerHeight();
        });
    }

    /**
     * Get all the individual tags
     */
    private getTags() {
        return this.$main
                .find(this.filterTabsAccordionSelector)
                .find(`.${this.PANEL_ACTIVE_CLASS}`)
                .find('.shop-results-filter__item');
    }

    /**
     * Gets the tag container to apply the height
     */
    private getTagContainer() {
        return this.$main
            .find(this.filterTabsAccordionSelector)
            .find(`.${this.PANEL_ACTIVE_CLASS}`)
            .find(this.tagsContainerSelector);
    }

    private updateFilterHeight() {
        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';
        this.storeHeight();
        this.$tagsContainer = this.getTagContainer();

        if (breakpoint === 'medium') {
            this.$tagsContainer.height(this.columnsHeight());
        } else {
            this.$tagsContainer.removeAttr('style');
        }
    }

    private columnsHeight() {
        const columns = ($(window).width() >= breakpoints.large) ? this.columns.large : this.columns.medium;
        const columnAvgHeight = Math.ceil(this.combinedHeight / columns);
        let columnHeights: any = {};

        // Build columns object to store each column height
        for (var i = 0; i < columns; ++i) {
            columnHeights[i] = 0;
        }

        /**
         * Store the combined height of each tag and if it's greater than the
         * columns average skip to a new column
         */
        let colCounter = 0;
        this.$tags.each((i, el) => {
            let $el = $(el);

            if (columnHeights[colCounter] > columnAvgHeight) {
                colCounter++;
            }

            columnHeights[colCounter] += $el.outerHeight();
        });

        // Override variable into an array with the height as values
        columnHeights = $.map(columnHeights, (val) => {
            return val;
        });

        // Return the tallest column
        return Math.max.apply(null, columnHeights);
    }

    private toggleFilter(e) {
        e.preventDefault();

        if (this.filterOpen) {
            // Close filter
            this.closeFilter(e);
        } else {
            this.openFilter(e);
        }
    }

    private closeFilter(e) {
        e.preventDefault();
        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';

        if (!this.filterOpen) {
            return;
        }

        if (breakpoint == 'small') {
            ScrollControl.unlock();
        }

        // Close Active tab in desktop
        if (breakpoint === 'medium') {
            const $activeTab = this.$tabs.filter(`.${this.TAB_ACTIVE_CLASS}`);
            this.$filterTabsContainer.foundation('_collapseTab', $activeTab);
        }

        this.$main.removeClass(this.MAIN_OPEN_CLASS);
        this.filterOpen = false;
    }

    private openFilter(e, $tab?: any, $content?: any) {
        e.preventDefault();
        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';

        if (this.filterOpen) {
            return;
        }

        if (breakpoint === 'small') {
            ScrollControl.lock();
        }

        this.$main.addClass(this.MAIN_OPEN_CLASS);
        this.filterOpen = true;
    }

    /**
     * Initialize Foundation plugins based on the viewport
     * @param {string} breakpoint
     * @todo This is a direct copy from filter-tags.ts, find a way
     *       to merge this code
     */
    private initPlugins(breakpoint: string) {
        // Bail super early if Foundation plugins are not present
        if ( is.not.propertyDefined(Foundation, 'Tabs') && is.not.propertyDefined(Foundation, 'Accordion') ) {
            return;
        }

        // Get plugin name based on breakpoint
        const pluginName = breakpoint === 'medium' ? Foundation.Tabs.name : Foundation.Accordion.name;

        // Bail early if activePlugin hasn't change
        if (this.activePlugin.className === pluginName) {
            return;
        }

        // Destroy active plugin if exist
        if (is.not.undefined(this.activePlugin.className)) {
            const $el = (this.activePlugin.className === 'Accordion')
                ? this.$filterTabsAccordion
                : this.$filterTabsContainer;

            $el.foundation('_destroy');
        }

        if (breakpoint === 'medium') {
            if (this.$filterTabsContainer.length != 0) {
                // Use tabs for tablet and up
                this.activePlugin = new Foundation.Tabs(this.$filterTabsContainer, {
                    linkClass: 'shop-results-filter__refine-item',
                    linkActiveClass: this.TAB_ACTIVE_CLASS,
                    panelClass: 'shop-results-filter__refine-content',
                    panelActiveClass: this.PANEL_ACTIVE_CLASS
                });
            }
        } else {
            if (this.$filterTabsAccordion.length != 0) {
                // Use accordion for mobile
                this.activePlugin = new Foundation.Accordion(this.$filterTabsAccordion, {
                    allowAllClosed: true
                });
            }
        }
    }

    /**
     *
     * Param Check
     * @desc on page load check if there are any query string params that need
     * to be loaded async
     *
     */
    private paramCheck() {
        const params: any = ShopCategories.getQuery(location.href);
        // Having this here breaks pagination on window load
        // delete params.page;

        if (!is.empty(params)) {
            // if this is just a term search we don't want to redo the search
            // async
            if (Object.keys(params).length === 1 && Object.keys(params)[0] === 'term') {
                this.params = params;
                return;
            }

            // Hide results if doing another request
            this.$searchResults.css('opacity', 0);
            $(this.paginationSelector).css('opacity', 0);

            const category = ShopCategories.parseCat(window.location.href);
            if (category) {
                params.category = category;
            }

            if ( is.propertyDefined(params, 'subcategory') ) {
                this.$opener.removeClass(this.ACTIVE_CLASS);
                this.$cats.removeClass(this.ACTIVE_CLASS);
                const $el = this.$cats.filter((i, el) =>{
                    return $(el).data('url') === params.subcategory;
                });
                $el.addClass(this.ACTIVE_CLASS);
            }

            const request: JQueryXHR = $.get(this.baseUrl, params);
            this.params = params;
            request.then(data => this.renderResults(data));
        }
    }

    /**
     * Update params from the query URL
     * @param  {string} url
     * @param  {string} href
     * @return {string} parsed url
     */
    private updateParams(href: string): string {
        const category: string|boolean = ShopCategories.parseCat(href);
        const query = ShopCategories.getQuery(href);

        // clear out old range queries if a new one is coming in
        if (query.hasOwnProperty('range') && typeof this.params.range !== 'undefined' &&
            (query.range === this.params.range || this.params.range.indexOf(query.range) > -1))
        {
            if (Array.isArray(this.params.range) && this.params.range.length > 1) {
                const index = this.params.range.indexOf(query.range);
                this.params.range.splice(index, 1);
            } else {
                delete this.params.range;
            }
            delete this.params[`${query.range}Lte`];
            delete this.params[`${query.range}Lt`];
            delete this.params[`${query.range}Gte`];
            delete this.params[`${query.range}Gt`];
            delete this.params[`${query.range}Gt`];
        }

        if (query.range === 'grades') {
            delete this.params.orRange;
        }

        if (category) {
            this.params.category = category;
        }

        // Add query props to params
        for (const prop in query) {
            const val: string = query[prop];
            // create array for param if not defined
            this.params[prop] = this.params[prop] || [];

            if (prop === 'subcategory' && val === ' ') {
                delete this.params.subcategory;
            } else if (/subcategory|term/.test(prop)) {
                // subcategory and term should only have one term
                this.params[prop] = val;
            } else {
                this.params[prop].push(val);
            }
        }

        return this.parseUrl();
    }

    /**
     *
     * Query
     * @desc construct and run a search based on the clicked subcategory
     * and adjust the push state so the URL reflects the category
     *
     */
    private query(e: any) {
        e.preventDefault();
        const $el = $(e.currentTarget);

        // Prevent filtering on opener link on mobile
        if (is.mobile() || is.tablet()) {
            if (this.isOpener($el)) {
                return;
            }
        }

        // Bail early if main categories opener
        if ($el.text().trim() === 'Shop categories') {
            return;
        }

        // Replace filters if clicked on a category
        if ($el.attr('rel') === 'category') {
            this.replaceFilters = true;
        }

        this.$opener.removeClass(this.ACTIVE_CLASS);
        this.$cats.removeClass(this.ACTIVE_CLASS);
        $el.addClass(this.ACTIVE_CLASS);
        const href = $el.prop('href');
        let url = $el.attr('href');

        url = this.updateParams(href);

        this.makeRequest();

        this.history.push({
            params: this.params,
            url,
        }, '', url);
    }

    /**
     * @desc Check if the element is the opener tag
     * @param {JQuery} $el
     */
    private isOpener($el: JQuery) {
        return $el.data('js-hook') === 'opener-tag';
    }

    /**
     *
     * Clear Filters
     * @desc remove all filters
     *
     */
    private clearFilters(e: any) {
        e.preventDefault();
        const protectedFilters = ['term', 'category', 'subcategory'];

        for (const param in this.params) {
            if (protectedFilters.indexOf(param) < 0) {
                delete this.params[param];
            }
        }

        // Clear out pagination
        if (this.params.hasOwnProperty('page')) {
            delete this.params.page;
        }

        const url = this.parseUrl();

        this.makeRequest();

        this.history.push({
            params: this.params,
            url,
        }, '', url);
    }

    private parseUrl(): string {
        const params = {...this.params};
        delete params.category;

        // Clean up empty params
        $.each(params, (key, val) => {
            if (!val || val.length === 0) {
                delete params[key];
            }
        });

        const qs = querystring.stringify(params)
        const splitUrl = window.location.origin+window.location.pathname//window.location.href.split('?')[0];

        let url = qs === '' ? `${splitUrl}` : `${splitUrl}?${qs}`;

        return url;
    }

    /**
     *
     * Filter
     * @desc grab the value of the filter and apply it to the search
     * and change the DOM
     *
     */
    private filter(e: any) {
        e.preventDefault();
        const $el = $(e.currentTarget);
        const filterType = $el.attr('data-filter-type');
        const filterValue = $el.attr('data-filter-value');
        const href = $el.prop('href');
        let url = $el.attr('href');

        url = this.updateParams(href);

        this.makeRequest();

        this.history.push({
            params: this.params,
            url,
        }, '', url);
    }

    private removeFilter(e) {
        e.preventDefault();
        const $el = $(e.currentTarget);
        const filterType = $el.data('filter-type');
        const filterValue = $el.data('filterCleanName');

        // Remove value from filterType Collection
        if (is.array(this.params[filterType])) {
            this.params[filterType] = this.params[filterType].filter((val) => val !== filterValue);
        } else if (this.specialFilters.indexOf(filterType) > -1) {
            const range = filterType;
            delete this.params[`${range}Lt`];
            delete this.params[`${range}Lte`];
            delete this.params[`${range}Gt`];
            delete this.params[`${range}Gte`];
            delete this.params[`${range}Gte`];

            if (Array.isArray(this.params.range)) {
                const index = this.params.range.indexOf(range);
                this.params.range.splice(index, 1);
            } else {
                delete this.params.range;
            }

            if (range === 'grades') {
                delete this.params.orRange;
            }
        } else {
            // Remove filterType if only has one value
            delete this.params[filterType];
        }


        // Clear out pagination
        if (this.params.hasOwnProperty('page')) {
            delete this.params.page;
        }

        const url = this.parseUrl();

        this.makeRequest();

        this.history.push({
            params: this.params,
            url,
        }, '', url);
    }

    /**
     *
     * Render Results
     * @desc take in the resulting data, make adjustments and add it to the
     * DOM
     *
     */
    private renderResults(data) {
        const $html = $(data);
        const contents: any = this.adjustView($html.filter('.shop-results-content').html());
        const shopFilters: string = $html.filter('.shop-results-filter').html();
        const $sidebar: any = $html.filter('.js-xhr-sidebar').first();
        const $pagination: any = $html.filter(this.paginationSelector);
        this.$searchResults.html(contents);
        this.$sideBarResults.html($sidebar.html());

        // Re-initialize accordion menu on sidebar
        new Foundation.AccordionMenu(this.$sideBarResults.find('[data-accordion-menu]'));

        // Should update filters?
        // Filters should be replaced only if filtering via sidebar categories
        if (this.replaceFilters) {
            this.$main.html(shopFilters);

            this.rebindFilters();

            // Reset replace filters
            this.replaceFilters = false;
        }

        this.rebindCats();

        $(this.paginationSelector).html($pagination);

        // Retruncate titles
        const $titles = $.hook('shop-results-item__title');
        const truncInstance = new TruncText($titles);
        this.rebindScroll();

        this.updateActiveFilters();

        // Show results
        this.$searchResults.css('opacity', 1);
        $(this.paginationSelector).css('opacity', 1);

        // Set small timeout to allow images to load
        setTimeout(() => {
            $(window).trigger('render-results.shop-categories');
        }, 500);

        // ensure analytics has the latest data on DOM changes
        this.Analytics.pushSearchChanges(data, 'productList', this.params);
    }

    private updateActiveFilters() {
        const notFilters: string[] = ['category', 'subcategory', 'term', 'page', 'range'];
        const activeFilters: any = {...this.params};

        // Remove all props that should not be treated as active filters
        $.each(notFilters, (key: number, val: string) => {
            if (activeFilters.hasOwnProperty(val)) {
                if (val === 'range') {
                    const rangeFilters = Array.isArray(activeFilters[val]) ? activeFilters[val] : [activeFilters[val]];

                    for (const rangeFilter of rangeFilters) {
                        const filterVal = this[`${rangeFilter}Mapping`](activeFilters);
                        delete activeFilters[`${rangeFilter}Gt`];
                        delete activeFilters[`${rangeFilter}Gte`];
                        delete activeFilters[`${rangeFilter}Lt`];
                        delete activeFilters[`${rangeFilter}Lte`];
                        delete activeFilters['orRange'];
                        activeFilters[rangeFilter] = filterVal;
                    }
                }
                delete activeFilters[val];
            }
        });

        // Remove empty filters
        $.each(activeFilters, (key, val) => {
            if (!val || val.length === 0) {
                delete activeFilters[key];
            }
        });

        this.activeFilters = activeFilters;

        this.renderActiveFilters();
    }

    private priceMapping(activeFilters: any): string {
        let filterVal: string;

        if (activeFilters.hasOwnProperty('priceLte') && activeFilters.hasOwnProperty('priceGte')) {
            filterVal = `$${activeFilters.priceGte} - ${activeFilters.priceLte}`;
        } else if (activeFilters.hasOwnProperty('priceLte')) {
            filterVal = `Under $${activeFilters.priceLte}`;
        } else if (activeFilters.hasOwnProperty('priceGte')) {
            filterVal = `Over $${activeFilters.priceGte}`;
        }

        return filterVal;
    }

    private ageMapping(activeFilters: any): string {
        let filterVal: string;

        let gte: boolean|Number = false;
        let lte: boolean|Number = false;

        if (activeFilters.hasOwnProperty('ageGte')) {
            gte = Number(activeFilters.ageGte);
        }

        if (activeFilters.hasOwnProperty('ageLte')) {
            lte = Number(activeFilters.ageLte);
        }

        if (gte !== false && lte !== false) {
            if (gte === 0 && lte === 2) {
                filterVal = 'Ages - Birth - 2';
            }

            if (gte === 3 && lte === 5) {
                filterVal = 'Ages - 3 - 5';
            }

            if (gte === 6 && lte === 8) {
                filterVal = 'Ages - 6 - 8'
            }

            if (gte === 9 && lte === 12) {
                filterVal = 'Ages - 9 - 12'
            }

            if (gte === 13 && lte === 18) {
                filterVal = 'Ages - 13 - 18'
            }
        } else {
            if (gte !== false) {
                filterVal = 'Adult';
            }
        }

        return filterVal;
    }


    /**
     *
     * Grades Mapping
     * @desc convert the gt(e)/lt(e) actual mappings to the more semantic
     * meaning for the end user
     *
     */
    private gradesMapping(activeFilters): string {
        let filterVal: string;

        let gt: boolean|Number = false;
        let gte: boolean|Number = false;
        let lt: boolean|Number = false;
        let lte: boolean|Number = false;

        let orRange: boolean|Number = false;

        if (activeFilters.hasOwnProperty('orRange')) {
            orRange = Number(activeFilters.orRange);
        }

        if (activeFilters.hasOwnProperty('gradesGt')) {
            gt = Number(activeFilters.gradesGt);
        }

        if (activeFilters.hasOwnProperty('gradesGte')) {
            gte = Number(activeFilters.gradesGte);
        }

        if (activeFilters.hasOwnProperty('gradesLt')) {
            lt = Number(activeFilters.gradesLt);
        }

        if (activeFilters.hasOwnProperty('gradesLte')) {
            lte = Number(activeFilters.gradesLte);
        }

        if (orRange && gte !== false && lte !== false) {
            filterVal = 'Elementary';
        } else if (gte !== false && lte !== false) {
            if (gte === 6 && lte === 8) {
                filterVal = 'Middle School';
            }
            if (gte === 9 && lte === 12) {
                filterVal = 'High School'
            }
        } else if (gt === 12 && lt === 14) {
            filterVal = 'Early Learning';
        } else if (gt === 14 && lt === 16) {
            filterVal = 'College';
        } else if (gt === 15 && lt === 17) {
            filterVal = 'College';
        }

        return filterVal;
    }

    private renderActiveFilters() {
        // Show or hide clear button
        if (Object.keys(this.activeFilters).length > 0) {
            this.$clearFilters.css('display', 'block');
        } else {
            this.$clearFilters.css('display', 'none');
        }

        // Clear out current filters
        this.$activeFiltersContainer.html('');
        this.$filterTabsAccordion.find('a').removeClass(this.FILTER_INACTIVE_CLASS);

        // Add filters to DOM
        $.each(this.activeFilters, (type: string, filters: any) => {
            if (is.array(filters)) {
                $.each(filters, (i: number, val: string) => {
                    this.renderActiveFilterButton(type, val);
                });
            } else {
                this.renderActiveFilterButton(type, filters);
            }
        });
    }

    private renderActiveFilterButton(type: string, val: string) {
        // Insert filters
        const $filter = this.$activeFilterTmpl.clone();
        const filterValue = this.specialFilters.indexOf(type) > -1 ? val : slugify(val);
        const $filterBtn: JQuery = this.$filterTabsAccordion.find(`[data-filter-type="${type}"][data-filter-value="${filterValue}"]`);

        $filter.removeAttr('data-js-hook').removeAttr('class');
        // Add active class to filter
        $filterBtn.addClass(this.FILTER_INACTIVE_CLASS);
        const text = $filterBtn.text();

        $filter.find('a').attr({
            'data-filter-type': type,
            'data-filter-value': slugify(val)
        })
        .data('filterCleanName', val); // This will be store as arbitrary data (plain text)
        $filterBtn

        $filter.find('.shop-results-filter__anchor-text').text(text);

        this.$activeFiltersContainer.append($filter);
    }

    /**
     *
     * Adjust View
     * @desc check for the layout and ensure the elements have the right classes
     * to conform to the layout set
     */
    private adjustView($contents) {
       const $active = this.$shopViewButton.filter('.ui-nav-icon--selected');
       const view = $active.attr('data-view');

       if (view === 'list') {
           $contents.find('.shop-results-item').removeClass('medium-3');
       }

       return $contents;
    }

    /**
     *
     * Rebind Scroll
     * @desc rebind the scroll animation so that it works as expected with the
     * new DOM elements
     *
     */
    private rebindScroll() {
        // this.App.scrollreveal.sync();
        // Trigger a scroll so products start to show
        $(window).scrollTop(10);
    }

    /**
     *
     * Rebind Filters
     * @desc Rebind the click listener on the main filters
     *
     */
    private rebindFilters() {
        this.$filters = $.hook('shop-filter');
        this.$filterItem = $.hook('filter-item');
        this.$filterTabsContainer = $.hook('shop-results-filter__refinements');
        this.$filterTabsAccordion = $.hook('shop-results-filter-tabs-accordion-container');
        this.$activeFiltersContainer = $.hook('shop-results-filter__active-filters');
        this.$tabs = $.hook('shop-results-filter__refine-item');
        this.$close = $.hook('close-filters');
        this.$clearFilters = $.hook('clear-filters');

        // Reinitialize Foundation plugins and update filter height, can be done with
        // a resize debounce
        this.activePlugin = Foundation.Tabs;
        this.debounceResize();

        // Re-initialize listeners
        this.$filters.off('click').on('click', this.filter.bind(this));
        this.$activeFiltersContainer.off('off').on('click', 'a', this.removeFilter.bind(this));
        this.$clearFilters.off('click').on('click', this.clearFilters.bind(this));
        this.$close.off('click').on('click', this.closeFilter.bind(this));

        this.initFoundationListeners();
    }

    /**
     *
     * Rebind Cats
     * @desc rebind the click listener on the sidebar categories
     * and make the clicked filter active
     *
     */
    private rebindCats() {
        this.$cats = $.hook('search-cats');
        this.$cats.off('click');
        this.$cats.on('click', this.query.bind(this));
        if (!is.undefined(this.params.subcategory)) {
            const subcat = this.params.subcategory.replace(/\S/g, '+');
            this.$cats.removeClass(this.ACTIVE_CLASS);
            const $el = this.$cats.filter(function(){
                return $(this).attr('data-url') === subcat;
            });
            $el.addClass(this.ACTIVE_CLASS);
        }
    }

    private makeRequest(params?: any) {
        let requestParams: any;
        if (params) {
            requestParams = params;
        } else {
            requestParams = this.params;
        }

        const request: JQueryXHR = $.get(this.baseUrl, requestParams);
            request.then(data => this.renderResults(data));
    }

    /**
     *
     * Parse Cat
     * @desc grab the category from a given string and make sure it is actually
     * set
     */
    public static parseCat(url: string): string|boolean {
        const base: string = url.split('?')[0];
        const split: string[] = base.split('/');
        let cat: string = split[split.length - 1];
        cat = cat.replace(/\+/g, ' ');

        return cat !== 'shop' && cat !== 'search' ? cat : false;
    }

    public static getQuery(url: string, key?: string): any {
        // location.seach is not well supported
        const qr: string = url
            .replace(location.origin, '') // Remove host
            .replace(location.pathname, '') // Remove path
        .replace(/^\?/, '') // Remove traling ?

        const query: any = querystring.parse(qr);

        return query[key] || query;
    }
}
