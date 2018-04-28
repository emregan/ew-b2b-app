import * as $ from 'jquery';
import BaseModule from '@core/base-module';

export class CoreAnimations extends BaseModule {
    protected elements:JQuery;
    protected selector:string = '[data-js-animate]';
    protected disabledSelector:string = '[disabled],[class*="disabled"]';
    private warned = [];

    constructor(protected animations:Object) {
        super();
    }

    /**
     * Initialize animations
     */
    public init() {
        this.getElements();

        this.bindAnimations();

        // Rebind animation for XHR request
        // This will execute after every XHR Complete
        $(document).ajaxComplete(this.rebindEvents.bind(this));
    }

    protected rebindEvents() {
        setTimeout(()=> {
            this.getElements();
            this.bindAnimations();
        }, 250)
    }

    /**
     * Get all elements that should animate
     * @returns Array<HTMLElement>
     */
    protected getElements() {
        this.elements = $(`${this.selector}:not(${this.disabledSelector})`);
    }

    /**
     * Loops through all elements and binds their animations
     * @returns void
     */
    protected bindAnimations() {
        // console.log(this.elements)
        // debugger;
        this.elements.each((i, el) => {
            let $el = $(el);
            $el.attr('id', `ui-animate-${i}`);

            let animationName = this.getAnimationName($el);

            this.initAnimation($el, animationName)
        });
    }

    /**
     * Get the animation name to match against a method in the class
     * @param  {Jquery} $el
     * @return {string}
     */
    protected getAnimationName($el):string {
        let animationName = $el.data('js-animate');
        // Trim `ui-` part from data name
        animationName = animationName.replace('ui-', '');
        // Replace modifier separators for single hyphen
        animationName = animationName.replace('--', '-');
        // Camel Case data name
        animationName = animationName.replace(/-([a-z])/g, (g) => g[1].toUpperCase() );

        return animationName;
    }

    /**
     * Initialize the element's matching animation class otherwise
     * log an error.
     * @param {JQuery} $el
     * @param {string} name
     */
    initAnimation($el:JQuery, name:string) {
        if (!(name in this.animations)) {
            if (this.warned.indexOf(name) == -1) {
                this.warned.push(name)
                console.info(`Class ${name} does not exist, check for HTML typos`);
            }
            return;
        }

        let animInstance = new this.animations[name]($el);
        $el.data('animate', animInstance);
    }
}
