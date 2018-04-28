import * as $ from 'jquery';

import * as anime from 'animejs';

import { ScrollControl } from '@core/helpers'
import Brightcove from '@service/brightcove';

import BaseModule from '@core/base-module';

export default class HomeSubpageIntro extends BaseModule{
    private $open: JQuery = $.hook('home-modal-open');
    private $modal: JQuery = $.hook('home-modal');
    private $videoTemplates: JQuery = $.hook('home-modal-videos');

    private videoID: string =  'video-id';
    private accountId: string =  'account-id';

    private videos: any = {};
    private brightcove:Brightcove = new Brightcove(this.$modal);

    private popupOptions: any = {
        type: 'iframe',
        preloader: true,
        fixedContentPos: true,
        overflowY: 'hidden',
        callbacks: {
            open: this.modalOpen.bind(this),
            close: this.modalClose.bind(this),
          }
    }

    constructor(){
        super();
        this.initPopup();
    }

    private initPopup(){
        this.$open.magnificPopup(this.popupOptions);
    }

    private modalOpen(e:JQueryEventObject){
        ScrollControl.lock();
    }

    private modalClose(e:JQueryEventObject){
        ScrollControl.unlock();
    }
}
