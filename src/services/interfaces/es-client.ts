export interface Bucket {
  key: string;
  doc_count: number;
  slug?: string;
}
interface Keyword {
  doc_count_error_upper_bound: number;
  sum_other_doc_count: number;
  buckets: Bucket[];
}

export interface IndexerAggData {
  [index: string]: Keyword;
}

export interface Buckets {
  buckets: Bucket;
}

interface Name {
  name: string;
}
export interface Filters {
  [index: string]: Name|Buckets;
}

interface Info {
  title: string;
  url: string;
  count?: number;
}

export interface NormalizedAggData {
  [index: string]: Info[];
}

export interface NormalizePredictiveSearchData {
  term: string;
  results: any;
  type: string;
  hasContent: boolean;
  exactMatch?: any;
  cta?: any;
}

export interface NormalizeGlobalSearchData {
  term: string;
  termSlug: string;
  results: any;
}
