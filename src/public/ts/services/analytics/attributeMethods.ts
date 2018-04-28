import * as $ from 'jquery';
import Config from './config';
import * as _ from 'lodash';

/**
 * Attribute Methods
 * @desc anonymous methods called in data attributes that have an argument
 * and an original value. Method parsing handled in the calling class
 *
 */
export default class AttributeMethods {

    /**
     *
     * Word Count
     * @desc check the node and grab the text data and perform a crude
     * word count
     *
     */
    public static wordCount(node: any, arg: any, attr: string): {sum: number} {
        const text = $(node).text();
        const sum = text.split(' ').length;

        return {
            sum
        };
    }

    public static parseSubjectPrimary(node: any, arg: any, attr: string) {
        const json: any = JSON.parse(arg);
        for (const subject of json) {
            if (subject.parent === null) {
                return subject.name;
            }
        }
    }

    public static parseSubjectSecondary(node: any, arg: any, attr: string) {
        const json: any = JSON.parse(arg);
        let secondarySubject: string;
        for (const subject of json) {
            if (subject.parent !== null) {
                secondarySubject = subject.name;
            }
        }

        if (typeof secondarySubject === 'undefined') {
            if (json.length > 1) {
                secondarySubject = json[1].name;
            }
        }

        return secondarySubject;
    }

    public static totalElements(node: any, arg: any, attr: string): string {
        return 'total';
    }

    public static decode(node: any, arg: any): string {
        return JSON.parse(arg);
    }

    /**
     *
     * Viewport
     * @see https://stackoverflow.com/questions/19291873/window-width-not-the-same-as-media-query
     */
    public static viewport(node: any, arg: any, attr: string): number {
        let type = 'inner';
        let win: any = window;
        if (!('innerWidth' in window )) {
            type = 'client';
            win = document.documentElement || document.body;
        }
        return win[`${type}Width`];
    }

    public static parsePrice(val: any, arg: any, attr: string) {
        const result = parseFloat(val.replace(/\$|,/g, ''));

        return isNaN(result) ? undefined : result;
    }

    /**
     *
     * Compile Array
     * @desc for a nested object we might have more values that the property
     * calls for (a string) so we need to make it an array and push more objects
     * into the property
     *
     */
    public static compileArray(val: any, arg: any, attr: string) {
        let data: any;
        const compiled: string[] = [];
        try {
            data = JSON.parse(arg);
        } catch(e) {
            data = false;
        }

        if (!data) {
            return;
        }

        if (Array.isArray(data)) {
            if (data.length === 0) {
                return data;
            }

            for (const info of data) {
                for (const key in info) {
                    if (key === 'title') {
                        compiled.push(info[key]);
                    }
                }
            }
            data = compiled;
        }

        return data;
    }
}


