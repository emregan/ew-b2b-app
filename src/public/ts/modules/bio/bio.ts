import * as $ from 'jquery';
import * as anime from 'animejs';

import { ScrollControl } from '@core/helpers'

import BaseModule from '@core/base-module';

export default class Bio extends BaseModule{
    private open: string = $.hookStr('open-bio');
    private modal: JQuery = $.hook('bio-modal');
    private content: JQuery = $.hook('bio-content');

    private nextSelect: string = $.hookStr('next-bio');
    private prevSelect: string = $.hookStr('prev-bio');
    private slugAttr: string = 'data-bio-slug';

    constructor(){
        super();
        $(document).on('open.zf.reveal', this.modalOpen.bind(this));
        $(document).on('closed.zf.reveal', this.modalClose.bind(this));
        this.initClick();
    }

    private initClick(){
        $(document).on('click', this.open, this.openModal.bind(this))
    }

    private openModal(e:JQueryEventObject) {
        const $el: JQuery = $(e.currentTarget);
        const slug: string = $el.attr(this.slugAttr);
        const fetchModal: JQueryXHR = $.get('/xhr/bio/' + slug);
        const next: string = this.getSibling('next', slug);
        const prev: string = this.getSibling('prev', slug);

        fetchModal.then(
            (response)=>this.fillModal(response, next, prev)
        );
    }

    private fillModal(response: string, next: string, prev: string){
        this.content.html(response);
        this.content.find(this.nextSelect).attr(this.slugAttr, next);
        this.content.find(this.prevSelect).attr(this.slugAttr, prev);

        this.modal.foundation('open');
    }

    private getSibling(direction: string, slug: string){
        const $el: JQuery = $(`${this.open}[${this.slugAttr}="${slug}"]`)

        if (direction == 'next') {
            return $el.next().attr(this.slugAttr);
        } else {
            return $el.prev().attr(this.slugAttr);
        }
    }

    private modalOpen(e:JQueryEventObject){
        ScrollControl.lock();
    }

    private modalClose(e:JQueryEventObject){
        ScrollControl.unlock();
    }
}
