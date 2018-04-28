import * as $ from 'jquery';

import { ScrollControl } from '@core/helpers'
import BaseModule from '@core/base-module';
import PrevContentOverlap from '@service/prev-content-overlap';

interface ElementRectI {
    top: number;
    bottom: number;
    height: number;
}

interface SectionMetaI extends ElementRectI {
    id: string;
    el: HTMLElement;
    $shape: JQuery;
    color: string;
}

/**
 * This class attaches homepage sections to the shape fixed on the background
 * Shape should be scale(1) when at the top of a section and scale(0) at the bottom.
 * There is a hanging circle shape that acts as a transition point.
 * this small circle color changes when to that sections color before expanding that sections shape.
 */
export default class HomeBackShape extends BaseModule{
    private $main: JQuery = $.hook('home-back-shape');
    private $shapeCollection: JQuery = $.hook('home-back-shape-shape');
    // Last shape should always be transition circle.
    private $transitionCircle: JQuery = this.$shapeCollection.last().find('path');
    private sectionStartPoint: ElementRectI;
    private $sections: JQuery = $.hook('home-sections');
    private $footer: JQuery = $.hook('footer');
    private sectionsMeta: SectionMetaI[] = [];

    private startHideClass: string = 'home-back-shape--hidden';
    private activeClass: string = 'home-back-shape__shape-wrap--active';
    private prevContentOverlap: PrevContentOverlap = new PrevContentOverlap(this.$main, this.$footer);

    // index of current section
    private currentSection: SectionMetaI;
    private visible: boolean = false;

    /**
     * Store some initial meta data for each section
     */
    constructor(){
        super();
        this.setSectionStartPoint();
        // store inital section meta data
        this.$sections.each( this.setSectionMetadata.bind(this) );
        // $(document).on('HomeVideo.finished', this.moveShapeIntoView.bind(this, false));
    }

    public throttleScroll() {
        this.updateShape();
        // Add hidden class when scrolling to the top
        this.toggleShapeVisibility()
    }

    // use transition circle to determin active section
    private setSectionStartPoint() {
        let {height, top, bottom}:ElementRectI = this.getBoundingRect(this.$transitionCircle[0]);

        if (this.visible == false) {
            height -= $(window).height();
            top -= $(window).height();
            bottom -= $(window).height();
        }

        this.sectionStartPoint = {height, top, bottom}
    }

    private toggleShapeVisibility () {
        // show
        if ($(window).scrollTop() >= 350 && !this.visible) {
            this.visible = true;
            this.moveShapeIntoView(true);
        }

        // hide
        if ($(window).scrollTop() <= 700 && this.visible) {
            this.visible = false;
            this.moveShapeIntoView(false);
        }
    }

    private moveShapeIntoView(show) {
        // console.log('moveShapeIntoView', {show, scrollTop: $(window).scrollTop()});
        if (show) {
            this.$main.removeClass(this.startHideClass);
        } else {
            this.$main.addClass(this.startHideClass);
        }
    }

    private updateShape() {
        this.currentSection = this.updateCurrentSection();
        console.log(this.currentSection)

        // skip update if no section found
        // this may happen right before a section switches
        if (!this.currentSection) {
            return false;
        }

        const percentage:number = (this.currentSection.bottom/this.currentSection.height)
        this.adjustShapeScale(percentage);
    }

    private adjustShapeScale(percentage: number) {
        if (!this.currentSection.$shape.hasClass(this.activeClass)) {
            this.$shapeCollection.removeClass(this.activeClass)
            this.currentSection.$shape.addClass(this.activeClass)
        }

        this.$transitionCircle
            .removeClass(this.removeFillColor.bind(this))
            .addClass(this.fillColorClass(this.currentSection.color));
        this.currentSection.$shape.css('transform', `scale(${percentage})`);
    }

    /**
     * Get section shape is in
     */
    private updateCurrentSection (): SectionMetaI {
        // This should only reutn one item
         return this.sectionsMeta.filter(this.findCurrentSection.bind(this))[0];
    }

    private findCurrentSection(value:SectionMetaI, index: number) {
        const {top, bottom, height}: ElementRectI = this.getBoundingRect(value.el);
        value.top = top;
        value.bottom = bottom;
        value.height = height;

        return (value.top <= this.sectionStartPoint.bottom) && (value.bottom >= this.sectionStartPoint.bottom);
    }

    /**
     * Store sections top bottom positions, Called by getSectionsMetadata
     * @param {number}      i  [description]
     * @param {HTMLElement} el [description]
     */
    private setSectionMetadata(i:number, el:HTMLElement) {
        const id:string = el.getAttribute('id');
        const $shape: JQuery = this.$shapeCollection.filter(`[data-section-id="${id}"]`);
        const {top, bottom, height }: ElementRectI = this.getBoundingRect(el);
        const color: string = el.getAttribute('data-section-color');

        this.sectionsMeta.push({id, el, $shape, color, top, bottom, height });
    }

    /**
     * Generate fill color class
     * @param  {string} color
     * @return {string}
     */
    private fillColorClass(color: string): string {
        return `u-fill-${color}`;
    }

    private getBoundingRect(el:HTMLElement): ElementRectI {
        const {height, top, bottom}: ElementRectI = el.getBoundingClientRect();
        return { height, top, bottom }
    }

    /**
     * Replace transition cirlce fill class
     * @param  {number} index     [index position of the element in the set]
     * @param  {string} className [the old class value]
     * @return {string}           [the new class value]
     */
    private removeFillColor(index: number, className: string): string {
        const classToRemove = className.replace(/^(.*)(u-fill-\w.*)(\s.*)?$/, `$2`);
        return classToRemove;
    }
}
