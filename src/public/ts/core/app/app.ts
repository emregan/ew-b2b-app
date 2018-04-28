import * as $ from 'jquery';
import 'flexibility';
import 'calc-polyfill';
import 'picturefill';
import { MDCTextField } from '@material/textfield';
import { MDCSelect } from '@material/select';
import { MDCCheckbox, MDCCheckboxFoundation } from '@material/checkbox';
import * as is from 'is_js';
import 'jquery-validation';
import 'select2';

import { Foundation } from 'foundation-sites/js/foundation.core';
import { OffCanvas } from 'foundation-sites/js/foundation.offcanvas';
import { rtl, GetYoDigits, transitionend } from 'foundation-sites/js/foundation.util.core';
import { Box } from 'foundation-sites/js/foundation.util.box';
import { Keyboard } from 'foundation-sites/js/foundation.util.keyboard';
import { MediaQuery } from 'foundation-sites/js/foundation.util.mediaQuery';
import { Motion, Move } from 'foundation-sites/js/foundation.util.motion';
import { Nest } from 'foundation-sites/js/foundation.util.nest';
import { onImagesLoaded } from 'foundation-sites/js/foundation.util.imageLoader';
import { Timer } from 'foundation-sites/js/foundation.util.timer';
import { Touch } from 'foundation-sites/js/foundation.util.touch';
import { Triggers } from 'foundation-sites/js/foundation.util.triggers';
import { Positionable } from 'foundation-sites/js/foundation.positionable'
import { Plugin } from 'foundation-sites/js/foundation.plugin';
import { Dropdown } from 'foundation-sites/js/foundation.dropdown';
import { Tabs } from 'foundation-sites/js/foundation.tabs';
import { Magellan } from 'foundation-sites/js/foundation.magellan';
import { Tooltip } from 'foundation-sites/js/foundation.tooltip';
import { Accordion } from 'foundation-sites/js/foundation.accordion';
import { Reveal } from 'foundation-sites/js/foundation.reveal';

/***********************************************************************
 * Global includes
 * These are share modules like jquery extensions, polyfills, etc
 * What ever is define here should be assigned to the window variable
 ***********************************************************************/
import '@core/jquery-extensions';
import '@core/polyfills';

import { BrowserDetect } from '@core/browser-detect';
import { RollbarInit } from '@core/rollbar-init';
import { EventsBinding } from '@core/event-binding';
import BaseModule from '@core/base-module';

import Navigation from '@module/navigation'
import Footer from '@module/footer'
// import DefaultValidations from '@module/default-navigations'

interface ModulesInterface{
    [key:string]: BaseModule;
}

interface AppClasses{
    modules: object;
    animations?: object;
    foundationPlugins?: object;
    revealConf?: object;
}

export class App {
    public modules:ModulesInterface = {};
    public browser:BrowserDetect = new BrowserDetect();
    private rollbar:RollbarInit = new RollbarInit();
    private events:EventsBinding = new EventsBinding();

    constructor(private appClasses:AppClasses) {
        console.info(process.env)
        $.ready.then(this.docReady.bind(this))
        $(window).on('load', this.docLoaded.bind(this))
        window['initMDCplugins'] = this.initMDCplugins;
    }

    private docLoaded(){
        $('body').removeClass('loading');
		  
    }

    private docReady(): void {
        this.initGlobalFoundationPlugins();
        this.initGlobalModules();

        /** Initialize Material Design Component UIs */
        this.initMDCplugins();

        if (this.appClasses.foundationPlugins) {
            $.each(this.appClasses.foundationPlugins, this.bindFoundationPlugin.bind(this))
            $(document).foundation();
        }

        if (this.appClasses.modules) {
            $.each(this.appClasses.modules, this.initModule.bind(this))
        }

        this.events.attach();

    }

    private initGlobalFoundationPlugins(){
        this.appClasses.foundationPlugins = this.appClasses.foundationPlugins || {};
        Foundation.addToJquery($);

        if (!this.appClasses.foundationPlugins['OffCanvas']) {
            this.bindFoundationPlugin('OffCanvas', OffCanvas);   
        }
        
    }

    private initGlobalModules(){
        this.appClasses.modules = this.appClasses.modules || {};
        if (!this.appClasses.modules['Navigation']) {
            this.appClasses.modules['Navigation'] = Navigation;
        }

        if (!this.appClasses.modules['Footer']) {
            this.appClasses.modules['Footer'] = Footer;
        }
    }

    private bindFoundationPlugin(pluginName:string, plugin): void{
        Foundation.plugin(plugin, pluginName);
    }

    /**
     * Inits all MDC plugins
     */
    private initMDCplugins() {
        // Text field component
        $('.mdc-text-field:not(.mdc-text-field--upgraded)').each((i, el) => {
            $(el).data('mdc-text-field', new MDCTextField(el));
        });

        // Checkbox component
        $('.mdc-checkbox:not(.mdc-checkbox--upgraded)').each((i, el) => {
            $(el).data('mdc-checkbox', new MDCCheckbox(el));
        });

        $('.select2-select:not(.select2-select__active)').each((i, el) => {
            const $el = $(el);

            $el.addClass('select2-select__active').select2({
                placeholder: $el.data('placeholder') || '',
                width: '100%'
            });
        });
    }

    private initModule(moduleName: string, module): void{
        // Initiate module,
        // Passing the app instance to moduels
        // allowing module to access other modules and shared content
        this.modules[moduleName] = new module(this);

        // Bind resize/scroll event if defined
        // this.bindEvent(moduleName);
    }

    private bindEvent(moduleName){
        const moduleClass = this.modules[moduleName];

        /** Bail early if there's no module */
        if (is.undefined(moduleClass)) {
            return;
        }

        if(moduleClass.debounceResize() !== false){
            // this.events.makeEventBind('resize', 'debounce', moduleClass.debounceResize.bind(moduleClass));
        }

        if(moduleClass.debounceScroll() !== false){
            // this.events.makeEventBind('scroll', 'debounce', moduleClass.debounceScroll.bind(moduleClass));
        }

        if(moduleClass.throttleResize() !== false){
            // this.events.makeEventBind('resize', 'throttle', moduleClass.throttleResize.bind(moduleClass));
        }

        if(moduleClass.throttleScroll() !== false){
            // this.events.makeEventBind('scroll', 'throttle', moduleClass.throttleScroll.bind(moduleClass));
        }
    }
}
