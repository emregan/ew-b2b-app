export default class PrevContentOverlap {
    private $win: JQuery = $(window);

    constructor(
        private $el1: JQuery,
        private $el2: JQuery,
    ) {
        this.$win.on('load scroll', this.track.bind(this));
    }

    /**
     * Locks the side navigation when it reaches the bottom of the page
     * to prevent it from going over the footer
     * @param {number} bottomOffset
     */
    private navLockBottom(diff: number) {
        const bottomLockPoint: number =  diff + 80;
        this.$el1.css('transform', `translateY(-${bottomLockPoint}px)`);
    }

    private navUnlock() {
        this.$el1.css('transform', 'translateY(0)');
    }

    /**
     * Check to see if we need to lock or unlock the side nav on desktop
     */
    public track() {
        const matrix: string[] = this.$el1.css('transform').replace(/[^0-9\-.,]/g, '').split(',');
        const y = Number(matrix[13]) || Number(matrix[5]);
        const $el1Rect: ClientRect = this.getRects(this.$el1);
        const $el2Rect: ClientRect = this.getRects(this.$el2);

        let diff: number = Math.round($el1Rect.bottom - $el2Rect.top);
        diff = y ? diff - y : diff;


        if (diff > 0) {
            return this.navLockBottom(diff);
        }

        return this.navUnlock();
    }

    private getRects($el: JQuery) {
        return $el[0].getBoundingClientRect();
    }
}
