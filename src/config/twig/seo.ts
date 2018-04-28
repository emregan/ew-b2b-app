import * as is from "is_js";
import { getSegment } from "./url";
import twigQuerystring from "./querystring";
import twigGetQuery from "./get-query";

interface SeoTemplate {
  title: string;
  canonical: string;
  description?: string;
  keywords?: string;
  author?: string;
  next?: string;
  prev?: string;
  date?: string;
}

/**
 * Generate SEO realted tags
 * This can be used to make any kind of head tag ultimately
 * 1) Define the varaible [seoTemplate] on the template
 * 2) Add a switch case on the temaplte method
 */
export default class Seo {
  private _context: any;
  private templateName: string;
  private seoDefaults: SeoTemplate = {
    title: "Houghton Mifflin Harcourt",
    description: "HMH is a global leader in Pre K-12 educational content and services, combining digital innovation and research to make learning more engaging and effective.",
    keywords: undefined,
    author: undefined,
    canonical: "",
    next: undefined,
    prev: undefined,
    date: undefined,
  };

  constructor(private twig: any) {}

  /**
   * Get template context and render seo template
   * @param  {any}    _context [template context]
   * @return {string}          [Seo template, raw since these are tags]
   */
  public render(_context: any): string {
    this._context = _context.context;
    this.templateName = this._context.seoTemplate || "";
    let template;
    try {
      template = this.template();
    } catch (e) {
      // create template with default values
      this.templateName = "";
      template = this.template();

      console.log({
        request: this._context.requestCache,
        error: e.toString(),
      });
    }

    return this.twig.filters.raw(template);
  }

  /**
   * Get page Canonical
   */
  private getCanonical() {
    if (typeof this._context.requestCache === "undefined") {
      return "";
    }

    return `${this._context.requestCache.protocol}://${this._context.requestCache.host}${this._context.requestCache.originalUrl}`;
  }

  /**
   * Switch logic for seo temaplte data
   * @return {string} [description]
   */
  private template(): string {
    // Clone seoDefaults.
    const template: SeoTemplate = { ...this.seoDefaults };
    let data: any = this._context.data;
    let pagination: any = this._context.pagination;
    let segment: string;
    template.canonical = this.getCanonical();

    switch (this.templateName) {
      /**
       * About us and Trade pages with sub pages
       */
       
      case "page-w-subpage-intro":
        template.title = `Introduction | ${data.title}`;
        template.description = this.truncDescription(data.summary) || template.description;
      break;

      case "page-w-subpage-sub":
        segment = getSegment(this._context.requestCache, 2);
        data = this._context.data.subpages.filter( (subpage: any) => subpage.slug == segment )[0];

        template.title = `${data.subpageTitle} | ${this._context.data.title}`;
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
      break;

      /**
       * Press release
       */
      case "press-releases-index":
        template.title = "Press Releases";
        template.title += this._context.pagination.currentPage != 1 ? ` ${this._context.pagination.currentPage} ` : " ";
        template.title += "| Houghton Mifflin Harcourt";

        template.description = "Hear the most recent news and announcements from Houghton Mifflin Harcourt.";
      break;

      case "press-releases-detail":
        template.title = data.title || template.title;
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
      break;

      case "news-detail":
        template.title = data.title || template.title;
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
        template.date = data.postDate;
      break;

      /**
       * Blog index, detail
       */
      case "blog-index":
        data = this._context.meta.landingPage;

        template.title = data.blogLandingName || template.title;
        template.description = this.truncDescription(data.blogLandingTagline) || template.description;
      break;

      case "blog-detail":
        template.title = data.title || template.title;
        template.description = data.blogAuthor ? `Read more from ${data.blogAuthor.title}. ${this.truncDescription(data.summary)}` : this.truncDescription(data.summary);
        template.author = data.blogAuthor ? data.blogAuthor.title : "";
        template.date = data.postDate;
      break;

      /**
       * People: previously blog author
       */
      case "people":
        template.title = data.title || "";
        template.title += data.personTitle ? `, ${data.personTitle}` : "";
        template.title += ` | ${this.seoDefaults.title}`;

        template.description = this.truncDescription(data.personBio) || template.description;
      break;

      /**
       * Case Studies
       */
      case "case-study":
        template.title = `${data.title} | ${this.seoDefaults.title}`;
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
      break;

      /**
       * Classroom Solutions and subjects
       */
      case "classroom-solutions-index":
        template.title = data.title || template.title;
        template.description =  data.classroomSolutionsTagline || template.description;
      break;

      case "classroom-solutions-detail":
        template.title = data.title || template.title;
        template.description =  data.programTypeTagline || template.description;
      break;

      /**
       * Event, index, detail
       */
      case "events-index":
        data = this._context.meta.landingPage;

        template.title = "Events & Webinars";
        template.title += this._context.pagination.currentPage != 1 ? ` ${this._context.pagination.currentPage} ` : " ";
        template.title += "| Houghton Mifflin Harcourt";

        template.description = "Learn from today's brightest minds in education by joining us for conversation and commentary on the issues affecting our classrooms.";
      break;

      case "events-detail":
        template.title = `${data.title} Event With ${this.getEventHosts(data.eventSpeakers)}`;
        template.description = `Join ${this.seoDefaults.title} for ${data.title} With ${this.getEventHosts(data.eventSpeakers)} on ${this.descriptionDate(data.eventDate)}. Register today!`;
        template.date = data.eventDate;
      break;

      /**
       * Program page sections
       */
      case "programs-intro":
        template.title = `Introduction | ${this.twig.filters.striptags(data.title)}`;
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
      break;

      case "programs-sub":
        segment = getSegment(this._context.requestCache, 3);
        data = this._context.data.subpages.filter( (subpage: any) => subpage.slug == segment )[0];

        const primaryType: string = this._context.data.primaryType.title;
        const primarySubject: string = this._context.data.primarySubject.title;
        const programTitle: string = this.twig.filters.striptags(this._context.data.title);

        template.title = `${this.twig.filters.striptags(data.title)} | ${this.twig.filters.striptags(this._context.data.title)}`;

      break;

      /**
       * Search Category page
       */
      case "search-detail":
        data = this._context.results;

        template.title = `Shop ${data.name} | ${this.seoDefaults.title}`;
        template.description = `Order ${data.name} program components from ${this.seoDefaults.title}`;
      break;

      /**
       * Shop pages: search results, detail
       */
      case "shop-search-results":
        data = this._context.data.results[0];
        pagination = this._context.data.pagination;
        const subCategoryName: any = twigGetQuery(this._context.requestCache, "subcategory");

        if (subCategoryName) {
          const subcategory: any = this._context.aggs.cats.subCategories.filter((val: any) => val.url == subCategoryName.join().replace(/\s/g, "+"))[0];
          // For sub-category page
          template.title = `Shop ${this.twig.filters.striptags(subcategory.title)} | ${this.seoDefaults.title}`;
          template.description = `Order ${this.twig.filters.striptags(subcategory.title)} program components from ${this.seoDefaults.title}.`;
        } else {
          // For category page
          const category: any = this._context.aggs.cats.shopCategories.filter((val: any) => val.active)[0];
          const categoryName: any = category ? this.twig.filters.striptags(category.title) : data.name;
          template.title = `Shop ${categoryName} | ${this.seoDefaults.title}`;
          template.description = `Order ${categoryName} program components from ${this.seoDefaults.title}.`;
        }
      break;

      case "shop-detail":
        data = this._context.product;

        if (data.type == "k12") {
          template.title = `Order ${this.twig.filters.striptags(data.title)}, ISBN: ${data.isbn13} | HMH`;
          template.description = `Buy ${this.twig.filters.striptags(data.title)}, ISBN: ${data.isbn13} from ${this.seoDefaults.title}. Shop now.`;
        }

        if (data.type == "trade") {
          template.title = `Order ${this.twig.filters.striptags(data.title)}, ISBN: ${data.isbn10} | HMH`;
          template.description = `Buy ${this.twig.filters.striptags(data.title)}, ISBN: ${data.isbn10} from ${this.seoDefaults.title}. Shop now.`;
        }
      break;

      case "forms-detail":
        data = this._context.data;

        template.title = `Have Questions About ${this.twig.filters.striptags(data.formRelatedPage.title)}? Ask HMH.`;
        template.description = `Contact Houghton Mifflin Harcourt about ${this.twig.filters.striptags(data.formRelatedPage.title)} and we'll follow up!`;
      break;

      case "forms-thank-you":
        template.title = "Thank You | HMH";
        delete template.description;
      break;
      
      /**
       * Order History
       */
      case "orders":
        template.title = "Order History";
        template.description = "";
      break;

      case "order-detail":
        template.title = "Order History";
        template.description = data.summary ? this.truncDescription(data.summary) : template.description;
        template.date = data.postDate;
      break;
      
      
    }

    if (data) {
      template.title       = data.seoTitle       || template.title;
      template.description = data.seoDescription || template.description;
      template.keywords    = data.seoKeywords    || template.keywords;
    }

    if (pagination) {
      template.prev = pagination.prevPage || template.prev;
      template.next = pagination.nextPage || template.next;
    }

    return this.makeTemplate(template);
  }

  /**
   * Render tags agaist provided data
   * @param  {SeoTemplate} data [description]
   * @return {string}           [description]
   */
  private makeTemplate (data: SeoTemplate): string {
    let template: string = "";

    if (!is.undefined(data.canonical)) {
      template += `<link rel="canonical" href="${data.canonical}" />\n`;
    }

    if (!is.undefined(data.title)) {
      template += `<title>${data.title}</title>\n`;
    }

    if (!is.undefined(data.description)) {
      template += `<meta name="description" content="${data.description}" />\n`;
    }

    if (!is.undefined(data.keywords)) {
      template += `<meta name="keywords" content="${data.keywords}" />\n`;
    }

    if (!is.undefined(data.author)) {
      template += `<meta name="author" content="${data.author}" />\n`;
    }

    if (!is.undefined(data.date)) {
      template += `<meta name="date" content="${this.metaDate(data.date)}" scheme="YYYY-MM-DD" />\n`;
    }

    if (!is.undefined(data.next)) {
      const nextQuery = { ...this._context.requestCache.query };
      nextQuery.page = data.next;
      const nextUrl = `${this._context.requestCache.protocol}://${this._context.requestCache.host}/?${twigQuerystring(this._context.requestCache, nextQuery)}`;
      template += `<link rel="next" href="${nextUrl}" />\n`;
    }

    if (!is.undefined(data.prev)) {
      const prevQuery = { ...this._context.requestCache.query };
      prevQuery.page = data.prev;
      const prevUrl = `${this._context.requestCache.protocol}://${this._context.requestCache.host}/?${twigQuerystring(this._context.requestCache, prevQuery)}`;
      template += `<link rel="prev" href="${prevUrl}" />\n`;
    }

    return this.twig.filters.raw(template);
  }

  private getEventHosts(hostNames: any[]): string {
    return hostNames
      .slice(0, 2) // get the first two names
      .map((val: any) => val.title) // get author title
    .join(", ");
  }

  private descriptionDate(date: string): string {
    return `${this.twig.filters.date(date, "F")} ${this.twig.filters.date(date, "d")} ${this.twig.filters.date(date, "Y")}`;
  }

  private metaDate(date: string): string {
    return `${this.twig.filters.date(date, "Y")}-${this.twig.filters.date(date, "m")}-${this.twig.filters.date(date, "d")}`;
  }

  private truncDescription(content: string): string {
    const cleanContent: string = this.twig.filters.striptags(content) || "";
    // strip context tags and return first paragraph
    return cleanContent.trim().split(/(\.|\?)/)[0];
  }
}
