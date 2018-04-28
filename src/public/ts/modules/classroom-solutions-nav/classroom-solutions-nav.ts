import * as $ from 'jquery';
import * as is from 'is_js';

import BaseModule from '@core/base-module';
import { Foundation } from 'foundation-sites/js/foundation.core';
import { ScrollControl, getBreakpoint } from '@core/helpers'

export default class ClassroomSolutionsNav extends BaseModule {

    private $trigger: JQuery = $.hook('classroom-solutions-subjects-trigger');
    private $content: JQuery = $.hook('classroom-solutions-subjects-content');
    private $close: JQuery = $.hook('classroom-solutions-subjects-close');

    private openClass: string = 'classroom-solutions-subjects__open';
    private isOpen: boolean = false;

    private magellan: any = this.initPlugins();

    constructor() {
        super();
        this.initEvent();
    }

    private initEvent() {
        this.$trigger.on('click', this.toggle.bind(this))
        this.$close.on('click', this.close.bind(this))
    }

    private toggle(e: JQueryEventObject) {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public open(e?: JQueryEventObject) {
        this.isOpen = true;
        this.$trigger.addClass(this.openClass);
        this.$content.addClass(this.openClass);

        if (getBreakpoint() == 'small') {
            ScrollControl.lock()
        }
    }

    public close(e?: JQueryEventObject) {
        this.isOpen = false;
        this.$trigger.removeClass(this.openClass);
        this.$content.removeClass(this.openClass);

        if (getBreakpoint() == 'small') {
            ScrollControl.unlock()
        }
    }

    private initPlugins(opts: any = {}) {
        if (this.$content.length > 0) {
            return new Foundation.Magellan(this.$content, opts);
        }
    }
}
