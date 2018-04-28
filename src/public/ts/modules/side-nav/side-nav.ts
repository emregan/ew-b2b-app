import { getBreakpoint } from '@core/helpers'
import BaseModule from '@core/base-module';

import SideNavMobile from './side-nav-mobile';
import SideNavDesktop from './side-nav-desktop';

export default class SideNav extends BaseModule {
    private mobileNav: SideNavMobile;
    private desktopNav: SideNavDesktop;

    constructor() {
        super();

        // @TODO create destroy and build methods
        // these should be binding and unbinding on resize
        if (getBreakpoint() == 'small' || getBreakpoint() == 'medium') {
            this.mobileNav = new SideNavMobile();
        } else {
            this.desktopNav = new SideNavDesktop();
        }
    }

    public debounceResize() {
        if (this.mobileNav) {
            this.mobileNav.debounceResize()
        }
        if (this.desktopNav) {
            this.desktopNav.debounceResize()
        }
    }
}
