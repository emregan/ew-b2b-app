export default function stripsymbols(data: any): string {
  return data.replace(/(™|®|©|&trade;|&reg;|&copy;|&#8482;|&#174;|&#169;)/, "");
}
