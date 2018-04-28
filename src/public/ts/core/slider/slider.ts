import * as $ from 'jquery';
import 'slick-carousel';
import BaseModule from '@core/base-module';
import { createID } from '@core/helpers'

interface SliderElements {
    main?:string;
    dots?:string;
    arrows?:string;
}

export default class CoreSlider extends BaseModule {
    protected slider:JQuery;
    protected elements:SliderElements;

    private options:Object;
    protected sliderName:string;

    constructor() {
        super();
        this.options = this.getDefaultOpts();
    }

    /**
     * Returns object with default Slick slider settings
     * @return {Object}
     */
    private getDefaultOpts() {
        return {
            dots: false,
            speed: 300,
            arrows: false,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            draggable: false,
            useTransform: false
        }
    }

    protected setElements($el:JQuery) {
        this.elements = this.elements || {};

        this.sliderName = $el.attr('data-js-hook');
        this.elements.main = $.hookStr(this.sliderName +'__slider');
        this.elements.dots = $.hookStr(this.sliderName +'__dots');
        this.elements.arrows = $.hookStr(this.sliderName +'__arrows');

        this.slider = $(this.elements.main);

        this.setSliderIDs();
    }

    protected init() {
        this.initListeners();

        this.slider.slick(this.options);
    }

    protected initListeners() {
        // Bind event listeners
    }

    /**
     * Sets Slick slider options
     * @param {string} name
     * @param {string|number|boolean} val
     * @returns {void}
     */
    protected setOption(name:string, val?:string|number|boolean) {
        this.options[name] = val;
    }

    /**
     * Get Slick slider option
     * @param {string} name
     */
    protected getOption(name:string) {
        return (name in this.options) ? this.options[name] : null;
    }

    protected setSliderIDs() {
        this.slider.each((i, slider) => {
            $(slider).data('slider-id', createID());
        })
    }
}
