export interface CartPayload {
    SitecoreProductType: string;
    SitecoreuserType: string;
    code: string|null;
    entries: CartEntry[];
    miniCartUI: string;
    quantityAdded: number;
    statusCode: string;
    subTotal: CartPrice;
    totalItems: number;
    totalUnitCount: number|null;
    verified: number;
}

export interface CartAddProduct {
    qty: number;
    productType: string;
    code: string;
}

export interface CartAddPayload {
    items: CartAddProduct;
}

export interface CartResponse {
    d: string;
}

export interface Link {
    href: string;
    text: string;
    target?: string;
}

interface CartEntry {
    entryNumber: number;
    product: CartProduct;
    quantity: number;
    totalPrice: Value;
}

interface Value {
    value: number;
    formattedValue: string;
}

interface CartPrice {
    value: number;
    formattedValue: string;
}

interface CartProduct {
    code: string;
    isbn13: string;
    jacketUrl: string;
    metaTitle: string;
    title: string;
    type: string;
}
