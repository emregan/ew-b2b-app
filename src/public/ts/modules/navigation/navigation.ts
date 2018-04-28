import * as $ from 'jquery';
import DropCap from '@service/drop-cap';
import BaseModule from '@core/base-module';
import TruncText from '@service/truncate';
import { ScrollControl, breakpoints } from '@core/helpers'

export default class Navigation extends BaseModule {
    private main: JQuery = $.hook('nav');
    private account: JQuery = $.hook('nav-account');
    private accountModal: JQuery = $.hook('nav-modal-account');
    private cart: JQuery = $.hook('nav-cart');

    private navShrinkClass: string = 'navigation--shrink';
    private $navigationNotice: JQuery = $.hook('navigation__notice');

    private navPosition: number = this.main.height();

    constructor() {
        super();
        this.initListerners();
    }

    private initListerners() {
        $(document).on("opened.zf.offcanvas", this.canvaslOpen.bind(this));
        $(document).on("closed.zf.offcanvas", this.canvasClose.bind(this));

        $(window).on('click', this.closeAccountModal.bind(this));
        
        this.account.on('click', this.openAccountModal.bind(this));
    }

    private openAccountModal(e) {
        e.preventDefault();

        e.stopPropagation();

        this.accountModal.addClass('modal-account__open');
    }

    private closeAccountModal() {
        this.accountModal.removeClass('modal-account__open');
    }

    private canvaslOpen(e: JQueryEventObject) {
        ScrollControl.lock();
    }

    private canvasClose(e: JQueryEventObject) {
        ScrollControl.unlock();
    }
    
    public debounceScroll(e:JQueryEventObject) {
        this.toggleNavSize();
    }

    public debounceResize(e:JQueryEventObject) {

    }

    toggleNavSize() {
        const windowPosition: number = $(window).scrollTop();
        if (windowPosition > this.navPosition) {
            this.main.addClass(this.navShrinkClass);
        } else {
            this.main.removeClass(this.navShrinkClass);
        }
    }
}
