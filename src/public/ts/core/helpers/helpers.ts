import * as $ from 'jquery';
import * as inobounce from 'inobounce';
inobounce.disable();

interface Breakpoints{
    [key:string]: number
    small:number;
    medium:number;
    large:number;
    xlarge:number;
    xxlarge:number;
}

export const breakpoints:Breakpoints = {
        small: 0,
        medium: 640,
        large: 1024,
        xlarge: 1200,
        xxlarge: 1440,
}

/**
 * Get the current breakpoint size
 * @return {String} small, medium, etc.
 */
export function getBreakpoint():string {
    let windowWidth:number = $(window).width();
    let sizes = Object.keys(breakpoints);
    let currBreakpoint:string;

    sizes.forEach((val:string, i:number) => {
        if (windowWidth >= breakpoints[val]) {
            currBreakpoint = val;
        }
    });

    return currBreakpoint;
}

getBreakpoint();

export class ScrollControl {
    static lockClass:string = 'lock-scroll';

    static lock(){
        $('html, body').addClass(this.lockClass);
        inobounce.enable();
    }

    static unlock(){
        $('html, body').removeClass(this.lockClass);
        inobounce.disable();
    }
}

/**
 * Create a 5 digit id to idetify each slider
 */
export function createID() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16)
}

/**
 * Creates a slug from the given string
 * @param {String} text
 * @returns {string}
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with +
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
    .replace(/-/g, "+"); // Finaly replace - for +
};

/**
 * Creates a human readable version of the given slug
 * @param {String} text
 * @returns {string}
 */
export const deslugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\+/g, " "); // Finaly replace + for whitespace
};
