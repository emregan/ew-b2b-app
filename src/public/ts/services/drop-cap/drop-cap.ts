import * as $ from 'jquery';

export default class DropCap {
    isDropCapSet: boolean = false;
    regex = /[a-zA-Z0-9]+/g;

    constructor($el:JQuery) {
        // Bail early if we don't need to set a drop cap
        const setDropCap = $el.data('drop-cap');
        if (!setDropCap) {
            return;
        }

        this.applyDropCap($el);
    }

    private applyDropCap($el: JQuery) {
        // Get first p tag that starts with a word
        const firstP: HTMLElement = $el.find('p').filter(this.getFirstPwithWord.bind(this))[0];
        const $firstP: JQuery = $(firstP);
        // Get first word from that p tag
        const dropCapWord:string = $.trim($firstP.text()).split(' ')[0];
        // wrap first letter in word
        const dropCap = dropCapWord.replace(/^([a-z0-9]){1}/i, this.wrapDropCap.bind(this))
        // Regex for getting first word
        const wordRegex = new RegExp(`^(${dropCapWord})`);

        // Find and replace word with dropCap version
        $firstP.html($firstP.html().replace(wordRegex, dropCap))
    }

    /**
     * Regex check if p tag starts with word
     * @param {number} i [description]
     * @param {JQuery} p [description]
     */
    private getFirstPwithWord(i:number, p: JQuery) {
        let pText = $.trim($(p).text());
        let firstChar:string = pText.substr(0, 1);
        return this.regex.test(firstChar)
    }

    /**
     * Callback for String.Prototype.replace
     * replace match with dropcap syntax
     * @param {string} str [description]
     */
    private wrapDropCap(str: string) {
        console.log(str)
        return `<span class="blog-rich-text__drop-cap u-style-display-xxl u-style-weight-bold">${str}</span>`;
    }
}
