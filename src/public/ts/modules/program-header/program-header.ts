import * as $ from 'jquery';
import * as is from 'is_js';
import * as anime from 'animejs';

import BaseModule from '@core/base-module';

// @TODO import videojs typein
declare const videojs:any;

import Brightcove from '@service/brightcove';

export default class ProgramHeader extends BaseModule {
    private playerSelector: string = `video${$.hookStr('brightcove-video')}`;
    private $videoContainer: JQuery = $.hook('program-header__video');
    private $headerLogo: JQuery = $.hook('program-header__image-logo');
    private animDuration: number = 500;
    private $win: JQuery = $(window);
    private programPlayer: any;
    private videos: Brightcove;

    constructor() {
        super();

        this.videos = new Brightcove(this.$videoContainer);
        this.programPlayer = this.getProgramPlayer();
        this.initListeners();
    }

    private initListeners() {
        if (this.programPlayer) {
            this.programPlayer.on('ended', this.onPlayerEnd.bind(this));
        }
    }

    /**
     * Method called when the player playback ends
     * @param {Object} e
     */
    private onPlayerEnd(e) {
        this.showLogo();
        this.showHeaderImage();
    }

    /**
     * Shows the logo image from bottom up if it exist
     */
    private showLogo() {
        if (this.$headerLogo.length > 0) {
            anime({
                targets: this.$headerLogo[0],
                translateX: ['-50%', '-50%'],
                translateY: ['100%', '-50%'],
                duration: this.animDuration,
                easing: 'easeOutQuad',
            });
        }
    }

    /**
     * Fades out video container to expose the header image
     */
    private showHeaderImage() {
        anime({
            targets: this.$videoContainer[0],
            duration: this.animDuration,
            delay: 0,
            easing: 'easeOutQuad',
            opacity: 0,
        });
    }

    /**
     * Gets the program header video player from Brightcove service
     */
    private getProgramPlayer() {
        const $videoPlayer = this.$videoContainer.find(this.playerSelector);
        const playerID: string = $videoPlayer.attr('id');

        return this.videos.getPlayer(playerID);
    }
}
