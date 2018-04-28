/**
 * Creates a slug from the given string
 * @param {String} text
 * @returns {string}
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with +
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
    .replace(/-/g, "+"); // Finaly replace - for +
};

/**
 * Creates a human readable version of the given slug
 * @param {String} text
 * @returns {string}
 */
export const deslugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\+/g, " "); // Finaly replace + for whitespace
};
