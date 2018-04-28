import * as $ from 'jquery';
import * as is from 'is_js';


import BaseModule from '@core/base-module';
import EqualHeights from '@service/equal-heights';

export default class ShopItems extends BaseModule {
    private priceBox: EqualHeights;
    private contentRowHeights: EqualHeights;
    private imageRowHeights: EqualHeights;
    private $item: JQuery = $.hook('shop-results-item');
    private $itemInnerContent: JQuery = $.hook('shop-results-item__body-content');
    private itemBody: string = $.hookStr('shop-results-item__body');
    private $priceBox: JQuery = $.hook('shop-results-item__price-box');
    private $itemImage: JQuery = $.hook('shop-results-item__image');

    private itemInnerContentSelector: string = $.hookStr('shop-results-item__body-content');
    private itemImageSelector: string = $.hookStr('shop-results-item__image');
    private priceBoxSelector: string = $.hookStr('shop-results-item__price-box');

    constructor() {
        super();
        const rows: number = 4;

        // Make inner content rows equal heights
        this.contentRowHeights = new EqualHeights({
            selector: this.itemInnerContentSelector,
            rowSize: rows,
        });

        // Make images rows equal heights
        this.imageRowHeights = new EqualHeights({
            selector: this.itemImageSelector,
            rowSize: rows,
        });

        this.priceBox = new EqualHeights({
            selector: this.priceBoxSelector,
            rowSize: rows,
        });

        this.initListerners();
    }

    private initListerners() {
        $(window).on('equal-heights.resized', this.updateBodyHeight.bind(this));
        $(window).on('shop-view.change', this.onShopUpdate.bind(this));
        $(window).on('render-results.shop-categories', this.onShopUpdate.bind(this));
    }

    private onShopUpdate(event: any, data?: any) {
        // Clear styles on list mode
        if (is.not.undefined(data) && data === 'list') {
            $(this.itemBody).removeAttr('style');
            $(this.itemInnerContentSelector).removeAttr('style');
            $(this.itemImageSelector).removeAttr('style');
            $(this.priceBoxSelector).removeAttr('style');
            return;
        } else {
            this.rebindEqualHeight();
            this.updateBodyHeight();
        }
    }

    public debounceResize() {
        this.updateBodyHeight();
    }

    private rebindEqualHeight() {
        this.contentRowHeights.reflowHeight();
        this.imageRowHeights.reflowHeight();
        this.priceBox.reflowHeight();
    }

    /**
     * Updates the height of the `__body` elements so they all
     * have equal transform animations
     */
    private updateBodyHeight() {
        $(this.itemBody).each((i: number, el: any) => {
            const offset: number = 35;
            const $el: JQuery = $(el);
            let priceBoxHeight: number = $el.find(this.priceBoxSelector).height() - offset;

            $el.css({
                transform: `translateY(${priceBoxHeight}px)`,
                marginTop: -priceBoxHeight,
            })
        });
    }

    /**
     * Hook to update the item height of the contents
     * @param {number} height
     * @param {JQuery} $item
     */
    private updateContentHeight(height: number, $item: JQuery) {
        let newHeight: number;
        const $priceBox = $item.find('.shop-results-item__price-box');
        let priceBoxHeight: number = $priceBox.outerHeight();
            priceBoxHeight -= 30;

        // $priceBox.css('position', 'absolute');

        return height;
    }
}
