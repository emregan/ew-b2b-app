export default class Config {
    public static props() {
        return [
            {
                type: "page",
                props: [
                    "type",
                    "level1",
                    "level2",
                    "level3",
                    "level4",
                    "level5",
                    "level6",
                    "tier",
                    {
                        type: "subject",
                        props: [
                            "primary",
                            "secondary"
                        ]
                    },
                    "program",
                    {
                        type: "programType",
                        props: [
                                "primary",
                                "secondary"
                            ]
                    },
                    "platform",
                    {
                        type: "gradeLevel",
                        props: [
                            "primary",
                            "secondary"
                        ]
                    },
                    {
                        type: "readingStandards",
                        props: [
                            "primary",
                            "secondary"
                        ]
                    },
                    "assessmentType",
                    "numberOfVideos",
                    "author",
                    "advisorName",
                    "searchTerm",
                    {
                        type: "searchResults",
                        props: [
                            "numberOfPrograms",
                            "numberOfProducts",
                            "numberOfCategories",
                            "numberOfBlogPosts",
                            "numberOfSiteResults",
                        ]
                    },
                    "relatedBlogPosts",
                    "relatedNewItems",
                    "publishDate",
                    "publishTime",
                    "tags",
                    "wordCount",
                    "currentBreakpoint",
                    "formType",
                ]
            },
            {
                type: "people",
                props: [
                    "name"
                ]
            },
            {
                type: "eventListing",
                props: Config.events()
            },
            {
                type: "event",
                props: Config.events()
            },
            {
                type: "webinar",
                props: [
                    "name",
                    "startDate",
                    "location",
                    "region",
                    "type",
                    "category",
                    "length",
                    "presenter",
                    "tags",
                    "brightcoveID"
                ]
            },
            {
                type: "promotions",
                props: [
                    "id",
                    "name",
                    "creative",
                    "position"
                ]
            },
            {
                type: "user",
                props: [
                    "id",
                    "registrationDate",
                    "firstPurchaseDate",
                    "previousPurchaseDate",
                    "weeksSincePreviousPurchase",
                    "countOfPurchases",
                    "lifetimeSpend",
                    "loggedInStatus",
                    {
                        type: "institution",
                        props: [
                            "institutionName",
                            "institutionLifetimeSpend",
                            "region",
                            "state",
                            "city",
                        ]
                    },
                    "membershipType",
                    "region",
                    "state",
                    "city",
                    "postalCode",
                    "email",
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "isNewsletterSubscriber",
                    "productSubscriptions",
                ]
            },
            {
                type: "product",
                props: Config.products()
            },
            {
                type: "cart",
                props: [
                    "subtotal",
                    "tax",
                    "estimatedShipping",
                    "shippingAmount",
                    "shippingType",
                    "paymentType",
                    "checkoutStep",
                    "total",
                    "cartId",
                    "promoCode",
                    "promoAmount",
                    "giftCardNumber",
                    "giftCardAmount",
                    "transactionId",
                    {
                        type: "products",
                        props: Config.products()
                    }
                ]
            },
            {
                type: "productList",
                props: [
                    "name",
                    {
                        type: "products",
                        props: Config.products()
                    }

                ]
            }
        ];
    }

    public static get(name: string) {
        for (const prop of Config.props()) {
            if (prop.type === name) {
                return prop;
            }
        }

        return false;
    }

    public static products() {
        return [
            {name: "isbn10", alias: "isbn-10", searchAlt: "isbn10Code"},
            {name: "isbn13", alias: "isbn-13-ean", searchAlt: "isbn13Code"},
            "format",
            {name: "currentPrice", searchAlt: "price", method: "parsePrice()"},
            {name: "regularPrice", method: "parsePrice()"},
            "level1",
            "level2",
            "level3",
            "level4",
            {
                type: "programType",
                props: [
                    "primary",
                    "secondary"
                ]
            },
            {name: "year", alias: "copyright-year", searchAlt: "copyright"},
            "program",
            "author",
            "title",
            {name: "numberOfPages", searchAlt: "pages"},
            "isBestSeller",
            {
                type: "subject",
                props: [
                    "primary",
                    "secondary"
                ]
            },
            {name: "productCode", alias: "product-code"},
            {name: "grade", searchAlt: "grades"},
            "age",
            {name: "region", alias: "national-state"},
            {name: "materialType", alias: "material-type"},
            "cartonQuantity",
            "availableDate",
        ];
    }

    private static events() {
        return [
            {name: "name", alias: "title"},
            {name: "startDate", alias: "eventDate"},
            "location",
            "region",
            "type"
        ];
    }
}
