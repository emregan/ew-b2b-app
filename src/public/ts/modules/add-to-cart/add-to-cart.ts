import * as $ from 'jquery';
import * as is from 'is_js';

import BaseModule from '@core/base-module';
import { ScrollControl } from '@core/helpers';
import { Reveal } from 'foundation-sites/js/foundation.reveal';
import Analytics from '@service/analytics';

import { CartPayload, CartAddProduct, CartAddPayload, CartResponse, Link } from './IAddToCart';


const ADD_TO_CART_URL = '/Sites/HMH/Handlers/ajax-methods.aspx/AddToCart';

const MODAL_TEMPLATE = `
    <div class="reveal modal" data-reveal>
        <div class="modal__close">
            <button
                class="ui-nav-icon ui-nav-icon--selected"
                type="button"
                data-close
                aria-label="Close reveal"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.257 9.759A.823.823 0 0 0 .873 10c.24 0 .445-.069.617-.241l3.493-3.546L8.51 9.76a.823.823 0 0 0 .617.241c.24 0 .445-.069.616-.241.343-.344.343-.895 0-1.205L6.182 5.01l3.527-3.546c.342-.344.342-.895 0-1.205-.343-.344-.89-.344-1.199 0L4.983 3.804 1.455.258c-.342-.344-.89-.344-1.198 0-.343.344-.343.895 0 1.205l3.527 3.546L.257 8.554c-.343.31-.343.86 0 1.205z" class="u-fill-black" fill-rule="nonzero" fill="none"/></svg>
            </button>
        </div>

        <div class="modal__wrapper">
            <div class="modal__heading u-style-weight-bold u-style-display-m">We&rsquo;re sorry</div>
            <div class="modal__description"></div>
        </div>
    </div>
`;

const BUTTON_TEMPLATE = `
    <div class="ui-btn-primary" data-js-animate="ui-btn-primary">
        <a class="ui-btn-primary__btn" data-js-hook="ui-btn-primary__btn"></a>
        <div class="ui-btn-primary__shadow" data-js-hook="ui-btn-primary__btn"></div>
    </div>
`;

enum Retailer {
    amazon = 'amazon',
    apple = 'apple',
    barnesNobles = 'barnesNobles',
    google = 'google',
    kobo = 'kobo',
    booksaMillion = 'booksaMillion',
    indieBound = 'indieBound',
    powellsBooks = 'powellsBooks'
}

enum StatusCode {
    success = 'success',
    lowstock = 'lowstock',
    maxstock = 'maxstock',
    invalidqualification = 'invalidqualification',
    relogin = 'relogin'
}

enum ProductType {
    riverside = 'riverside'
}

enum UserType {
    individual = 'individual',
    guest = 'guest'
}

interface RetailerInfo {
    url: string;
    image: string;
}

export default class AddToCart extends BaseModule {
    protected formSelector: string = $.hookStr('ui-add-to-cart');
    protected submitSelector: string = $.hookStr('ui-add-to-cart__submit');
    protected quantitySelector: string = $.hookStr('ui-add-to-cart__quantity');
    protected inputSelector: string = $.hookStr('ui-add-to-cart__input');
    protected inputDisplaySelector: string = $.hookStr('ui-add-to-cart__input-display');
    protected $navCart: JQuery = $.hook('nav-cart');

    constructor() {
        super();

        this.initListeners();
    }

    private initListeners() {
        $(document).on('click', this.quantitySelector, this.plusMinus.bind(this));
        $(document).on('submit', this.formSelector, this.onSubmit.bind(this));

        /** Foundation events */
        $(document).on('open.zf.reveal', this.modalOpen.bind(this));
        $(document).on('closed.zf.reveal', this.modalClose.bind(this));
    }

    /**
     * Add or subtract quantity based on the method from the elemend clicked
     * @param {Object} e
     */
    protected plusMinus(e) {
        e.preventDefault();
        const $el = $(e.currentTarget);
        const method = $el.data('quantity');
        const $form = $el.closest(this.formSelector);

        if (is.undefined(method)) {
            return;
        }

        /** Call plus/minus method */
        this[method].call(this, $form);

        this.toggleMinus($form);
    }

    /**
     * Hide minus button if quantity is equal to 1
     * @param {JQuery} $el
     */
    protected hideMinusBtn() {
        const $el = $(this.quantitySelector);

        if ($el.length > 0) {
            $el.each((i, el) => {
                let $el = $(el);
                let $input = $el.siblings(this.inputSelector);

                if ($el.data('quantity') !== 'plus' && +$input.val() > 0) {
                    $el.css('visibility', 'hidden');
                }
            });
        }
    }

    /**
     * Shows or hide the minus button if quantity is greater than 1
     * @param {JQuery} $form [description]
     */
    private toggleMinus($form: JQuery) {
        const $input: JQuery = $form.find(this.inputSelector);
        const $minus = $form.find(this.quantitySelector).filter('[data-quantity="minus"]');
        let quantity: number = +$input.val();

        if (quantity > 1) {
            $minus.removeAttr('style');
        } else {
            $minus.css('visibility', 'hidden');
        }
    }

    /**
     * Add quantity
     */
    protected plus($form: JQuery) {
        const $input: JQuery = $form.find(this.inputSelector);
        const $inputDisplay: JQuery = $form.find(this.inputDisplaySelector);
        let quantity: number = +$input.val();

        quantity++;

        $input.val(quantity);

        $inputDisplay.html(quantity.toString());
    }

    /**
     * Subtract quantity
     */
    protected minus($form: JQuery) {
        const $input: JQuery = $form.find(this.inputSelector);
        const $inputDisplay: JQuery = $form.find(this.inputDisplaySelector);
        let quantity: number = +$input.val();

        if (quantity > 1) {
            quantity--;
        }

        $input.val(quantity);

        $inputDisplay.html(quantity.toString());
    }

    /**
     * Lock window when modal is open
     * @param {JQueryEventObject} e
     */
    protected modalOpen(e:JQueryEventObject) {
        ScrollControl.lock();
    }

    /**
     * Unlock window when modal is open
     * @param {JQueryEventObject} e
     */
    protected modalClose(e:JQueryEventObject) {
        ScrollControl.unlock();
    }

    protected isAddToCartDisabled($form: JQuery) {
        return $form.find( this.submitSelector ).prop('disabled');
    }

    protected disableAddToCart($form: JQuery) {
        $form.find( this.submitSelector )
            .prop('disabled', true)
            .text('Processing...');
    }

    protected enableAddToCart($form: JQuery) {
        const $submit = $form.find( this.submitSelector );

        // toggle minus button
        this.toggleMinus($form);

        $submit.prop('disabled', false)
            .text($submit.data('text'));
    }

    protected getProductFromAddToCart($form: JQuery): CartAddProduct {
        const $input = $form.find( this.inputSelector );
        const qty = ($input.length > 0) ? Number($input.val()) : 0;

        return {
            qty: qty,
            productType: $form.data('url'),
            code: String($form.data('productid'))
        };
    }

    protected getRetailers(isbn13: string, retailers: Retailer[]): RetailerInfo[] {
        return retailers.map(retailer => this.getRetailerInfo(isbn13, retailer));
    }

    protected getRetailerUrl(isbn13: string, retailer: Retailer): string {
        switch (retailer) {
            case Retailer.amazon:
                return `http://www.amazon.com/s/?url=search-alias=aps&field-keywords=${isbn13}&tag=thekcs-20&link_code=wql&_encoding=UTF-8`;
            case Retailer.apple:
                return `http://itunes.apple.com/us/book/isbn${isbn13}`;
            case Retailer.barnesNobles:
                return `http://click.linksynergy.com/fs-bin/click?id=zlmPigulqw0&subid=&offerid=229293.1&type=10&tmpid=8432&u1=bks&RD_PARM1=http%253A%252F%252Fsearch.barnesandnoble.com%252Fbooksearch%252Fisbninquiry.asp%253Fean%253D${isbn13}`;
            case Retailer.google:
                return `http://books.google.com/books?pubid=21000000000144498&isbn=${isbn13}`;
            case Retailer.kobo:
                return `http://www.kobobooks.com/search/search.html?q=${isbn13}`;
            case Retailer.booksaMillion:
                return `http://www.booksamillion.com/search?query=${isbn13}`;
            case Retailer.indieBound:
                return `http://www.indiebound.org/book/${isbn13}`;
            case Retailer.powellsBooks:
                return `http://www.powells.com/partner/32559/biblio/${isbn13}?campaign=site`;
        }
    }

    protected getRetailerInfo(isbn13: string, retailer: Retailer): RetailerInfo {
        return {
            url: this.getRetailerUrl(isbn13, retailer),
            image: `/Sites/HMH/Images/Store/${retailer}.jpg`
        };
    }

    protected addToCartRequest($form: JQuery, payload: CartAddPayload) {
        this.disableAddToCart($form);

        $.ajax({
            type: 'POST',
            url: ADD_TO_CART_URL,
            data: JSON.stringify(payload),
            contentType: 'application/json',
            dataType: 'json',
            success: (response?: CartResponse) => this.addToCartSuccess($form, response),
            complete: () => this.enableAddToCart($form)
        });
    }

    protected addToCartSuccess($form: JQuery, response?: CartResponse) {
        let data: CartPayload;

        if (!response) {
            console.error('Empty response from add to cart ajax');
            return;
        }

        try {
            data = JSON.parse(response.d);
        } catch (e) {
            console.error(e);
            return;
        }

        if (!data) {
            console.error('Empty payload from add to cart ajax');
            return;
        }

        const title = $form.data('title');
        const statusCode = data.statusCode.toLowerCase();
        const sitecoreProductType = data.SitecoreProductType.toLowerCase();
        const sitecoreUserType = data.SitecoreuserType.toLowerCase();
        const quantityAdded = data.quantityAdded;
        const url = $form.data('url');

        if (statusCode === StatusCode.success || (statusCode === StatusCode.lowstock && quantityAdded > 0) || (statusCode === StatusCode.maxstock && quantityAdded > 0)) {
            this.updateNavCartCount(data.totalItems);
            Analytics.addedToCart(data);
        } else if (statusCode === StatusCode.invalidqualification) {
            if (sitecoreProductType === ProductType.riverside && (sitecoreUserType == UserType.individual || sitecoreUserType == UserType.guest)) {
                this.showErrorMessage(
                    'You have selected a product that is available for purchase only by a customer with an Institutional/ Assessment Professional account.',
                    [
                        {
                            href: `/account/CreateAccount?ReturnUrl=${encodeURIComponent(url)}`,
                            text: 'Create an Institutional/ Assessment Professional account'
                        },
                        {
                            href: '/customer-care/faqs',
                            text: 'Learn More'
                        },
                        {
                            href: 'http://customercare.hmhco.com/contactus/contact_us.html',
                            text: 'Contact Us',
                            target: '_blank'
                        }
                    ],
                    {
                        href: `/account/sign-in?ReturnUrl=${encodeURIComponent(url)}&inCheckout=false`,
                        text: 'Sign In'
                    }
                );
            } else {
                this.showErrorMessage(
                    'The product you have selected does not match your qualification level.',
                    [
                        {
                            href: '/customer-care/faqs',
                            text: 'Learn More'
                        },
                        {
                            href: 'http://customercare.hmhco.com/contactus/contact_us.html',
                            text: 'Contact Us',
                            target: '_blank'
                        }
                    ]
                );
            }
        } else if (statusCode === StatusCode.relogin) {
            this.showErrorMessage(
                'You have selected a product that is available for purchase only by a customer with an institutional account. If you have an institutional account, please sign out and sign back in using an institutional account email address and password.',
                [
                    {
                        href: `/account/CreateAccount?ReturnUrl=${encodeURIComponent(url)}&LogintoInstOrAss=true`,
                        text: 'Create an Institutional Professional account'
                    },
                    {
                        href: '/customer-care/faqs',
                        text: 'Learn More'
                    },
                    {
                        href: 'http://customercare.hmhco.com/contactus/contact_us.html',
                        text: 'Contact Us',
                        target: '_blank'
                    }
                ],
                {
                    href: `/account/sign-in?ReturnUrl=${encodeURIComponent(url)}&inCheckout=false`,
                    text: 'Sign In'
                }
            );
        } else if (statusCode === StatusCode.maxstock && quantityAdded <= 0) {
            this.showErrorMessage(`${title} is already in your cart.  Please review the quantity in your cart.`);
        } else {
            this.showErrorMessage('The product you selected is not currently available for purchase. Please check back soon or contact Customer Service at 855-969-4642. Hours of Operation 8:00 am to 10:00 pm EST M-F, Saturday 9:00 am to 5:00 pm.');
        }
    }

    protected updateNavCartCount(count: number) {
        const jewel: string = (count > 99) ? '99+' : String(count);
        this.$navCart.text(jewel);
        this.$navCart.toggleClass('u-background-gold', count > 0);
    }

    protected showErrorMessage(message: string, links?: Link[], button?: Link) {
        const $modal: any = $(MODAL_TEMPLATE);

        $modal.appendTo('body');

        const $description: JQuery = $modal.find('.modal__description');

        const $message: JQuery = $('<p>').html(message).appendTo($description);

        if (button) {
            const $button: JQuery = $(BUTTON_TEMPLATE).appendTo($description);

            $button.find('.ui-btn-primary__btn').attr('href', button.href).text(button.text);
        }

        if (links && links.length > 0) {
            const $list: JQuery = $('<ul>').appendTo($description);

            links.forEach((link: Link) => {
                const $item: JQuery = $('<li>').appendTo($list);

                const $link: JQuery = $('<a>', link).appendTo($item);
            });
        }

        new Reveal($modal);

        $modal.foundation('open');

        $modal.on('closed.zf.reveal', (e: JQueryEventObject) => {
            $modal.foundation('_destroy').remove();
        });
    }

    protected isEbook(format: string): boolean {
      return /e-?book/i.test(format);
    }

    protected isPrintOnDemand(status: string): boolean {
      return /print\s?on\s?demand/i.test(status);
    }

    /**
     * On Submit, add item to cart
     */
    protected onSubmit(e) {
        e.preventDefault();

        const $form: JQuery = $(e.currentTarget);

        if (this.isAddToCartDisabled($form)) {
            return;
        }

        const product = this.getProductFromAddToCart($form);

        if (product.qty <= 0) {
            return;
        }

        const url = $form.data('url');
        const isbn13 = $form.data('isbn13');
        const status = $form.data('inventorystatus');
        const format = $form.data('format');

        // Add to cart button label is not Add to Cart nor Pre-Order
        if (this.isPrintOnDemand(status)) {
            window.location.href = url;

            // @TODO show POD modal

            /*
            const retailers = this.getRetailers(isbn13, [
                Retailer.amazon,
                Retailer.booksaMillion,
                Retailer.barnesNobles,
                Retailer.indieBound,
                Retailer.powellsBooks
            ]);
            */

        } else if (this.isEbook(format)) {
            window.location.href = url;

            // @TODO show ebook modal

            /*
            const retailers = this.getRetailers(isbn13, [
                Retailer.amazon,
                Retailer.apple,
                Retailer.barnesNobles,
                Retailer.google,
                Retailer.kobo
            ]);
            */

        } else {
            this.addToCartRequest($form, {items: product});
        }
    }
}
