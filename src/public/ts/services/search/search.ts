import * as $ from 'jquery';
import { slugify } from '@core/helpers'

interface SearchConstructor {
    form: JQuery;
    submitUrl: string;
    renderResults: Function;
    afterRender?: Function;
    action?: string;
}

export default class Search {
    public params: any = {};
    private $form: JQuery;
    // This will reference the last XHR request
    public request: JQueryXHR;
    private submitUrl: string;
    // Callback function assigned when from initiator
    private renderResults: Function;
    private afterRender: Function;
    private action: string;
    private exactMatchSelector: string = $.hookStr('result-summary-exact-match');
    private exactMatchUrl: string = '';

    constructor(params: SearchConstructor) {
        this.assignParams(params);
        this.initSubmitHook();
    }
    /**
     * @param {SearchConstructor}
     * Assign constructor params
     */
    private assignParams(params: SearchConstructor) {
        this.$form = params.form;
        this.submitUrl = params.submitUrl;
        this.afterRender = params.afterRender || function() {};
        // assigned post ajax callback
        this.renderResults = params.renderResults;
        this.action = ('action' in params) ? params.action : this.$form.attr('action');

        // Update form's action
        this.$form.attr('action', this.action)
    }

    /**
     * Update params to sent to predictive search specific for the shop
     * @param {JQueryEventObject} e
     */
    public updateParams(e: JQueryEventObject) {
        let formData = this.$form.serializeArray();

        formData.forEach(input => {
            this.params[input.name] = input.value;
        });
    }

    /**
     * Hook Form action
     * submit and keypress
     */
    private initSubmitHook() {
        this.$form.on('submit.search', this.onSubmit.bind(this));
        this.$form.on('keyup.search', $.debounce.apply(this, [this.doQuery.bind(this), 250]));
    }

    /**
     * Handles the form submission
     * @param {Object} e
     */
    private onSubmit(e: JQueryEventObject) {
        let formData = this.$form.serializeArray()[0];

        // Basic validation if the form is empty
        if (formData.value === '') {
            e.preventDefault();
        }

        /**
         * If this is an exact match to an ISBN search, redirect to the
         * product detail page
         */
        if (this.exactMatchUrl !== '') {
            e.preventDefault();
            window.location.href = this.exactMatchUrl;
        }
    }

    /**
     * @param {JQueryEventObject}
     * Do XHR event
     * Aborts any unfinished request to avoid
     * Call function is assigned on assignParams
     */
    private doQuery(e: JQueryEventObject) {
        e.preventDefault();

        // If 'term' key doesn't exist it means the form with submited with
        // an empty value and therefore we should not make a request
        if (!('term' in this.params)) {
            return false;
        }

        // Abort unfinished XHR request
        // This is is crucial to avoid handing request from finishing when new one is made
        if (this.request) {
            this.request.abort();
        }

        this.request = $.get(this.submitUrl, this.params);
        this.request.then(data => {
            this.renderResults(data);
            this.afterRender();
            this.findExactMatch(data);
        });
    }

    /**
     * Find exact match for an ISBN
     * @param {String} data
     */
    private findExactMatch(data) {
        const $data = $(data);
        const $exactMatch = $data.find(this.exactMatchSelector);

        if ($exactMatch.length > 0) {
            this.exactMatchUrl = $exactMatch.data('url');
        }
    }
}
