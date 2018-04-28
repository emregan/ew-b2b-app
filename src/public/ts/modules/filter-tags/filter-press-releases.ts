import AjaxFiltering from '@service/ajax-filtering';

export default class PressReleasesFilter extends AjaxFiltering {
    protected pressReleases: string = '.press-releases-news-list__list';

    constructor(private app) {
        super();
    }

    protected render(data) {

        const $content = $(data).siblings(this.mainContainer);
        const filtersContent = $content.find(this.filterItems).html();
        const pressReleasesContent = $content.find(this.pressReleases).html();

        const paginationContent = $content.find(this.pagination).length ? $content.find(this.pagination).html() : '';
        const showClearAll = $content.find(this.filterLink).filter(this.filterLinkActive).length;
        const $clearAll = $content.find(this.filterClear);
        const showPagination = paginationContent == '' ? 'none' : '';


        $(this.pagination).css('display', showPagination);

        $(this.filterItems).html(filtersContent);
        $(this.pressReleases).html(pressReleasesContent);

        if (showClearAll > 0) {
            $(this.filterConainer).append($clearAll);
        } else {
            $(this.filterClear).remove();
        }

        // this.app.scrollreveal.sync();
    }
}
