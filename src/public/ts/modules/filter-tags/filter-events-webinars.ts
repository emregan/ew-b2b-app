import AjaxFiltering from '@service/ajax-filtering';

export default class EventsWebinarsFilter extends AjaxFiltering {
    protected filterRefinements: string = '.filters__refine-container';
    private pinnedEvents: string = '.pinned-events';
    private eventsList: string = '.events-list';
    private ACTIVE_PANEL_CLASS: string = 'filters__refine-content--active';

    constructor(private app) {
        super();
    }

    protected render(data) {

        const $content = $(data).siblings(this.mainContainer);
        let filtersContent = $content.find(this.filterRefinements).html();
        // Remove active panel class
        filtersContent = filtersContent.replace(/(filters__refine-content--active)/g, '');

        const pinneEventsContent = $content.find(this.pinnedEvents).length ? $content.find(this.pinnedEvents).html() : '';
        const paginationContent = $content.find(this.pagination).length ? $content.find(this.pagination).html() : '';

        const eventsListContet = $content.find(this.eventsList).html();

        const showPinned = pinneEventsContent === '' ? 'none' : '';
        const showPagination = paginationContent === '' ? 'none' : '';

        $(this.pinnedEvents).css('display', showPinned);
        $(this.pagination).css('display', showPagination);

        $(this.filterRefinements).html(filtersContent)
        $(this.pinnedEvents).html(pinneEventsContent);
        $(this.eventsList).html(eventsListContet)
        $(this.pagination).html(paginationContent);
        // this.app.scrollreveal.sync();
    }
}
