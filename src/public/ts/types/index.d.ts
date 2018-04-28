/// <reference types="jquery"/>

declare interface Window{
    $:JQueryStatic;
    jQuery:JQueryStatic;
    dataLayer: any;
    Analytics: any;
    userAnalyticsData: any;
}

declare interface Function {
    readonly name:string
}

declare interface FunctionConstructor {
    readonly name:string
}

// add more global events as needed
declare interface BindMethod {
    throttle:Array<Function>;
    debounce:Array<Function>;
}

declare interface EventTypesI{
    resize:BindMethod;
    scroll:BindMethod;
}

declare interface ThrottleOptions {
    leading?:boolean
    trailing?:boolean
}

declare interface JQueryStatic {
    hook(hookName:string): JQuery;
    hookStr(hookName:string):string;

    debounce(func:Function, wait:number, immediate?:number): Function;
    throttle(func:Function, wait:number, options?:ThrottleOptions): Function;
}

interface ValidateCreditCardResult {
    luhn_valid: boolean;
    length_valid: boolean;
}

interface ValidateCreditCardFunction {
    (value: ValidateCreditCardResult): boolean;
}

declare interface JQuery {
    validateCreditCard: {
        (fn: ValidateCreditCardFunction): JQuery;
    };
}

declare interface iNoBounce {
    enable(): void;
    disable(): void;
    isEnabled(): void;
}
