import * as $ from 'jquery';

import BaseModule from '@core/base-module';
import PrevContentOverlap from '@service/prev-content-overlap';
import { Foundation } from 'foundation-sites/js/foundation.core';

/**
 * Base nav class to declared shared variables between mobile
 * and desktop classes
 */
export default class StoryNav extends BaseModule {
    protected $navContainer: JQuery = $.hook('story-nav-sections');
    protected $nav: JQuery = $.hook('story-nav-list');
    private $footer: JQuery = $.hook('footer');
    protected $navigation: JQuery = $.hook('nav');
    private options: any = this.magellanOptions();
    private magellan: any = this.initMagellan();
    private prevContentOverlap: PrevContentOverlap = new PrevContentOverlap(this.$nav, this.$footer);

    constructor() {
        super();
    }

    private initMagellan(): any {
        return new Foundation.Magellan(this.$nav, this.options);
    }

    // public throttleScroll() {
    //     this.prevContentOverlap.track();
    // }

    public debounceResize() {
        this.magellan.reflow()
    }

    private magellanOptions() {
        const threshold: number = this.$navigation.height();
        const offset: number = 0;
        const activeClass = 'story-nav__section-name--active';

        return {
            threshold,
            offset,
            activeClass
        }
    }

}
