import AjaxFiltering from '@service/ajax-filtering';

export default class BlogFiltering extends AjaxFiltering {

    constructor(private app) {
        super();
    }

    protected render(data) {

        const $content = $(data).siblings(this.mainContainer);
        const filtersContent = $content.find(this.filterItems).html();

        const pinnedArticleContent = $content.find(this.pinnedArticles).length ? $content.find(this.pinnedArticles).html() : '';
        const paginationContent = $content.find(this.pagination).length ? $content.find(this.pagination).html() : '';
        const showClearAll = $content.find(this.filterLink).filter(this.filterLinkActive).length;
        const $clearAll = $content.find(this.filterClear);

        const postListContet = $content.find(this.postList).html();

        const showPinned = pinnedArticleContent == '' ? 'none' : '';
        const showPagination = paginationContent == '' ? 'none' : '';

        $(this.pinnedArticles).css('display', showPinned);
        $(this.pagination).css('display', showPagination);

        $(this.filterItems).html(filtersContent);
        $(this.pinnedArticles).html(pinnedArticleContent);
        $(this.postList).html(postListContet)
        $(this.pagination).html(paginationContent);

        if (showClearAll > 0) {
            if ($(this.filterConainer).find(this.filterClear).length === 0) {
                $(this.filterConainer).append($clearAll);
            }
        } else {
            $(this.filterClear).remove();
        }

        // this.sr.sync();
        // this.app.scrollreveal.sync();
    }
}
