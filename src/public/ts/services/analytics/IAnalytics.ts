export interface ProductResult {
  url: string;
  productCode: number;
  age: string;
  isbn13Code: number;
  isbn10Code: number | string;
  format: string;
  title: string;
  metaTitle: string;
  imprint: string;
  language: string;
  pages?: number | null;
  description: string;
  cartonQuantity: number;
  copyright: number;
  price: number;
  salesRestrictionCode: number;
  componentType: string;
  state: string;
  keywords: string;
  programId: string;
  programGroupId: string;
  programName: string;
  programCopyrightYear: number;
  programState: string;
  publishDate: string;
  baseprice: number;
  bisacstatus: string;
  t2: string;
  t3?: (string)[] | null;
  categoryid: string;
  grades?: number | (string)[];
  topics: string;
  response_type: string;
  score: number;
  cpsia?: number | null;
}

export interface ParsedSearch {
    eventListings: any;
    productLists: any;
}
