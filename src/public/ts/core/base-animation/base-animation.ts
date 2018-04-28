import * as is from 'is_js';
import * as $ from 'jquery';
import * as anime from 'animejs';

abstract class BaseAnimation {
    public id:string;
    public anime;
    public animEnter;
    public animEnterTimeline;
    public animLeave;
    public animLeaveTimeline;
    public animDown;
    public animDownTimeline;
    public animUp;
    public animUpTimeline;

    constructor(public $el:JQuery) {
        this.id = `#${this.$el.attr('id')}`;
        this.anime = anime;
        this.bindEvents();
    }

    abstract mouseEnter(e);
    abstract mouseLeave(e);
    abstract mouseDown(e);
    abstract mouseUp(e);

    private bindEvents() {
        const disabled = this.$el.data('animate-disabled');

        // Bail out if auto animations are disabled
        if (is.not.undefined(disabled)) {
            return;
        }

        $(document).on({
            mouseenter: this.mouseEnter.bind(this),
            mouseleave: this.mouseLeave.bind(this),
            mousedown: this.mouseDown.bind(this),
            mouseup: this.mouseUp.bind(this),
        }, this.id);
    }

    /**
     * Revers the order value of a property if it's an array
     * @param {Object} obj
     */
    protected reverseProps(obj) {
        let reverseProps:Object = $.extend(true, {}, obj);
        $.each(reverseProps, (key:string, val:any) => {
            if (is.undefined(key) || is.undefined(val)) {
                return true;
            }

            if (is.array(val)) {
                reverseProps[key] = val.reverse();
            } else {
                reverseProps[key] = val;
            }
        });

        return reverseProps;
    }
}

export default BaseAnimation;
