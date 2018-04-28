import * as $ from 'jquery';
import BaseModule from '@core/base-module';
import { breakpoints } from '@core/helpers'

interface ColumnsI{
    [key:string]: number;
    large: number;
    medium: number;
}

export class PinnedArticles extends BaseModule{
    private items:JQuery = $.hook('pinned-articles-item');
    private tabletImage:JQuery = $.hook('pin-articles-tablet-image');

    constructor(){
        super();
    };

    public debounceResize(){
        this.updateSpacing();
    }

    private updateSpacing(){
        const windowWidth = $(window).width();
        if ( (windowWidth >= breakpoints.medium) && (windowWidth < breakpoints.large) ) {
            this.adjustSpacing()
        } else {
            this.resetSpacing();
        }
    }

    private adjustSpacing(){
        switch (this.items.length) {
            case 2:
                this.adjustFor2()
            break;

            case 3:
            case 4:
                this.adjustFor2Plus()
            break;
        }
    }

    private adjustFor2(){
        const article2:JQuery = this.items.eq(1);
        const image = article2.find('.pinned-articles__image');
        const content = article2.find('.pinned-articles__content');
        const diff = Math.abs(image.position().top - content.position().top);
        article2.css('margin-top', -diff);
    }

    private adjustFor2Plus(){
        const article2:JQuery = this.items.eq(2);
        const marginBottom:number = Number(this.items.css('margin-bottom').replace('px', ''));

        const article2Negative:number = article2.position().top - ( this.tabletImage.position().top + this.tabletImage.height() + marginBottom);
        article2.css('margin-top', -article2Negative);

        // Handle 4th item
        if (this.items.length > 3) {
            const article3:JQuery = this.items.eq(3);
            const article3Negative:number = article2Negative + ( article3.position().top - ( article2.position().top + article2.height() + marginBottom ) )
            article3.css('margin-top', -article3Negative);
        }
    }

    private resetSpacing(){
        this.items.css('margin-top', '')
    }
}
