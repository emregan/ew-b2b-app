import * as $ from 'jquery';
import SubpageUrl from './subpage-url';

/**
 * Base nav class to declared shared variables between mobile
 * and desktop classes
 */
export default class BaseSideNav extends SubpageUrl {
    protected ACTIVE_CLASS: string = 'program-header__sections--active';
    protected $navContainer: JQuery = $.hook('program-header__sections');
    protected $nav: JQuery = $.hook('program-header__sections-list');
    protected $navigation: JQuery = $.hook('nav');
    // Only get Magellan anchor,
    protected $navItem: JQuery = this.$nav.find('a[rel="nofollow"]');
    protected navIndex: number;
    protected hasElments: boolean = false
    protected magellan: any;

    constructor() {
        super();
        this.$nav.on('update.zf.magellan', this.updateSubPage.bind(this));
    }

    protected initPlugins(opts: any = {}) {
        if (this.$nav.length > 0) {
            this.hasElments = true;
            this.magellan = new Foundation.Magellan(this.$nav, opts);
            this.goToLoc()
        }
    }

    protected goToLoc() {
        const section:string = this.getSubSection();

        if (section) {
            this.magellan.scrollToLoc(`#${section}`);
        }
    }

    protected adjustFirstPoint() {
        if (this.magellan.points[0] != 0) {
            this.magellan.points[0] = 0;
            this.magellan._updateActive();
        }
    }

    public debounceResize() {
        this.magellan.reflow();
        this.adjustFirstPoint();
    }
}
