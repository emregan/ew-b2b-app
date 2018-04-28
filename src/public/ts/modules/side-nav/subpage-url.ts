import * as $ from 'jquery';
import BaseModule from '@core/base-module';
import { Foundation } from 'foundation-sites/js/foundation.core';
/**
 * !!!IMPORTANT!!!
 * This code is used for both program pages and About us pages.
 * The url structure is slightly diffirent and should be mindfull when manipulating the url!
 */
export default class SubpageUrl extends BaseModule{
    private urlPath: string[] = this.createPathArr();
    private subSectionPosition: number;

    constructor() {
        super();
    }

    private createPathArr(): string[] {
        // slice(0) clones the array
        const pathArr: string[] = location.pathname.split('/').slice(0);
        this.subSectionPosition = (pathArr[1] == 'programs') ? 3 : 2;

        if ( pathArr[pathArr.length-1] == '' ) {
            pathArr.pop()
        }

        return pathArr
    }

    protected getSubSection(): string {
        return this.urlPath[this.subSectionPosition];
    }

    private sectionUrl(sectionName: string): string {
        // The 3 segment should be the subpage
        this.urlPath[this.subSectionPosition] = sectionName;
        // Make string and remove trailing slash
        return this.urlPath.join('/').replace(/(\/)$/, '');
    }

    public updateSubPage(e:CustomEvent, el:JQuery) {
        const slug:string = el.attr('href');

        if (!slug) {
            return false;
        }

        const sectionName: string = (slug === '#introduction') ? '' : slug.replace('#', '');
        const newUrl: string = this.sectionUrl(sectionName);

        if (location.pathname !== newUrl) {
            history.replaceState(null, null, newUrl);
        }
    }
}
