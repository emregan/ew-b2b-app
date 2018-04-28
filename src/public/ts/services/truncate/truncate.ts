import * as $ from 'jquery';

export default class TruncText {
    private $el: JQuery;
    private amount: number = 40;
    private elipsis: boolean = true;

    constructor($el: JQuery, amount?: number, elipsis?: boolean) {
        if ($el.length === 0) {
            return;
        }

        this.$el = $el;
        this.amount = amount ? amount : this.amount;
        this.elipsis = elipsis ? elipsis : this.elipsis;

        this.trim();
    }

    /**
     * Truncate elements
     */
    public trim() {
        this.$el.each((i, el) => {
            let $el = $(el);
            let text = $el.text();

            // Truncate text if greater than amount
            if (text.length > this.amount) {
                // Save original text
                $el.attr('data-original-text', text).addClass('truncated');

                // Truncate text
                text = text.substr(0, this.amount);

                // Add elipsis
                if (this.elipsis) {
                    text += '...';
                }

                // Update text
                $el.text(text);
            }
        });
    }

    /**
     * Expand truncated elements
     */
    public expand() {
        if (!this.elementsExist()) {
            this.rebind();
        }

        this.$el.each((i, el) => {
            let $el = $(el);
            let text = $el.data('original-text');

            if (text) {
                $el.text(text);
            }
        });
    }

    /**
     * Check if elements exist
     * @return {boolean}
     */
    private elementsExist(): boolean {
        return Boolean(this.$el.closest("body").length);
    }

    /**
     * Find elements who have already been truncated and
     * reset the $el property
     */
    public rebind() {
        this.$el = $('[data-original-text]');
    }
}
