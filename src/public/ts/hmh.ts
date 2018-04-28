import * as Shuffle from 'shufflejs';
import * as $ from 'jquery'
import handlebars from 'handlebars';
import 'select2';
import 'jquery-validation';
import 'jquery-mask-plugin';
import 'jquery-ui/ui/widgets/autocomplete';
import 'foundation-datepicker';
import DefaultValidations from '@service/default-validations';

import { App } from '@core/app';

/** Modules */

/** Foundation modules */
import { Accordion } from 'foundation-sites/js/foundation.accordion';
import { AccordionMenu } from 'foundation-sites/js/foundation.accordionMenu';
import { Box } from 'foundation-sites/js/foundation.util.box'
import { Equalizer } from 'foundation-sites/js/foundation.equalizer';
import { Interchange } from 'foundation-sites/js/foundation.interchange';
import { MediaQuery } from 'foundation-sites/js/foundation.util.mediaQuery';
import { OffCanvas } from 'foundation-sites/js/foundation.offcanvas';
import { onImagesLoaded } from 'foundation-sites/js/foundation.util.imageLoader';
import { ResponsiveAccordionTabs } from 'foundation-sites/js/foundation.responsiveAccordionTabs';
import { Reveal } from 'foundation-sites/js/foundation.reveal';
import { Tabs } from 'foundation-sites/js/foundation.tabs';
import { Tooltip } from 'foundation-sites/js/foundation.tooltip';

const app = new App({
    'modules': {
    },
    'foundationPlugins': {
        Accordion,
        AccordionMenu,
        Box,
        Equalizer,
        Interchange,
        MediaQuery,
        OffCanvas,
        onImagesLoaded,
        ResponsiveAccordionTabs,
        Reveal,
        Tabs,
        Tooltip
    }
});

// Make plugins global
window['$'] = window['jQuery'] = $;
window['Shuffle'] = Shuffle;
window['Handlebars'] = handlebars;

// initialize default validations
new DefaultValidations();
