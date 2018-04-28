import { App } from '@core/app';

/** Modules */

import { Accordion } from 'foundation-sites/js/foundation.accordion';
import { Reveal } from 'foundation-sites/js/foundation.reveal';
import { Magellan } from 'foundation-sites/js/foundation.magellan';
import { Tooltip } from 'foundation-sites/js/foundation.tooltip';

const app = new App({
    modules: {

    },
    foundationPlugins: {
        Accordion,
        Reveal,
        Magellan,
        Tooltip
    },
});
