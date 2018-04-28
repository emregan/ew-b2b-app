import * as $ from 'jquery';
import DropCap from '@service/drop-cap';
import BaseModule from '@core/base-module';

export default class ExpandableList extends BaseModule {
    private open:JQuery = $.hook('expandable-list-open');
    private close:JQuery = $.hook('expandable-list-close');
    private content:string = $.hookStr('expandable-list-content');

    private accordionData:string = '[data-accordion]';

    protected $closeIcon: JQuery;

    constructor(){
        super();
        this.$closeIcon = $.hook('subjects-list__close-icon');
        this.initClick();

    }

    private initClick(){
        this.close.on('click', this.hideContent.bind(this))
        this.$closeIcon.on('click', this.closeAccordian.bind(this));
    }

    private hideContent(e:JQueryEventObject){
        const accordion = $(e.currentTarget).parents(this.accordionData)
        accordion.foundation('up', $(e.currentTarget).parent());
    }

    protected closeAccordian(e) {
        e.preventDefault();
        this.open.click();
    }
}
