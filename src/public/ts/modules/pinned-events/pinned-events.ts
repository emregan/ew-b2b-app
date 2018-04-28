import * as $ from 'jquery';
import BaseModule from '@core/base-module';
import { breakpoints, getBreakpoint } from '@core/helpers'

interface BreakpointMap {
    [key:string]: number;
}

interface EventsMapInterface {
    medium: BreakpointMap;
    large: BreakpointMap;
    xlarge?: BreakpointMap;
    xxlarge?: BreakpointMap;
    [key:string]: BreakpointMap;
}

export default class PinnedEvents extends BaseModule {
    private $items:JQuery = $.hook('pinned-events-item');
    private map:EventsMapInterface;

    constructor() {
        super();

        this.map = this.buildMap();
    }

    /**
     * Adjust events spacing on resize
     */
    public debounceResize() {
        this.adjustSpacing();
    }

    /**
     * Builds element's map by index
     * @returns { Object }
     */
    public buildMap() {
        let defaultMap:EventsMapInterface = {
            medium: { 3: 1, 4: 2, 5: 3, 6: 4 },
            large: { 4: 1, 5: 2, 6: 3 }
        }

        defaultMap.xlarge = defaultMap.xxlarge = defaultMap.large;

        return defaultMap;
    }

    /**
     * Adjust the spacing of all elements in the map
     */
    public adjustSpacing() {
        let winWidth = $(window).width();
        let currBreakpoint = getBreakpoint();
        this.clearStyles();

        // Bail on small, events are stacked,
        if (currBreakpoint === 'small') {
            return;
        }

        this.$items.each( (i, item):any => {
            let index = i+1;
            let $item = $(item);
            let $mappedItem = this.getMapItem(index, currBreakpoint);

            // Skip iteration if there's no element mapped
            if (!$mappedItem.length) {
                return true;
            }

            let itemOffset = $item.offset().top;
            let mappedItemOffset = $mappedItem.offset().top + $mappedItem.outerHeight(true);

            if (itemOffset > mappedItemOffset) {
                this.updateItemOffset(itemOffset, mappedItemOffset, $item, $mappedItem);
            }
        });
    }

    /**
     * Update position of the given element based on the offset of it's mapped item
     * @param {number} itemOffset       [description]
     * @param {number} mappedItemOffset [description]
     * @param {JQuery} $el              [description]
     * @param {JQuery} $mappedItem      [description]
     */
    public updateItemOffset(itemOffset:number, mappedItemOffset:number, $el:JQuery, $mappedItem:JQuery) {
        let offsetDiff = itemOffset - mappedItemOffset;
        let existingOffset = parseFloat($mappedItem.css('margin-top'));
            offsetDiff = offsetDiff + existingOffset;
            console.log(offsetDiff);

        $el.css('margin-top', (-offsetDiff));
    }

    /**
     * Remove styles from event items
     */
    public clearStyles() {
        this.$items.removeAttr('style');
    }

    /**
     * Get element that matches the items map
     * @param  {number} index
     * @param  {string} size
     * @return {JQuery}
     */
    public getMapItem(index:number, size:string):JQuery {
        let mappedIndex = this.map[size][index];

        return this.$items.filter(`[data-index="${mappedIndex}"]`);
    }
}
