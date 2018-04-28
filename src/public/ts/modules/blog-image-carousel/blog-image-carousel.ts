import * as $ from 'jquery';
import CoreSlider from '@core/slider';


export class BlogImageCarousel extends CoreSlider {

    constructor() {
        super();

        // this.setElements($.hook('blog-image-carousel'))
        this.setOption('infinite', false);
        this.setOption('dots', true);
        this.setOption('dotsClass', 'blog-image-carousel__dots');

        this.setElements($.hook('blog-image-carousel'));

        this.init();
    }
}
