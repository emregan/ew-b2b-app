import * as is from "is_js";
import * as $ from 'jquery';
import * as anime from 'animejs';

import BaseSideNav from './base';


/**
 * Class for mobile side navigation. Should only fire on mobile
 * and tablet
 */
export default class SideNavMobile extends BaseSideNav {
    private $opener: JQuery = $.hook('program-header__section-opener');
    private $secItem: JQuery = $.hook('program-header__sec-item');
    private $footer: JQuery = $.hook('footer');
    private containerDefaultsReverse:any;
    private navVisible: boolean = false;
    private bottomOffset: number = 100;
    private navOpen: boolean = false;
    private currentItemIndex: number;
    private containerAnimation:any;
    private containerDefaults:any;
    private navItemHeight: number;
    private navDefaults: any;

    constructor(opts: any = {}) {
        super();

        this.initPlugins(this.magellanOptions());

        if (this.hasElments) {
            this.setAnimations();
            this.initListerners();

            // Need to wait for Magellan to set active element
            setTimeout(()=>this.adjustSubnavHeight(), 300);
        }
    }

    private adjustSubnavHeight() {
        const activeEL: number = this.$navItem.filter('.program-header__section-name--active').outerHeight();
        this.$navContainer.height(activeEL);
    }

    private magellanOptions() {
        let threshold: number = this.$navigation.height() * 2;
        let offset: number = 0;

        let navHeight: number = this.$navContainer.height();
        threshold = navHeight + threshold;
        offset = threshold/2;

        return {
            threshold,
            offset
        }
    }

    private initListerners() {
        this.$opener.on('click', this.openNav.bind(this));
        this.$opener.on('click', this.updateNavPosition.bind(this));
        this.$navItem.on('click', this.closeNav.bind(this));

        this.$nav.on('update.zf.magellan', this.updateNavPosition.bind(this));
    }

    /**
     * Set mobile container default animation props
     */
    private setAnimations() {
        // heights
        let openHeight: number = 0;
        this.navItemHeight = this.$navContainer.outerHeight(true);

        this.$secItem.each((i:number, el:HTMLElement)=>{
            openHeight += $(el).outerHeight(true);
        })

        this.navDefaults = {
            targets: this.$nav[0],
            easing: 'linear',
            duration: 300
        }

        /** Container parent's default animation */
        this.containerDefaults = {
            targets: this.$navContainer[0],
            height: [this.navItemHeight, openHeight],
            easing: 'easeInOutBack',
            duration: 500,
        }

        // Reverse animation for container
        this.containerDefaultsReverse = $.extend(true, {}, this.containerDefaults);
        this.containerDefaultsReverse.height = this.containerDefaultsReverse.height.reverse();
    }

    /**
     * Open the side nav on mobile
     * @param {Object} e
     */
    private openNav(e) {
        e.preventDefault();

        this.$navContainer.addClass(this.ACTIVE_CLASS);
        anime(this.containerDefaults);

        // Toggle nav state
        this.navOpen = true;
    }

    /**
     * Close the side nav on mobile
     */
    private closeNav(e:JQueryEventObject) {
        this.$navContainer.removeClass(this.ACTIVE_CLASS);
        this.containerDefaultsReverse.height[1] = $(e.currentTarget).outerHeight();
        anime(this.containerDefaultsReverse);

        // Toggle nav state
        this.navOpen = false;
    }

    private updateNavPosition(e: Object, $el: JQuery) {
        const navOffsetTop: number = this.$nav.offset().top;
        let translateDistance: number;

        if (this.navOpen == true) {
            translateDistance = 0
        } else {
            const activeItemOffsetTop: number = $el.offset().top;
            translateDistance = navOffsetTop - activeItemOffsetTop;
        }


        this.$nav.css('transform', `translateY(${translateDistance}px)`);
    }
}
