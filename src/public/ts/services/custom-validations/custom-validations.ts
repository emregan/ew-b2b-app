import * as $ from 'jquery';
interface constrcutorArgs {
    form: JQuery;
    emailField: JQuery;
    emailErrMsg: string;
    actionEndpoint: string;
}

export default class CustomValidations {
    protected $formMain: JQuery;// = $("#frmMain");
    protected $emailField: JQuery;// = $("#emailAddress");
    protected emailErrMsg: string;
    protected actionEndpoint: string;
    protected validationRules: any = {
        ignore: ".ignore",
        errorElement: "span",
        errorClass: "form-error",
        errorPlacement: this.errorPlacement.bind(this),
        rules: {
            emailAddress: {
                required: true,
                emailStrict: true,
                minlength: 6
            }
        },
        messages: {
            emailAddress: {
                required: this.emailErrMsg,
                emailStrict: this.emailErrMsg,
                minlength: this.emailErrMsg
            }
        },
        submitHandler: this.submitHandler.bind(this),
    };

	constructor(args:constrcutorArgs) {
        console.log('CustomValidations: constructor')
        // Assign args
        this.$formMain       = args.form || this.$formMain;
        this.$emailField     = args.emailField || this.$emailField;
        this.emailErrMsg    = args.emailErrMsg || this.emailErrMsg;
        this.actionEndpoint = args.actionEndpoint || this.actionEndpoint;

		if (this.$emailField.length) {
            this.initValidate();
		}
	}

    private initValidate() {
        console.log('CustomValidations: initValidate');
        this.$formMain.validate(this.validationRules);
    }

    protected errorPlacement(error, element:HTMLElement) {
        console.log('CustomValidations: errorPlacement');
        $(element).siblings(":last").after(error);
    }

    protected submitHandler(form) {
        console.log('CustomValidations: submitHandler');
        this.$formMain.attr("action", this.actionEndpoint);
        form.submit();
    }
}
