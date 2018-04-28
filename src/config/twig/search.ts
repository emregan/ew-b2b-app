interface Item {
  response_type: string;
}

interface Product extends Item {
  format: string;
  inventoryStatus?: string;
  inventorystatus?: string;
  bisacstatus?: string;
}

export const productStatus = (product: Product): string => {
  if (typeof product.inventorystatus !== "undefined") {
    return product.inventorystatus;
  }

  if (typeof product.inventoryStatus !== "undefined") {
    return product.inventoryStatus;
  }

  if (typeof product.bisacstatus !== "undefined") {
    return product.bisacstatus;
  }

  return "";
};

export const isProduct = (item: Item): string => {
  return (item.response_type === "hmh-k12-components" || item.response_type === "hmh-trade-products" || item.response_type === "hmh-riverside-products") ? "1" : "";
};

const isProductEbook = (product: Product): string => {
  return /e-?book/i.test(product.format) ? "1" : "";
};

const isProductPreOrder = (product: Product): string => {
  return /not yet published/i.test(productStatus(product)) ? "1" : "";
};

const isProductPrintOnDemand = (product: Product): string => {
  return /print\s?on\s?demand/i.test(productStatus(product)) ? "1" : "";
};

export const productAddToCartText = (product: Product): string => {
  if (isProductEbook(product)) {
    return "Buy Now";
  }

  if (isProductPreOrder(product)) {
    return "Pre-Order";
  }

  return "Add to Cart";
};
