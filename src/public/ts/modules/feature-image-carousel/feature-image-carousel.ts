import * as $ from 'jquery';
import CoreSlider from '@core/slider';
import * as anime from 'animejs';

export default class FeatureCarousel extends CoreSlider {
    private $slider:JQuery;
    private $textSlides:JQuery;
    private sliders:Object = {};
    private transitionSpeed:number = 1000;
    private autoplaySpeed: number = 7000;
    private defaultColor:string;
    private activeColor:string;
    private activeClass:string = 'feature-image-carousel__text--active';

    constructor() {
        super();

        this.setOption('dots', true);
        this.setOption('fade', true);
        this.setOption('accessibility', false);
        this.setOption('speed', this.transitionSpeed);
        this.setOption('autoplaySpeed', this.autoplaySpeed);
        this.setOption('dotsClass', 'feature-image-carousel__dots');

        this.setElements($.hook('feature-image-carousel'));

        this.init();
    }

    protected initListeners() {
        // On before slide change
        this.slider.on('beforeChange', this.onBeforeChange.bind(this));
        this.slider.on('init', this.onInit.bind(this));
    }

    /**
     * Fired before the slide changes
     * @param {Object} event
     * @param {Object} slick
     * @param {number} currSlide
     * @param {number} nextSlide
     */
    private onBeforeChange(event, slick, currSlide:number, nextSlide:number) {
        this.updateContentSlide(slick, currSlide, nextSlide);
        this.animatePrevSlide(slick, currSlide);
        this.navigageToSlide(slick, nextSlide);
    }

    /**
     * On Init set slider specific variables
     * @param {Object} event
     * @param {Object} slick
     */
    private onInit(event, slick) {
        let sliderId = slick.$slider.data('slider-id');
        let $sliderContainer = slick.$slider.parents(`.${this.sliderName}`).attr('id', sliderId);
        this.sliders[sliderId] = {
            $container: $sliderContainer,
            $dots: slick.$dots.children(),
        }

        // Animate initial slide
        this.navigageToSlide(slick, 0);
    }

    /**
     * Update the slide bullet content active state
     * @param {Object}    slick
     * @param {number} nextSlide
     */
    private updateContentSlide(slick:any, currSlide:number, nextSlide:number) {
        let sliderId = slick.$slider.data('slider-id');
        const selector = $.hookStr('feature-image-carousel__text-list');
        let $textSlides = this.sliders[sliderId].$container.find(selector).children();
        this.defaultColor = this.defaultColor || $textSlides.filter(`:not(.${this.activeClass})`).first().css('color');
        this.activeColor = this.activeColor || $textSlides.filter(`.${this.activeClass}`).first().css('color');

        // Animate previous content slide to defautl color
        anime.timeline({ duration: this.transitionSpeed })
            .add({
                targets: $textSlides.eq(currSlide)[0],
                color: this.defaultColor,
            })
            .add({
                targets: $textSlides.eq(currSlide).children()[0],
                backgroundColor: this.defaultColor,
                offset: 0,
                scale: 1
            });

        // Animate upcoming content slide
        anime.timeline({ duration: this.transitionSpeed })
            .add({ targets: $textSlides.eq(nextSlide)[0], color: this.activeColor, delay: this.transitionSpeed/2 })
            .add({ targets: $textSlides.eq(nextSlide).children()[0], backgroundColor: this.activeColor, offset: 0, scale: 1.5, delay: this.transitionSpeed/2 });

        // Remove active class
        $textSlides.removeClass(this.activeClass);
    }

    /**
     * Animate dot back to it's original state
     * @param {Object}    slick
     * @param {number} currSlide
     */
    private animatePrevSlide(slick:any, currSlide:number) {
        let sliderId = slick.$slider.data('slider-id');
        let slider = this.sliders[sliderId];

        // Prev slide dot
        slider.$prevSlideDot = slider.$dots.eq(currSlide);
        slider.$prevSlideDotsProgress = slider.$prevSlideDot.children();

        /**
         * If a user manually selected a slide, the previous animation might still
         * be running, let's stop it
         */
        if (!slider.progressAnimation.completed) {
            slider.progressAnimation.pause();
        }

        // Animate dot
        anime.timeline({
                easing: 'linear',
                duration: this.transitionSpeed/8,
            })
            .add({
                targets: slider.$prevSlideDotsProgress[0],
                delay: this.transitionSpeed/12,
                translateX: ['-100%'],
            })
            .add({
                targets: slider.$prevSlideDot[0],
                offset: 0,
                width: 8
            });
    }

    /**
     * Animates upcoming slide dot
     * @param {Object}    slick
     * @param {number} nextSlide
     */
    private navigageToSlide(slick:any, nextSlide:number) {
        let sliderId = slick.$slider.data('slider-id');
        let slideTimeout = parseFloat(slick.$slides.eq(nextSlide).data('timeout')) * 1000;
        let slider = this.sliders[sliderId];

        // Next slide dot
        slider.$nextSlideDot = slider.$dots.eq(nextSlide);
        slider.$nextSlideDotsProgress = slider.$nextSlideDot.children();

        // Animate dot container
        anime({
            targets: slider.$nextSlideDot[0],
            easing: 'linear',
            delay: this.transitionSpeed/4,
            width: [
                {value: 5, duration: this.transitionSpeed/4},
                {value: 44, duration: this.transitionSpeed/4, easing: 'easeOutBack'},
            ],
            height: [
                {value: 5, duration: this.transitionSpeed/4},
                {value: 8, duration: this.transitionSpeed/12, delay: this.transitionSpeed/4},
            ]
        });

        /**
         * Animate dot progress, this is used to navigate to the next slide based on the set timeout
         * of the current slide. This is also used to check if the animation is running when users
         * manually advance to a next slide
         */
        slider.progressAnimation = anime({
            targets: slider.$nextSlideDotsProgress[0],
            easing: 'linear',
            duration: slideTimeout,
            translateX: ['-100%', '0%'],
            complete: (anim) => {
                slick.slickNext()
            }
        });
    }
}
