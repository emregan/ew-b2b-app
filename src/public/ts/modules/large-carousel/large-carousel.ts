import * as $ from 'jquery';
import CoreSlider from '@core/slider';
import Brightcove from '@service/brightcove';


export class LargeCarousel extends CoreSlider {
    private videos:Brightcove;
    constructor() {
        super();

        // this.setElements($.hook('blog-image-carousel'))
        this.setOption('infinite', false);
        this.setOption('dots', true);
        this.setOption('dotsClass', 'large-carousel__dots');

        this.setElements($.hook('large-carousel'));
        this.videos = new Brightcove($(this.elements.main));
        this.init();
    }

    protected initListeners(){
        // On before slide change
        this.slider.on('beforeChange', this.onBeforeChange.bind(this));
    }

    private onBeforeChange (event, slick, currentSlide, nextSlide){
        const video = $(slick.$slides[currentSlide]).find('video');
        this.videos.pause(video.attr('id'))
    }
}
