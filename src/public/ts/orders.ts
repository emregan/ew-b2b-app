import * as $ from 'jquery';
import { App } from '@core/app';

/** Modules */

/** Foundation Plugins */
import { Foundation } from 'foundation-sites/js/foundation.core';
import { Accordion } from 'foundation-sites/js/foundation.accordion';
import { Tooltip } from 'foundation-sites/js/foundation.tooltip';
import { Reveal } from 'foundation-sites/js/foundation.reveal';

const app = new App({
    modules: {
    },
    foundationPlugins: {
        Accordion,
        Tooltip,
        Reveal
    }
});