import * as $ from 'jquery';
import Config from './config';
import * as _ from 'lodash';

import AttributeMethods from './attributeMethods';
import { CartPayload } from '../../modules/add-to-cart/IAddToCart';
import { ProductResult } from './IAnalytics';


export default class Analytics {

    private props: any;
    private specialProps: any[] = [
        {section: 'productObject', prop: 'productObject.format', method: 'explode'},
    ];

    private dataLayer: any = {};

    constructor(skip?: boolean) {
        if (!skip) {
            this.dataLayer.event = 'datalayer-initialized';
            $.ready.then(this.compile.bind(this));
            this.props = Config.props();
        }
    }

    private decodeParams(params: any) {
        const updated = {};
        for (const param in params) {
            const val = params[param];
            if (!Array.isArray(val)) {
                updated[param] = val.replace(/\+/g, ' ');
            } else {
                for (const v of val) {
                    if (!Array.isArray(updated[param])) {
                        const toPush = updated[param];
                        updated[param] = [];
                        if (typeof toPush !== 'undefined') {
                            updated[param].push(toPush);
                        }
                    }
                    updated[param].push(v.replace(/\+/g, ' '));
                }
            }
        }

        return updated;
    }

    /**
     *
     * Compile
     * @desc put together the dataLayer object to send to GTM
     * for the analytics by iterating over the config and checking if the
     * attribute has data
     *
     */
    private compile() {
        this.dataLayer = this.iterateProps(this.dataLayer, this.props, document);

        this.checkSpecialProps();
        this.addAnalyticsOb();

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(this.dataLayer);
    }

    /**
     *
     * Iterate Props
     * @desc go through any prop and depending on how nested it is
     * assign the props to an arbitrary object
     *
     */
    private iterateProps(layer: any, props, doc: any) {
        for (const section of props) {
            const type = `${section.type}Object`;
            let elAttr, hasFunction;

            layer[type] = {};
            for (const prop of section.props) {
                if (prop.hasOwnProperty('props')) {
                    const nestedPropType = prop.type;
                    layer[type][nestedPropType] = {};
                    for (const propNestedOb of prop.props) {
                        if (propNestedOb.hasOwnProperty('props')) {
                            for (const propNestedNestOb of propNestedOb.props) {
                                this.parseAndSetNestedProp(doc, layer, type, nestedPropType, propNestedOb.type, propNestedNestOb);
                            }
                        } else {
                            this.parseAndSetNestedProp(doc, layer, type, nestedPropType, propNestedOb);
                        }
                    }
                    if (_.isEmpty(layer[type][nestedPropType])) {
                        layer[type][nestedPropType] = undefined;
                    }
                } else if (typeof prop === 'string') {
                    elAttr = this.getEl(doc, type, '', prop);
                    layer[type][prop] = this.valueDetermine(elAttr.el, elAttr.attrName, false);
                } else {
                    // is an object with an alias
                    const propName = prop.name || prop;
                    const propAlias = prop.alias || false;
                    elAttr = this.getEl(doc, type, '', propName, propAlias);
                    hasFunction = prop.method || false;
                    layer[type][propName] = this.valueDetermine(elAttr.el, elAttr.attrName, hasFunction);
                }
            }
        }

        return layer;
    }

    /**
     *
     * Parse And Set Nested Prop
     * @desc iterate over nested properties and set the value based on the
     * objects properties. This allows us to iterate over the config object
     * with n nested types and props
     */
    private parseAndSetNestedProp(doc: any, layer: any, type: string, nestedPropType: string, propNestedOb: any, propNestedNestOb?: any) {
        const nestedProp = propNestedNestOb || propNestedOb;
        const propNested = nestedProp.name || nestedProp;
        const propNestedAlias = nestedProp.alias || false;
        const elAttr = this.getEl(doc, type, nestedPropType, propNested, propNestedAlias);
        const hasFunction = nestedProp.method || false;

        if (propNestedNestOb) {
            if (typeof layer[type][nestedPropType][propNestedOb] === 'undefined') {
                layer[type][nestedPropType][propNestedOb] = {};
            }
            layer[type][nestedPropType][propNestedOb][propNested] = this.valueDetermine(elAttr.el, elAttr.attrName, hasFunction);
        } else {
            layer[type][nestedPropType][propNested] = this.valueDetermine(elAttr.el, elAttr.attrName, hasFunction);
        }
    }

    /**
     *
     * Get El
     * @desc grab all the data attribuets by the passed in types and send back
     * the formatted attribute and the element node
     */
    private getEl(doc: any, typeNamespaced: string, nestedType: string, attr: string, alias?: string) {
        const type = typeNamespaced.replace('Object', '');
        const subType = nestedType === '' ? '' : `${nestedType.toLowerCase()}-`;
        const attrName = `data-gtm-${type.toLowerCase()}-${subType}${attr.toLowerCase()}`;

        const el = doc.querySelectorAll(`[${attrName}]`);

        if (alias && el.length === 0) {
            const aliasName = `data-gtm-${type.toLowerCase()}-${subType}${alias.toLowerCase()}`;
            const el = doc.querySelectorAll(`[${aliasName}]`);

            if (el.length > 0) {
                return {
                    el,
                    attrName: aliasName
                };
            }

        }

        return {
            el,
            attrName
        };
    }

    /**
     *
     * Add Analytic Object
     * @desc check any analytic object data to push that into the dataLayer as well
     *
     */
    private addAnalyticsOb() {
        if (window.hasOwnProperty('userAnalyticsData')) {
            const user = this.parseUserObject();
            this.dataLayer.userObject = user;
        }

        if (!window.hasOwnProperty('Analytics') || window.Analytics.length < 1) {
            return;
        }

        for (const analytic of window.Analytics) {
            switch (analytic.key) {
               
            }
        }
    }

    /**
     *
     * Parse User Object
     * @desc grab the HMH provided user object, format it and push it into the
     * dataLayer
     *
     */
    private parseUserObject() {
        const user: any = {};
        const userData = window.userAnalyticsData;
        const userObject: any = Config.get('user');
        const props: any = userObject.props;

        for (const prop of props) {
            if (prop.hasOwnProperty('type')) {
                const key = prop.type;
                user[key] = {};
                for (const nestedProp of prop.props) {
                    user[key][nestedProp] = typeof userData[key] === 'undefined' || typeof userData[key][nestedProp] === 'undefined' || userData[key][nestedProp] === '' ?
                    undefined : userData[key][nestedProp];
                }
            } else {
                user[prop] = typeof userData[prop] === 'undefined' || userData[prop] === '' ?
                    undefined : userData[prop];
            }
        }

        return user;
    }

    

    private checkSpecialProps() {
        for (const propOb of this.specialProps) {
            const prop = propOb.prop;
            const func = propOb.method;
            const value = _.get(this.dataLayer, prop);
            if (typeof this[func] === 'function') {
                this[func](value, propOb);
            }
        }

        const attrName = 'data-gtm-page-override'
        const el = document.querySelectorAll(`[${attrName}]`);
        if (el.length > 0) {
            this.dataLayer.pageObject.type = $(el).attr(attrName);
        }
    }

    /**
     *
     * Grab From Url
     * @desc parse the program from the URL as long as it's not already set
     *
     */
    private grabFromUrl(value: string, prop: any) {
        const existing = _.get(this.dataLayer, prop.prop);
        if (typeof existing !== 'undefined') {
            return;
        }
        const url = window.location.href;
        const base: string = url.split('?')[0];
        const split: string[] = base.split('/');

        if (typeof split[3] !== 'undefined' && split[3] === 'shop' && typeof split[5] !== 'undefined') {
            const program = split[5].replace(/-/g, ' ');
            _.set(this.dataLayer, prop.prop, program);
        }

        if (typeof split[3] !== 'undefined' && split[3] === 'programs' && typeof split[4] !== 'undefined') {
            const program = split[4].replace(/-/g, ' ');
            _.set(this.dataLayer, prop.prop, program);
        }
    }


    private explode(value: string, prop: any) {
        if (typeof value !== 'undefined' && value.indexOf(',') > -1) {
            const values = value.split(',');
            const format = values[0];
            const pages = values[1];
            const section = prop.section;
            this.dataLayer[section].format = format.trim();
            this.dataLayer[section].numberOfPages = pages.trim();
        }
    }

    /**
     *
     * Value Determine
     * @desc check the passed in element NodeList and grab the attr and parse
     * the data by checking if the value is a function or just a value
     *
     */
    private valueDetermine(el: any, attr: string, hasFunction?: any) {
        if (el.length === 0) {
            return undefined;
        }

        if (el.length === 1) {
            const node = el[0];
            const val = $(node).attr(attr);
            const funcValue = this.isFunction(val, node, attr);

            if (typeof funcValue !== 'undefined' && funcValue !== false) {
                if (funcValue.hasOwnProperty('sum') && typeof funcValue.sum !== 'undefined') {
                    return funcValue.sum;
                } else {
                    return funcValue;
                }
            }

            if (hasFunction) {
                return this.isFunction(hasFunction, val, attr);
            }

            return val;
        } else {
            const values = [];
            let total = 0;
            let isTotal = false;
            for (const node of el) {
                const val = $(node).attr(attr);
                const funcValue = this.isFunction(val, node, attr);

                if (funcValue === 'total') {
                    isTotal = true;
                    total++;
                } else if (typeof funcValue.sum !== 'undefined') {
                    isTotal = true;
                    total += funcValue.sum;
                } else if (funcValue !== false) {
                    values.push(funcValue);
                } else {
                    values.push(val);
                }
            }

            if (isTotal) {
                return total;
            }

            return values;
        }
    }

    /**
     *
     * Is Function
     * @desc check if the passed in attribute value is a function and use
     * the function to parse the value
     *
     */
    private isFunction(func: string, node: any, attr: string) {
        const reg = RegExp(/\([^()]*\)/);
        if (reg.test(func)) {
            const funcName = func.replace(/\([^()]*\)/g, '');
            const innerParen = func.match(/\(([^)]+)\)/);
            const arg = innerParen !== null && innerParen.length > 1 ? innerParen[1] : '';
            if (typeof AttributeMethods[funcName] !== 'function') {
                return false;
            }
            return AttributeMethods[funcName](node, arg, attr);
        }

        return false;
    }
}
