import * as $ from 'jquery';

function buildString(hookName:string){
    var selector:string = '[data-js-hook';
    selector += (!hookName || hookName === '*')?  ']' : '~="' + hookName + '"]';
    return selector;
}

export function hook(hookName:string):JQuery {
    var selector:string = buildString(hookName)
    return $(selector)
}
export function hookStr(hookName:string):string{
    var selector:string = buildString(hookName)
    return selector
}
