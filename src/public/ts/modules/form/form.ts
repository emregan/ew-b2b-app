import * as $ from 'jquery';
import BaseModule from '@core/base-module';
import * as EmailValidator from 'email-validator';

const VALIDATION_MESSAGE_ALIASES: any = {
    'Please fill out this field.': 'This field is required.',
    'Please select an item in the list.': 'This field is required.'
};

const ZIP_INPUT_SELECTOR = '[name=zip-code], [name=Zip]';
const SCHOOL_INPUT_SELECTOR = 'select[name=School]';
const SFDC_ACCOUNT_ID_INPUT_SELECTOR = ':input[name=SFDCAccountID]';

interface FieldError {
    field: string;
    message: string;
}

export default class Form extends BaseModule {
    private form: JQuery = $.hook('form');

    constructor() {
        super();
        this.initSubmit();
        this.initRequired();
        this.initTextFields();
        this.initCheckboxes();
        this.initCheckboxGroups();
        this.initDropdowns();
        this.initEmailAddress();
        this.initSchoolZipCodeLookup();
    }

    private initSubmit() {
        this.form.on('submit', this.submitForm.bind(this));
    }

    private initRequired() {
        this.form.find(':input[data-required]').prop('required', true);
    }

    private initTextFields() {
        this.form.find('.mdc-text-field__input').on('blur', (event: JQuery.Event) => {
            const input = <HTMLFormElement> event.target;

            const container = $(input).closest('.mdc-text-field');

            container.find('.mdc-text-field-helptext--validation-msg').text(this.getInputValidationMessage(input));
        });
    }

    private initCheckboxes() {
        // validate checkbox group
        this.form.find('.mdc-checkbox__native-control[required]')
            .on('change', (event: JQuery.Event) => this.validateCheckboxInput(<HTMLFormElement> event.target));
    }

    private initCheckboxGroups() {
        // validate checkbox group
        this.form.find('.form__checkbox-group-wrapper[data-required]')
            .find('.mdc-checkbox__native-control')
            .on('change', (event: JQuery.Event) => {
                const container = $(event.target).closest('.form__checkbox-group-wrapper');
                this.validateCheckboxGroup(<HTMLFormElement> container.get(0));
            });
    }

    private initDropdowns() {
        // validate checkbox group
        this.form.find('.form__select[required]')
            .on('change', (event: JQuery.Event) => this.validateDropdown(<HTMLFormElement> event.target));
    }

    private initEmailAddress() {
        const match = window.location.search.match(/[\?\&]email=(.*?)(\&|$)/);

        if (match && EmailValidator.validate(match[1])) {
            this.form.find('[name=EmailAddress]').focus().val(match[1]).blur();
        }
    }

    private initSchoolZipCodeLookup() {
        this.form.find(ZIP_INPUT_SELECTOR).on('change', this.lookupSchoolsByZipCode.bind(this));
        this.form.find(SCHOOL_INPUT_SELECTOR).on('change', this.updateSfdcCustomerId.bind(this));
    }

    private updateSfdcCustomerId(e: JQueryEventObject) {
        const select: JQuery = $(e.currentTarget);
        const form = select.closest('form');
        const input = form.find(SFDC_ACCOUNT_ID_INPUT_SELECTOR);
        const sfdcCustomerId = select.find('option:selected').data('sfdcCustomerId');
        input.val(sfdcCustomerId);
    }

    private lookupSchoolsByZipCode(e: JQueryEventObject) {
        const input: JQuery = $(e.currentTarget);
        const zipCode = <string> input.val();
        const form = input.closest('form');
        const select = form.find(SCHOOL_INPUT_SELECTOR);

        // remove old options
        select.find('option').remove();
        select.trigger('change');

        if (zipCode) {
            $.ajax({
                url: "/xhr/sfdc-customer",
                method: "GET",
                data: {zipCode: btoa(zipCode)},
                success: (result: Array<[string]>) => {
                    result.forEach((row: [string]) => {
                        const option = new Option(row[0], row[0], false, false);
                        option.setAttribute('data-sfdcCustomerId', row[1]);
                        select.append(option);
                        select.trigger('change');
                    });
                }
            });
        }
    }

    private submitForm(e: JQueryEventObject) {
        const el = <HTMLFormElement> e.currentTarget;
        const form: JQuery = $(el);
        const formData: string = form.serialize();

        e.preventDefault();

        if (form.data('disabled')) {
            return;
        }

        const isValid = this.validateForm(form);

        if (!isValid) {
            return;
        }

        // submit the form
        if (form.data('ajax')) {
            this.disableForm(form);

            $.ajax({
                url: form.attr('action'),
                type: form.attr('method'),
                data: formData,
                success: () => {
                    window.location.href = form.data('redirect') || `${window.location.pathname}/thank-you`;
                },
                error: () => {
                    this.enableForm(form);

                    // @TODO error handling
                    alert('Could not submit form. Please check your submission and try again.');
                }
            });
        } else {
            el.submit();
        }
    }

    private disableForm(form: JQuery) {
        form.find(':input').prop('readonly', true);
        form.find('input[type=submit]').each((index: number, el: HTMLElement) => {
            const submit = $(el);
            submit.data('text', submit.val());
            submit.val('Processing...');
        });
        form.data('disabled', true);
    }

    private enableForm(form: JQuery) {
        form.find(':input').prop('readonly', false);
        form.find('input[type=submit]').each((index: number, el: HTMLElement) => {
            const submit = $(el);
            submit.val(submit.data('text'));
        });
        form.data('disabled', false);
    }

    private validateForm(form: JQuery): boolean {
        return [
            this.validateTextFields(form),
            this.validateCheckboxGroups(form),
            this.validateCheckboxes(form),
            this.validateDropdowns(form)
        ].every(
            (isValid: boolean): boolean => isValid,
        );
    }

    private getInputValidationMessage(input: HTMLFormElement)
    {
        let message: string = input.validationMessage;

        if (VALIDATION_MESSAGE_ALIASES.hasOwnProperty(message)) {
            message = VALIDATION_MESSAGE_ALIASES[message];
        }

        return message;
    }

    private validateTextFields(form: JQuery): boolean {
        // validate text fields using MDC
        form.find('.mdc-text-field__input')
            .each((index: number, el: HTMLElement) => {
                $(el).focus().blur()
            });

        return form.find('.mdc-text-field--invalid').length === 0;
    }

    private validateCheckboxGroup(el: HTMLElement) {
        const container = $(el);
        const isValid = container.find(':checkbox:checked').length > 0;
        const validationMessage = isValid ? '' : VALIDATION_MESSAGE_ALIASES['Please fill out this field.'];

        container.find('.form__error-message').text(validationMessage);

        container.toggleClass('form__checkbox-group-wrapper--invalid', !isValid);

        container.find('.mdc-checkbox').toggleClass('mdc-checkbox--invalid', !isValid);
    }

    private validateCheckboxGroups(form: JQuery): Boolean {
        form.find('.form__checkbox-group-wrapper[data-required]')
            .each((index: number, el: HTMLElement) => this.validateCheckboxGroup(el));

        return form.find('.form__checkbox-group-wrapper--invalid').length === 0;
    }

    private validateCheckboxInput(input: HTMLFormElement) {
        const isValid = input.checkValidity();

        const container = $(input).closest('.form__checkbox-wrapper');

        container.find('.form__error-message').text(this.getInputValidationMessage(input));

        container.find('.mdc-checkbox').toggleClass('mdc-checkbox--invalid', !isValid);
    }

    private validateCheckboxes(form: JQuery): Boolean {
        // validate checkbox group
        form.find('.mdc-checkbox__native-control[required]')
            .each((index: number, el: HTMLElement) => this.validateCheckboxInput(<HTMLFormElement> el));

        return form.find('.mdc-checkbox--invalid').length === 0;
    }

    private validateDropdown(input: HTMLFormElement) {
        const isValid = input.checkValidity();
        const container = $(input).closest('.form__input-wrapper');

        container.find('.form__error-message').text(this.getInputValidationMessage(input));

        $(input).toggleClass('form__select--invalid', !isValid);
    }

    private validateDropdowns(form: JQuery): Boolean {
        form.find('.form__select')
            .each((index: number, el: HTMLElement) => this.validateDropdown(<HTMLFormElement> el));

        return form.find('.form__select--invalid').length === 0;
    }
}
