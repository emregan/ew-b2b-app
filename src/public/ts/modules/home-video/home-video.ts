import * as $ from 'jquery';
import * as anime from 'animejs';
import * as is from 'is_js';
import BaseModule from '@core/base-module';

import { getBreakpoint } from '@core/helpers'

// @TODO import videojs typein
declare const videojs:any;

import Brightcove from '@service/brightcove';

export default class HomeVideo extends BaseModule {
    private $nav: JQuery = $.hook('nav');
    private $images: JQuery = $.hook('home-video-images');
    private $headerText: JQuery = $.hook('home-subpage-header-text').first();
    private $win: JQuery = $(window);
    private videos: Brightcove;
    private homePlayer: any;
    private playerSelector: string = `video${$.hookStr('brightcove-video')}`;
    private $homeVideoContainer: JQuery = $.hook('home-video');
    private $videoShape: JQuery = $.hook('home-video-shape');
    private $scrollAnchor: JQuery = $.hook('home-video-scroll');
    private $scrollSection: JQuery = $.hook('home-sections').eq(0);
    private scrollDuration: number = 1000;
    private scrolledToSection: boolean = false;
    private windowScrollTop: number;
    private shapeMorph: any;
    private scrollOffset: number = 0

    constructor() {
        super();

        this.videos = new Brightcove(this.$homeVideoContainer);
        this.homePlayer = this.getHomePlayer();
        this.shapeMorph = this.buildShapeAnimation();
        this.initListeners();
    }

    private initListeners() {
        this.$win.on('scroll', this.onScroll.bind(this));
        this.$scrollAnchor.on('click', this.scrollToLoc.bind(this));

        if (this.homePlayer) {
            this.homePlayer.on('playing', this.onPlayerPlaying.bind(this));
            this.homePlayer.on('ended', this.onPlayerEnd.bind(this));
        }

        // Mobile listeners
        if (is.mobile()) {
            this.$win.on('load', this.updateImagesHeight.bind(this));
        }

        if (window.location.hash.length > 1) {
            this.scrolledToSection = true;
        }
    }

    /**
     * On window scroll
     * @param {Object} e
     */
    private onScroll(e) {
        if (getBreakpoint() == 'small') {
            return false;
        }

        // Get Scroll distances
        const direction = this.getScrollDirection();
        const scrollHeight: number = this.$homeVideoContainer.outerHeight(true) / 3;
        this.windowScrollTop = this.$win.scrollTop();

        if (direction === 'up') {
            this.onScrollUp(e, scrollHeight);
        } else {
            this.onScrollDown(e, scrollHeight);
        }
    }

    /**
     * On window scroll down
     * @param {Object} e
     * @param {Number} scrollHeight
     */
    private onScrollDown(e, scrollHeight: number) {
        // Bail early if we have scrolled already
        if (this.scrolledToSection) {
            return false;
        }

        // Should trigger only if it's past 30% of the height video container
        if (this.windowScrollTop > scrollHeight) {
            this.scrolledToSection = true;

            // Scroll to location
            this.scrollToLoc(e);
        }
    }

    /**
     * On window scroll up
     * @param {Object} e
     * @param {number} scrollHeight
     */
    private onScrollUp(e, scrollHeight: number) {
        if (this.windowScrollTop < scrollHeight) {
            this.scrolledToSection = false;
        }
    }

    /**
     * Get Scroll Direction
     * @returns {String} up|down
     */
    private getScrollDirection() {
        this.windowScrollTop = this.windowScrollTop || 0;

        const scrollingDirection: string = this.$win.scrollTop() > this.windowScrollTop ? 'down' : 'up';

        return scrollingDirection;
    }

    /**
     * Scroll to the first content section of the homepage
     * @param {Object} e
     */
    private scrollToLoc(e) {
        e.preventDefault();

        // Scroll to first section
        $('html,body').animate({
            scrollTop: this.getScrollOffset()
        }, this.scrollDuration);

        // Play shape animation
        this.animateShape();
    }

    private getScrollOffset() {
        const topOffset: number = getBreakpoint() === 'small' ? 10 : 40;
        const wrapperTransform: string = this.$headerText.parents('.home-subpage-header').css('transform');
        const isScaled = wrapperTransform.indexOf('0.9') >= 0;
        let elTopOffset: number = this.$headerText.offset().top;

        if (isScaled) {
            // Taken from ScrollReveal
            const translate: number = 200;
            const scale: number = 0.992;

            elTopOffset = Math.round((elTopOffset - translate) * scale);
        }

        const offset: number = elTopOffset + topOffset - (this.$win.height() / 2) + (this.$headerText.height() / 2);

        return offset;
    }

    /**
     * Get's the home video player from Brightcove service
     */
    private getHomePlayer() {
        const $videoPlayer = this.$homeVideoContainer.find(this.playerSelector);
        const playerID: string = $videoPlayer.attr('id');

        return this.videos.getPlayer(playerID);
    }

    /**
     * Adds helper class to video container to remove spinner on
     * future plays
     * @param {Objec} e
     */
    private onPlayerPlaying(e) {
        this.$homeVideoContainer.addClass('home-video--playing');
    }

    /**
     * On Player End, restart the video at the specified duration
     * @param {Object} e
     */
    private onPlayerEnd(e) {
        const loopFrom: number = this.$homeVideoContainer.data('loop-from') || 0;

        this.homePlayer.currentTime(loopFrom);
        this.homePlayer.play();
    }

    /**
     * Build the animation for the video shape (bottom) and fade scroll
     * button
     */
    private buildShapeAnimation() {
        const $svg = this.$videoShape.find('svg');
        const path = $svg.find('path')[0];
        // Translate height equals to SVG height minus 2px offset
        // Note: Attempt to get the height attr for IE
        let translateHeight: number = +$svg.attr('height') || $svg.height();
        translateHeight = Math.round(translateHeight - 2);
        const duration = 500;
        const offset = 0;
        const easing = 'linear';

        // Shape animations in order: Shape container -> shape -> scroll button
        // all offset at 0 so they run simultaneously
        return anime.timeline({
            autoplay: false,
        // }).add({
        //     targets: this.$videoShape[0],
        //     translateY: -translateHeight,
        //     easing,
        //     duration,
        }).add({
            targets: this.$videoShape.find('path')[0],
            d: 'M1280,195H0V0S265,195,640,195c383,0,640-195,640-195Z',
            easing,
            duration,
            offset
        }).add({
            targets: this.$scrollAnchor[0],
            opacity: 0,
            duration: (this.scrollDuration*2),
            offset
        });
    }

    /**
     * Play shape animation
     * @param {Boolean} forward
     */
    private animateShape(forward: boolean = true) {
        if (forward) {
            this.shapeMorph.play();
        } else {
            this.shapeMorph.reverse();
        }
    }

    private updateImagesHeight(e) {
        let vHeight = this.$win.height();
        vHeight = vHeight - this.$nav.height();

        this.$images.height(vHeight);
    }
}
