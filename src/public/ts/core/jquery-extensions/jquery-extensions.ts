/**
 * Usage
 * $.extensionName(params)
 */
import * as $ from 'jquery';

import {hook, hookStr} from './hook';
import debounce from './debounce';
import throttle from './throttle';

$.extend($, {hook, hookStr, debounce, throttle});
