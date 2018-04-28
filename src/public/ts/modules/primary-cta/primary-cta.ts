import * as $ from 'jquery';
import * as is from 'is_js';
import * as anime from 'animejs';

import BaseModule from '@core/base-module';
import { breakpoints } from '@core/helpers'

export default class PrimaryCta extends BaseModule {
    private $shapeContainer: JQuery = $.hook('primary-cta-shape-container');
    private $currentShape: JQuery;
    private shapeSelector: string = $.hookStr('primary-cta-shape-bg');
    private ANIMATED_CLASS: string = 'primary-cta__bg-shape-container--animated';
    private $cta: JQuery = $.hook('primary-cta');
    private currShapeIndex: number = -1;
    private nextShapeIndex: number = 0;
    private $win: JQuery = $(window);
    private winScrollTop: number = 0;
    private viewFactor: number = 0.5;
    private cacheRects: any = {};

    /** Deprecated props */
    // private $htmlBody: JQuery = $('html,body');
    // private shapeAnimating: boolean = false;
    // private prevShapeIndex: number = -1;

    constructor() {
        super();

        if (this.ctaShapeExist()) {
            this.initListeners();
        }
    }

    private initListeners() {
        this.$win.on('load', this.onLoad.bind(this));
        this.$win.on('scroll', this.onScroll.bind(this));
    }

    /**
     * Checks to see it CTA elements exist on the page
     * @return {boolean}
     */
    private ctaShapeExist(): boolean {
        return this.$shapeContainer.length > 0;
    }

    /**
     * On window loaded
     * @param {Object} e
     */
    private onLoad(e) {
        // Get current shape and it's dimensions
        this.$currentShape = this.getCurrentShape();
        let rects = this._getClientRects();

        this.setAnimated(rects);

        this.winScrollTop = this.$win.scrollTop();
    }

    /**
     * On window scroll
     * @param {Object} e
     */
    private onScroll(e) {
        // Bail early if scroll load fires
        if (window.pageYOffset === 0 || this.nextShapeIndex > this.$shapeContainer.length -1) {
            return;
        }

        // Get current shape and it's dimensions
        this.$currentShape = this.getCurrentShape();
        let rects = this._getClientRects();

        this.setAnimated(rects);

        // Set scrollTop offset
        this.winScrollTop = this.$win.scrollTop();
    }

    /**
     * Gets the current shape that's below the viewport
     */
    private getCurrentShape() {
        if (this.currShapeIndex === this.nextShapeIndex) {
            return this.$currentShape;
        }

        return this.$shapeContainer.filter((i, el) => {
            this.currShapeIndex = this.nextShapeIndex;
            return $(el).offset().top >= (this.winScrollTop + this.$win.height());
        }).first();
    }

    /**
     * Gets the current element's dimensions
     */
    private _getClientRects() {
        if (this.$currentShape.length === 0) {
            return false;
        }

        let { top, height, bottom } = this.$currentShape[0].getClientRects()[0];

        return {
            top: Math.round(top),
            height: Math.round(height),
            bottom: Math.round(bottom)
        }
    }

    /**
     * Set the current element as "animated" once it reaches
     * the viewport + the viewFactor
     * @param {Object} rects
     */
    private setAnimated(rects) {
        // Bail early if no element dimensions
        if (!rects) {
            return;
        }

        const elOffset: number = (rects.top + (rects.height*this.viewFactor));

        if (this.$win.height() > elOffset) {
            this.nextShapeIndex = this.currShapeIndex+1;

            // Add animated class
            this.$currentShape.addClass(this.ANIMATED_CLASS);
        }
    }

    /**
     * On window loaded
     * @deprecated
     * @param {Object} e
     */
    /*private onLoad(e) {
        this.winScrollTop = this.$win.scrollTop();
        // Update the current shape index
        this.nextShapeIndex = this.getNextIndexOnLoad();
        // Animate previous shapes if landed somewhere down the page
        this.animatePrevious();
        // Animate shape if next elIndex is in the viewport
        this.animateShape(this.nextShapeIndex, 'down');
    }*/

    /**
     * On window scroll
     * @deprecated
     * @param {Object} e
     */
    /*private onScroll(e) {
        // Bail early if shape is animating or scroll load fires
        if (this.shapeAnimating || window.pageYOffset === 0) {
            return;
        }

        this.winScrollTop = this.$win.scrollTop();
        // let direction = this.getScrollDirection();
        // const elIndex = (direction === 'down') ? this.nextShapeIndex : this.prevShapeIndex;

        // Animate shape if next elIndex is in the viewport
        this.animateShape(this.nextShapeIndex, 'down');
    }*/

    /**
     * Determines if the next element who's index match has
     * entered the viewport
     * @deprecated
     * @param {Number} nextIndex
     * @param {String} direction
     */
    /*private topShapeInView(nextIndex: number, direction: string): boolean {
        // Bail early if no next element
        if (
            is.undefined(nextIndex) ||
            (nextIndex < 0) ||
            nextIndex > this.$shapeContainer.length -1
           ) {
            return false;
        }
        // Get measurements
        let scrollTop: number;
        let elOffset: number;
        let $el = this.$shapeContainer.eq(nextIndex);
        let height = $el.height();
        let viewFactor = height * this.viewFactor;
        let { top } = $el.offset();

        if (direction === 'down') {
            scrollTop = this.winScrollTop + this.$win.height();
            elOffset = top + viewFactor;

            return scrollTop > elOffset;
        } else {
            elOffset = top + height - viewFactor;
            return this.winScrollTop < elOffset;
        }
    }*/

    /**
     * Determines if the next element who's index match has
     * completely entered the viewport
     * @deprecated
     * @param  {Number}  nextIndex
     * @param  {String}  direction
     * @return {Boolean}
     */
    /*private bottomShapeInView(nextIndex: number, direction: string): boolean {
        // Bail early if no next element
        if (
            is.undefined(nextIndex) ||
            is.undefined(this.$currentShape) ||
            nextIndex < 0
           ) {
            return false;
        }

        // Get measurements
        let scrollTop: number;
        let elOffset: number;
        let height = this.$currentShape.height();
        let viewFactor = height * this.viewFactor;
        let { top } = this.$currentShape.offset();

        if (direction === 'down') {
            scrollTop = this.winScrollTop + this.$win.height();
            elOffset = top + (height/2);

            return scrollTop > elOffset;
        } else {
            elOffset = top - viewFactor;
            return this.winScrollTop < elOffset;
        }
    }*/

    /**
     * Get Scroll Direction
     * @deprecated
     * @returns {String} up|down
     */
    /*private getScrollDirection() {
        this.winScrollTop = this.winScrollTop || 0;

        const scrollingDirection: string = this.$win.scrollTop() > this.winScrollTop ? 'down' : 'up';
        this.winScrollTop = this.$win.scrollTop();

        return scrollingDirection;
    }*/

    /**
     * Get the next elements index on load
     * @deprecated
     * @return {Number}
     */
    /*private getNextIndexOnLoad() {
        let index: number;
        this.$shapeContainer.each((i, el) => {
            if ($(el).offset().top >= this.winScrollTop) {
                index = i;
                return false;
            }
        });

        return index;
    }*/

    /**
     * get the degrees to skew the shapes
     * @deprecated
     */
    /*public getSkewDeg($el): number {
        let hypotenuse: number;
        let angle: number;
        const height: number = $el.height();
        const width: number = this.$win.width();

        // Find the hypotenuse with cosines (a2 = b2 + c2 − 2bc cosA)
        hypotenuse = Math.pow(height, 2) + Math.pow(width, 2) - (2*height*width) * Math.cos(90);
        hypotenuse = Math.sqrt(hypotenuse);

        // Find the skew angle with sines (sin B / b = sin A / a)
        angle = (Math.sin(90)*height) / hypotenuse;
        angle = Math.asin(angle) * 180/Math.PI

        // Round to the nearest tenth
        return +Math.round(10*angle)/10;
    }*/

    /**
     * Animate the shape based on the diven index and direction
     * the user is scrolling
     * @deprecated
     * @param {Number} elIndex
     * @param {String} direction
     */
    /*private animateShape(elIndex: number, direction: string) {
        // Animate the top of the shape if the element enters the viewport
        if (this.topShapeInView(elIndex, direction)) {
            // this.prevShapeIndex = (direction === 'down') ? this.prevShapeIndex+1 : this.prevShapeIndex-1;
            this.nextShapeIndex = (direction === 'down') ? this.nextShapeIndex+1 : this.nextShapeIndex-1;

            this.$currentShape = this.$shapeContainer.eq(elIndex);
            const $elTop = this.$currentShape.find(`${this.shapeSelector}:first`);
            let skewY = this.getSkewDeg($elTop);

            this.buildAnimation({ targets: $elTop[0], skewY });
        }

        /**
         * Animate the bottom of the shape when the element
         * fully enters the viewport
         */
        /*if (this.bottomShapeInView(elIndex, direction)) {
            const $elBottom = this.$currentShape.find(`${this.shapeSelector}:not(:first)`);
            let skewY = this.getSkewDeg($elBottom);

            this.buildAnimation({ targets: $elBottom[0], skewY: -skewY });

            // Void current element to prevent further calls
            this.$currentShape = undefined;
        }
    }*/

    /**
     * Animate previous elements if the user landed somewhere down the page
     * @deprecated
     */
    /*private animatePrevious() {
        if (this.nextShapeIndex > 0) {
            const $prevElements = this.$shapeContainer.slice(0, this.nextShapeIndex);
            const $prevTop: JQuery = $prevElements.find(`${this.shapeSelector}:first`);
            const $prevBottom: JQuery = $prevElements.find(`${this.shapeSelector}:not(:first)`);
            let skewY = this.getSkewDeg($prevTop.first());

            this.buildAnimation({ targets: $prevTop.toArray(), skewY, duration: 0});
            this.buildAnimation({ targets: $prevBottom.toArray(), skewY: -skewY, duration: 0});
        }
    }*/

    /**
     * Build the shape animations
     * @deprecated
     * @param {HTMLElement} $elements
     * @param {Object} opts
     */
    /*private buildAnimation(opts: any) {
        const defaultOpts = {
            easing: 'easeInQuint',
            begin: (anim) => {
                if (anim.began) {
                    this.shapeAnimating = true;
                }
            },
            complete: (anim) => {
                if (anim.completed) {
                    this.shapeAnimating = false;
                }
            }
        }
        let animeOpts = $.extend({}, defaultOpts, opts);

        anime(animeOpts);
    }*/
}
