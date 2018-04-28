import * as $ from 'jquery';
import * as anime from 'animejs';
import * as is from 'is_js';

import { Foundation } from 'foundation-sites/js/foundation.core';

import BaseModule from '@core/base-module';
import { breakpoints, ScrollControl } from '@core/helpers'
import BlogFiltering from './filter-blog'
import EventsWebinarsFilter from './filter-events-webinars'
import PressReleasesFilter from './filter-press-releases'

interface ColumnsI{
    [key:string]: number;
    large: number;
    medium: number;
}

export class FilterTags extends BaseModule{
    private anime = anime;

    private animationOpen: any = {
        targets: $.hookStr('filter-container'),
        opacity: [0, 1],
        duration: 600,
    }
    private animationClose: any;

    private columns:ColumnsI = {
        large: 4,
        medium: 3,
    };

    private $filterTags: JQuery = $.hook('filters');
    private $filterContainer: JQuery = $.hook('filter-container');
    private $tagsContainer: JQuery = $.hook('filter-items');
    private $filterToggle: JQuery = $.hook('filters-toggle');
    private $filterTabs: JQuery = $.hook('filters-tabs');
    private $filterTabsContainer: JQuery = $.hook('filters-tabs-container');
    private $filterTabsAccordion: JQuery = $.hook('filters-tabs-accordion-container');
    private $tags: JQuery;

    private filterType: string  = this.$filterTags.data('filter-type');
    private FILTER_OPEN:string = 'filters--open';
    private TOGGLE_BTN_OPEN:string = 'filters__button--open';
    private TAB_ACTIVE_CLASS: string = 'filters__refine-item--active';
    private PANEL_ACTIVE_CLASS:string = 'filters__refine-content--active';
    private filterTabsAccordionSelector: string = $.hookStr('filters-tabs-accordion-container');
    private tagsSelector: string = $.hookStr('filter-item');
    private tagsContainerSelector: string = $.hookStr('filter-items');

    private combinedHeight:number = 0;
    private filterOpen:boolean = false;
    private activePlugin: any = Foundation.Tabs;
    private activeTab: string = this.getFirstTabOrPanel();
    private openAccordionPanel: string = this.getFirstTabOrPanel();
    // iPad trigger resize function when it shouldn't
    private winWidth: number;

    constructor(private app){
        // Set resize/scroll events
        super();
        this.setAnimations()

        this.initListeners();
        this.initAjaxFiltering()
    };

    private initListeners(){
        // this.animation.play();
        this.$filterToggle.on('click', this.toggleFilters.bind(this))
        this.$filterTabsContainer.on('change.zf.tabs', this.updateHeight.bind(this))
        $(window).on('updated.filters', this.onFilterUpdated.bind(this));
        /**
         * if filtering tabbed content save current tab open so when we reinitialize
         * the filter `updated.filters` (rendered) we can recreate the tabs and trigger
         * an open even on that tab
         */
        this.$filterTabsContainer.on('change.zf.tabs', this.onTabChange.bind(this));
        this.$filterTabsAccordion.on('down.zf.accordion', this.onAccordionDown.bind(this));
    }

    /**
     * Initialize Ajax Filtering service for each filter
     */
    private initAjaxFiltering() {
        if (this.filterType === 'blog') {
            new BlogFiltering(this.app);
        }

        if (this.filterType === 'events') {
            new EventsWebinarsFilter(this.app);
        }

        if (this.filterType === 'press-releases-news') {
            new PressReleasesFilter(this.app);
        }
    }

    private setAnimations(){
        this.animationClose = $.extend(true, {}, this.animationOpen);

        this.animationClose.height = 0;
        this.animationClose.opacity = this.animationClose.opacity.reverse();
    }

    /**
     * Get the first available tab
     * @return {string} [description]
     */
    private getFirstTabOrPanel(): string {
        if (this.filterType !== 'events' && this.filterType !== 'search') {
            return;
        }

        // Tabs
        if ($(window).width() >= breakpoints.medium) {
            return this.$filterTabsContainer.find('a').first().html();
        } else {
            // Accordion
            return '';
        }
    }

    /**
     * On tab change update the activeTab prop
     * @param {Object} event
     * @param {JQuery} $tab
     * @param {JQuery} $content
     */
    private onTabChange(event, $tab, $content) {
        if (this.filterType !== 'events' && this.filterType !== 'search') {
            return;
        }

        this.activeTab = $tab.find('a').html();

        this.animateFilter({
            opacity: 1
        });
    }

    /**
     * On accordion down, update the openAccordionPanel prop
     * @param {Object} event
     * @param {JQuery} $content
     */
    private onAccordionDown(event, $content) {}

    /**
     * On Filter update re-open the active tab or accordion panel
     */
    private onFilterUpdated() {
        if (typeof this.activePlugin === 'undefined' || this.filterType === 'blog') {
            this.updateHeight();
            return;
        }

        if (this.activePlugin.className === 'Tabs') {
            const $target = this.activePlugin.$tabTitles
                .filter(`.${this.TAB_ACTIVE_CLASS}`);

            this.$filterTabsContainer.foundation('_openTab', $target);
        } else {
            // Destroy active accordion if exist
            this.activePlugin._destroy()
            // Re-initiate accordion
            this.activePlugin = new Foundation.Accordion(this.$filterTabsAccordion);
            // Open active accordion tab?
        }

        // Update tags height
        this.updateHeight();
    }

    private toggleFilters(e:JQueryEventObject){
        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';

        if (this.filterOpen) {
            //close drawer
            this.closeDrawer(breakpoint);
        } else {
            // show drawer
            this.openDrawer(breakpoint)
        }
    }

    private openDrawer(breakpoint: string){
        if (this.filterOpen == true) {
            return;
        }
        this.filterOpen = true;
        this.$filterToggle.addClass(this.TOGGLE_BTN_OPEN)
        this.$filterTags.addClass(this.FILTER_OPEN);

        if (breakpoint == 'small' || breakpoint == 'all') {
            console.log('openDrawer: small')
            // this.$filterContainer.css('display', 'block');
            ScrollControl.lock()
        }

        if (breakpoint == 'medium' || breakpoint == 'all') {
            console.log('openDrawer: medium')
            this.animateFilter();
        }
    }

    private animateFilter(opts: any = {}) {
        const currentHeight = this.$filterContainer.height() || 0;
        const animationOpen = $.extend(true, {}, this.animationOpen, {
            height: [currentHeight, this.containerHeight()]
        }, opts);

        anime(animationOpen);
    }

    private closeDrawer(breakpoint: string){
        if (this.filterOpen == false) {
            return;
        }
        this.filterOpen = false;
        this.$filterToggle.removeClass(this.TOGGLE_BTN_OPEN)
        this.$filterTags.removeClass(this.FILTER_OPEN);

        if (breakpoint == 'small' || breakpoint == 'all') {
            // this.$filterContainer.css('display', '');
            console.log('closeDrawer: small')
            ScrollControl.unlock();
        }

        if (breakpoint == 'medium' || breakpoint == 'all') {
            console.log('closeDrawer: medium')
            anime(this.animationClose);
        }
    }

    public debounceResize(){
        console.log({
            'current Width': $(window).width(),
            'last recorded': this.winWidth,
            'bool':($(window).width() == this.winWidth),
        })
        if ($(window).width() == this.winWidth) {
            return false;
        }

        const breakpoint = ($(window).width() >= breakpoints.medium) ? 'medium' : 'small';
        this.winWidth = $(window).width();

        this.initPlugins(breakpoint);

        // Close/Colapse tags drawer
        this.closeDrawer(breakpoint);
        this.updateHeight();
    }

    /**
     * Initialize Foundation plugins based on the viewport
     * @param {string} breakpoint
     */
    private initPlugins(breakpoint: string) {
        // Bail super early if Foundation plugins are not present
        if (
            is.not.propertyDefined(Foundation, 'Tabs') &&
            is.not.propertyDefined(Foundation, 'Accordion')
        ) {
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

            this.activePlugin._destroy();
        }

        if (breakpoint === 'medium' && (this.filterType === 'events' || this.filterType === 'search')) {
            // Use tabs for tablet and up
            this.activePlugin = new Foundation.Tabs(this.$filterTabsContainer, {
                linkClass: 'filters__refine-item',
                linkActiveClass: this.TAB_ACTIVE_CLASS,
                panelClass: 'filters__refine-content',
                panelActiveClass: this.PANEL_ACTIVE_CLASS
            });
        } else {
            // Use accordion for mobile
            this.activePlugin = new Foundation.Accordion(this.$filterTabsAccordion);
        }
    }

    /**
     * Get all the individual tags
     */
    private getTags() {
        return (this.filterType === 'events' || this.filterType === 'search')
            ? this.$filterTags
                .find(this.filterTabsAccordionSelector)
                .find(`.${this.PANEL_ACTIVE_CLASS}`)
                .find('.filters__item')
            : this.$filterTags.find(this.tagsSelector);
    }

    /**
     * Gets the tag container to apply the height
     */
    private getTagContainer() {
        return (this.filterType === 'events' || this.filterType === 'search')
            ? this.$filterTags
                .find(this.filterTabsAccordionSelector)
                .find(`.${this.PANEL_ACTIVE_CLASS}`)
                .find(this.tagsContainerSelector)
            : this.$filterTags.find(this.tagsContainerSelector);
    }

    private storeHeight() {
        this.$tags = this.getTags()

        this.combinedHeight = 0;
        this.$tags.each((i, el) => {
            this.combinedHeight += $(el).outerHeight();
        });
    }

    public updateHeight() {
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

    private containerHeight(){
        const columnHeight = this.columnsHeight();
        let spacing = Number( this.$filterContainer.css('padding-bottom').replace('px', '') );
        if (this.$filterTabs.length) {
            spacing += this.$filterTabs.outerHeight();
        }
        const height = Math.round(columnHeight + spacing);

        return height;
    }
}
