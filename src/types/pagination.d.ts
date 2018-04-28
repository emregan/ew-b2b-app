interface PaginatorOptions {
  totalResult: number;
  prelink: string;
  rowsPerPage: number;
  pageLinks?: number;
  current: number;
  translationCache?: boolean;
  translationCacheKey?: string;
  translator?: (str: string) => string;
  pageParamName?: string;
  slashSeparator?: boolean;
}

interface PaginationData {
  prelink: string;
  current: number;
  previous: number;
  next: number;
  first: number;
  last: number;
  range: number[];
  fromResult: number;
  toResult: number;
  totalResult: number;
  pageCount: number;
}

declare namespace pagination {
  class SearchPaginator {
    constructor(options: PaginatorOptions);
    getPaginationData(): PaginationData;
  }
}

export = pagination;
