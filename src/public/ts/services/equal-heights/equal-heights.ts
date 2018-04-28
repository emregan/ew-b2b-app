import * as $ from 'jquery';
import * as is from 'is_js'
import { breakpoints } from '@core/helpers'

export default class EqualHeights {
    private $els: JQuery;
    private rowSize: number;
    private updateHeight: any;
    private selector: string;

    constructor(opts: any) {
        this.selector = opts.selector || '';
        this.$els = $(this.selector);
        this.rowSize = opts.rowSize;
        this.updateHeight = opts.updateHeight;

        if (this.$els.length === 0 || is.mobile()) {
            console.warn('Cannot make rows equal heights, missing elements or is mobile');
            return;
        }
        this.initListerners();
    }

    private initListerners() {
        $(window).on('load', this.checkHeight.bind(this));
        $(window).on(
            'resize',
            $.debounce.apply(this, [this.debounceResize.bind(this), 250])
        );
    }

    public debounceResize() {
        this.reflowHeight();
        this.checkHeight();
    }

    /**
     *
     * @desc Removes the styles applied to the element
     *
     */
    private clearHeight() {
        this.$els.removeAttr('style');
    }

    /**
     *
     * @desc Check element's height
     *
     */
    private checkHeight() {
        if (is.not.undefined(this.rowSize)) {
            this.resizeByRowSize();
        }
    }

    /**
     *
     * @desc Resize row items by a specific number of
     *       items in a row
     *
     */
    private resizeByRowSize() {
        const { rowSize } = this;
        const totalItems: number = this.$els.length
        const itemChunks: any = [];

        // Break element list into row chunks
        for (let i = 0; i < totalItems; i+=rowSize) {
            const items: any = this.$els.slice(i, i+rowSize);
            itemChunks.push(items);
        }

        // Resize items
        for (var i = 0; i < itemChunks.length; i++) {
            const rowChunk = itemChunks[i];
            this.resizeHeight(rowChunk)
        }

        // Sent window event on resized
        $(window).trigger('equal-heights.resized');
    }

    /**
     *
     * Resize items to match height of tallest item
     * @param {JQuery[]} rowItems
     *
     */
    private resizeHeight(rowItems: JQuery) {
        if (rowItems.length === 0) {
            return;
        }


        $.each(rowItems, (i: number, el: any) => {
            let tallest = this.getTallest(rowItems);
            const $item: JQuery = $(el);


            if (
                is.not.undefined(this.updateHeight) &&
                is.function(this.updateHeight)
            ) {
                tallest = this.updateHeight(tallest, $item);
            }

            $item.height(tallest);
        });
    }

    /**
     *
     * @desc Get the height of the tallest item in the array
     * @param {JQuery} items
     * @return {Number}
     *
     */
    private getTallest(items: JQuery) {
        if (items.length === 0) {
            return 0;
        }

        let tallest: number = 0;
        $.each(items, (i: number, el: any) => {
            const $item: JQuery = $(el);
            const height: number = Math.ceil($item.outerHeight());

            tallest = Math.max(height, tallest);
        });

        return tallest;
    }

    /**
     * Rournd to the nearest nth number, defaults to 10
     * @param {number} n
     * @param {number} to
     */
    private roundTo(n: number, to: number = 10) {
        return Math.ceil(n/to)*to;
    }

    public reflowHeight() {
        this.$els = $(this.selector);
        this.checkHeight();
    }
}
