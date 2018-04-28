import * as $ from 'jquery';
// import * as scrollReveal from 'scrollreveal';
import * as is from 'is_js';

import History from '@service/history';

interface cacheI {
    el:JQuery;
    endpoint:string;
    getXhr:JQueryXHR;
};

export default class AjaxFiltering {
    protected mainContainer: string       = $.hookStr('grid-container');
    protected filterConainer: string      = $.hookStr('filter-container');
    protected filterLink: string          = $.hookStr('filter-item-link');
    protected filterClear: string         = $.hookStr('filters__clear');
    protected filterLinkActive: string    = '.filters__anchor--active';
    protected filterItems: string         = '.filters__items';
    protected filterRefinements: string   = '.filters__refine-container';
    protected pinnedArticles: string      = '.pinned-articles';
    protected postList: string            = '.post-list';
    protected pagination: string          = '.ui-pagination';
    protected filters: string             = '.filters__anchor';
    protected spinnerClass: string        = 'ui-spinner--show';
    protected history: History = new History({
        ctx: this,
        change: () => {}
    });

    private params: any = {}
    private cache:cacheI;

    constructor() {
        this.initListeners();
    }

    protected initListeners() {
        $(document).on('click', this.filters, this.applyFilter.bind(this))
        $(document).on('click', this.filterClear, this.clearFilters.bind(this));
    }

    private applyFilter(e:JQueryEventObject) {
        e.preventDefault();
        const el = $(e.currentTarget);
        const endpoint = this.getEndpoint(el);

        if (!el.hasClass('filter-tags__anchor--inactive')) {
            const getXhr = $.get(endpoint);

            // Abort pending request and cache current one
            this.setCache({el, endpoint, getXhr});
            this.toggleSpinner(true);
            this.cache.getXhr.then(this.update.bind(this))
        }
    }

    private clearFilters(e) {
        e.preventDefault();
        const el = $(e.currentTarget);
        const endpoint: string = '?';
        const getXhr = $.get(endpoint);

        el.addClass('filters__clear-anchor--active');

        // Abort pending request and cache current one
        this.setCache({el, endpoint, getXhr});
        this.toggleSpinner(true);
        this.cache.getXhr.then(this.update.bind(this))
    }
    private toggleSpinner(show=true){
        if (show) {
            this.cache.el.addClass(this.spinnerClass);
        } else {
            this.cache.el.removeClass(this.spinnerClass);
        }
    }

    private setCache(cache:cacheI){
        if (this.cache) {
            this.cache.getXhr.abort()
        }
        this.cache = cache;
    }

    protected update(data, state, xhr) {
        if (state == 'success') {
            this.render(data);
            this.updateUrl();
            $(window).trigger('updated.filters');
        } else {
            this.handleError();
        }
    }

    protected updateUrl(){
        const url = this.cache.endpoint;
        this.history.push({ url }, '', url);
    }


    private handleError() {
        console.error('AjaxFiltering: Error on request')
    }

    private getEndpoint($el) {
        const urlParams = this.getUrlParams();
        const itemUrl = this.parseQueryStr($el.attr('href'));

        // Is a new filter
        if (is.empty(urlParams)) {
            for (let prop in itemUrl) {
                urlParams[prop] = itemUrl[prop];
            }
        } else {
            // at least one filter is applied
            // Remove page param if exists
            if (urlParams.hasOwnProperty('page')) {
                delete itemUrl.page;
                delete urlParams.page;
            }

            // Add or remove filters

            for (let prop in itemUrl) {
                const val = itemUrl[prop];

                const urlVal: string[] = urlParams[prop].split(',');
                const valIndex = $.inArray(val, urlVal);

                // Add filter
                if (valIndex === -1) {
                    urlVal.push(val);
                } else {
                    // Remove filter
                    urlVal.splice(valIndex, 1);
                }

                const newVal: string = urlVal.join(',');

                urlParams[prop] = newVal;

                // Check for empty filters
                if (is.empty(newVal)) {
                    delete urlParams[prop];
                }
            }

        }



        return '?' + this.parseObj( urlParams );
    }

    private getUrlParams() {
         const url = window.location.search;

         return this.parseQueryStr(url);
    }

    private parseObj(obj: any): string {
        if (is.empty(obj)) {
            return '';
        }

        let qs: string = '';

        $.each(obj, (key: string, val: string) => {
            qs += `${key}=${val}`;
        });

        return qs;
    }

    private parseQueryStr(url: string) {
        const urlObj: any = {};

        url.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => urlObj[$1] = $3);

        return urlObj;
    }

    protected render(data) {}
}
