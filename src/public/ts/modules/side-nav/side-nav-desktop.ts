import * as $ from 'jquery';
import * as is from "is_js";

import BaseSideNav from './base';

/**
 * Class for desktop side navigation. Should only fire on desktop
 */
export default class SideNavDesktop extends BaseSideNav {
    private textSelector: string = $.hookStr('program-header__sections-text');
    private dotSelector:string = $.hookStr('program-header__sections-dot');
    private $footer: JQuery = $.hook('footer');
    private $win: JQuery = $(window);
    private navLocked: boolean = false;
    private dotAnimationDefaults: any;
    private topOffset: number = 225;
    protected scrollTop: number;
    private inOutAnimation: any;

    constructor() {
        super();

        this.initPlugins(this.magellanOptions());

        if (this.hasElments) {
            this.initListerners();
        }
    }

    private magellanOptions() {
        let threshold: number = this.$navigation.height() * 2;
        let offset: number = 0;

        return {
            threshold,
            offset
        }
    }

    private initListerners() {
        this.$win.on('load scroll', this.onLoadScroll.bind(this));
    }

    private onLoadScroll(e: JQueryEventObject) {
        this.scrollTop = this.$win.scrollTop();
        this.toggleNavLock();
    }

    /**
     * Check to see if we need to lock or unlock the side nav on desktop
     */
    private toggleNavLock() {
        let topLockPoint: number = this.$navContainer.offset().top - this.topOffset;
        let bottomLockPoint: number = this.$footer.height() + 80;
        let bottomOffset: number = this.getRects(this.$footer).top - 80;

        if (is.undefined(this.scrollTop)) {
            return;
        }

        if (bottomLockPoint >= bottomOffset) {
            // Lock at the bottom of the footer
            this.navLockBottom(bottomOffset);
        } else if (this.scrollTop >= topLockPoint) {
            // Lock when scrolling from the top
            this.navLockTop();
        } else {
            // Unlock when reaching the top
            this.navUnlock();
        }
    }

    /**
     * Unlock fixed navigation
     */
    private navUnlock() {
        if (!this.navLocked) {
            return
        }

        this.$navContainer.removeClass(this.ACTIVE_CLASS);
        this.$nav.css('position', 'static');

        this.navLocked = false;
        this.$nav.trigger('animateIn.side-nav');
    }

    /**
     * Lock fixed naviagtion
     */
    private navLockTop() {
        if (this.navLocked) {
            return;
        }

        this.$navContainer.addClass(this.ACTIVE_CLASS);
        this.$nav.css({
            position: 'fixed',
            top: this.topOffset
        });


        this.navLocked = true;
        this.$nav.trigger('animateOut.side-nav');
    }

    /**
     * Locks the side navigation when it reaches the bottom of the page
     * to prevent it from going over the footer
     * @param {number} bottomOffset
     */
    private navLockBottom(bottomOffset: number) {
        bottomOffset = Math.round(bottomOffset);

        this.$nav.css({
            position: 'fixed',
            top: 'auto',
            bottom: this.$win.height() - bottomOffset
        });
    }

    private getRects($el: JQuery) {
        return $el[0].getBoundingClientRect();
    }
}
