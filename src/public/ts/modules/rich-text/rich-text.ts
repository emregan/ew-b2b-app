import * as $ from 'jquery';
import DropCap from '@service/drop-cap';
import BaseModule from '@core/base-module';

export class RichText extends BaseModule {
    private $el:JQuery = $.hook('rich-text');

    constructor() {
        super();
        let dropCap = new DropCap(this.$el);
    }
}
