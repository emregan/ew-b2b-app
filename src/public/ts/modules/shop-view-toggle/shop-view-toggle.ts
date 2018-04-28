import * as $ from 'jquery';
import * as is from 'is_js';
import BaseModule from '@core/base-module';
import TruncText from '@service/truncate';

export default class ShopViewToggle extends BaseModule {
    private $shopViewContainer: JQuery = $.hook('shop-view-toggle');
    private $shopResultsContent: JQuery = $.hook('shop-results-content');
    private $shopViewButton: JQuery = $.hook('shop-view-button');
    private viewButton: string = $.hookStr('shop-view-button');
    private $titles: JQuery = $.hook('shop-results-item__title');
    private viewMode: string = 'grid';
    private truncInstance: TruncText;

    constructor() {
        super();

        // Truncate item titles
        this.truncInstance = new TruncText(this.$titles);

        this.initListeners();
    }

    private initListeners() {
        $(window).on('load', this.toggleView.bind(this));
        this.$shopViewContainer.on('click', this.viewButton, this.toggleView.bind(this));
    }

    private toggleView(e) {
        e.preventDefault();

        let $el = $(e.currentTarget);
        let newViewMode = $el.data('view');
        const $shopItem: JQuery = $.hook('shop-results-item');

        // Add default view mode if newViewMode is undefined
        if (is.undefined(newViewMode)) {
            return this.$shopResultsContent.addClass(`shop-results-content--${this.viewMode}`);
        }

        // Switch view mode if different
        if (this.viewMode !== newViewMode) {
            this.$shopViewButton.removeClass('ui-nav-icon--selected');
            $el.addClass('ui-nav-icon--selected');

            // Truncate or expand text
            if (newViewMode === 'grid') {
                this.truncInstance.trim();
            } else {
                this.truncInstance.expand();
            }

            // Change view mode class
            this.$shopResultsContent
                .removeClass(`shop-results-content--${this.viewMode}`)
                .addClass(`shop-results-content--${newViewMode}`);

            // Change shop item layout
            $shopItem.toggleClass('medium-3', newViewMode === 'grid');

            // Set new view mode
            this.viewMode = newViewMode;

            // Fire window toggle event
            $(window).trigger('shop-view.change', newViewMode);
        }
    }
}
