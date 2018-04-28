export default function backLink(relatedPage: any): any {
  if (!relatedPage) {
    return undefined;
  }

  return {
    text: `back to ${relatedPage.title}`,
    url: relatedPage.url,
  };
}
