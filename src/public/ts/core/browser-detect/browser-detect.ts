import * as $ from 'jquery';
import * as  bowser from 'bowser'

export class BrowserDetect {
    // private main:JQuery = $('html');

    constructor(){
        console.log(bowser);

        $('html').attr({
            'data-browser-name': this.get('name'),
            'data-browser-version': this.get('version'),
            'data-browser-os': this.get('os'),
            'data-browser-engine': this.get('engine'),
            'data-browser-mobile': this.get('mobile'),
        });
    }

    public get(type:string){
        let val;
        switch(type){
            case 'version':
                val = this.getVersion();
            break;

            case 'os':
                val = this.getOS();
            break;

            case 'engine':
                val = this.getEngine();
            break;

            case 'mobile':
                val = this.isMobile();
            break

            case 'name':
                val = this.getName();
            break
        }
        return val;
    }

    private getVersion(){
        return bowser.version;
    }

    private getOS(){
        if ( bowser.mac ) {
            return 'mac';
        }

        if ( bowser.windows ) {
            return 'windows';
        }

        if ( bowser.windowsphone ) {
            return 'windowsphone';
        }

        // other than android, chromeos, webos, tizen, and sailfish
        if ( bowser.linux ) {
            return 'linux';
        }

        if ( bowser.chromeos ) {
            return 'chromeos';
        }

        if ( bowser.android ) {
            return 'android';
        }

        // also sets one of iphone/ipad/ipod
        if ( bowser.ios ) {
            return 'ios';
        }

        if ( bowser.blackberry ) {
            return 'blackberry';
        }

        if ( bowser.firefoxos ) {
            return 'firefoxos';
        }

        // - may also set touchpad
        if ( bowser.webos ) {
            return 'webos';
        }

        if ( bowser.bada ) {
            return 'bada';
        }

        if ( bowser.tizen ) {
            return 'tizen';
        }

        if ( bowser.sailfish ) {
            return 'sailfish';
        }

        // osversion - for Android, iOS, Windows Phone, WebOS, Bada, and Tizen. If included in UA string.
        if ( bowser.osversion ) {
            return 'osversion';
        }
    }

    private getEngine(){
        // Chrome 0-27, Android <4.4, iOs, BB, etc.
        if (bowser.webkit) {
            return 'webkit';
        }
        // Chrome >=28, Android >=4.4, Opera, etc.
        if (bowser.blink) {
            return 'blink';
        }
        // Firefox, etc.
        if (bowser.gecko) {
            return 'gecko';
        }
        // IE <= 11
        if (bowser.msie) {
            return 'msie';
        }
        // IE > 1
        if (bowser.msedge) {
            return 'msedge';
        }
    }

    private isMobile(){
        if ( $.type(bowser.mobile) != 'undefined' && bowser.mobile === true ) {
            return true;
        }

        if ( $.type(bowser.tablet) != 'undefined' && bowser.tablet === true ) {
            return true;
        }

        return false;
    }

    private getName(){
        if ( bowser.chrome ){
            return 'chrome'
        }
        if ( bowser.firefox ){
            return 'firefox'
        }
        if ( bowser.msie ){
            return 'msie'
        }
        if ( bowser.msedge ){
            return 'msedge'
        }
        if ( bowser.safari ){
            return 'safari'
        }
        if ( bowser.android ){
            return 'android'
        }
        if ( bowser.ios ){
            return 'ios'
        }
        if ( bowser.opera ){
            return 'opera'
        }

        if ( bowser.phantom ){
            return 'phantom'
        }
        if ( bowser.blackberry ){
            return 'blackberry'
        }
        if ( bowser.webos ){
            return 'webos'
        }
        if ( bowser.silk ){
            return 'silk'
        }
        if ( bowser.bada ){
            return 'bada'
        }
        if ( bowser.tizen ){
            return 'tizen'
        }
        if ( bowser.seamonkey ){
            return 'seamonkey'
        }
        if ( bowser.sailfish ){
            return 'sailfish'
        }
        if ( bowser.ucbrowser ){
            return 'ucbrowser'
        }
        if ( bowser.qupzilla ){
            return 'qupzilla'
        }
        if ( bowser.vivaldi ){
            return 'vivaldi'
        }
        if ( bowser.sleipnir ){
            return 'sleipnir'
        }
        if ( bowser.kMeleon ){
            return 'kMeleon'
        }
    }
}
