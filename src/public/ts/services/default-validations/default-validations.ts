import * as $ from 'jquery';

export default class DefaultValidations {
    constructor() {
        $.validator.setDefaults({ ignore: ":hidden:not(select)" });

        $.validator.addMethod("passwordStrict", function (value, element) {
            //return this.optional(element) || value == value.match(/^\b(?=.*\d)(?=.*[a-zA-Z]).{8,128}\b$/i);
            return this.optional(element) || value == value.match(/^(?=.*\d)(?=.*[a-zA-Z]).{8,128}$/i);
        }, "Passwords must be at least eight characters long and contain at least one number.");

        $.validator.addMethod("emailStrict", function (value, element) {
            return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+([a-z]{2,}(?:\.[a-z]{2})?)$/i.test(value);
        }, "Please enter your email address in the format account@domain.com.");

        $.validator.addMethod("alphanumeric", function (value, element) {
            return this.optional(element) || value == value.match(/^[-a-zA-Z0-9 ]+$/);
        }, "Only letters, numbers & space allowed.");

        $.validator.addMethod("alphabet", function (value, element) {
            return this.optional(element) || value == value.match(/^[a-zA-Z ]+$/);
        }, "Only characters & space allowed.");

        $.validator.addMethod("numeric", function (value, element) {
            return this.optional(element) || value == value.match(/^[0-9 ]+$/);
        }, "Only numbers allowed.");
        $.validator.addMethod("notSimilarTo", function (value, element, param) {
            let notSimilar = true;
            value = $.trim(value).toLowerCase();
            param = $.trim(String($(param[0]).val())).toLowerCase();
            if (param != "" && value.indexOf(param) !== -1) {
                notSimilar = false;
            }
            return this.optional(element) || notSimilar;
        }, "Please enter a different value.");

        $.validator.addMethod("phoneUS", function (phone_number, element) {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        }, "Please specify a valid phone number");
        $.validator.addMethod("careof", function (value, element) {
            return this.optional(element) || !(/(c(are|\.|\/|\\) ?o(\.|f)?)/i).test(value);
        }, "Please do not enter C/O.");

        $.validator.addMethod("postoffice", function (value, element) {
            return !(/(p((.o|o|.o.|ost|ost\s+office)|(\.|\/|\\)|(o))\s+box{1})/i).test(value);

        }, "Please do  not enter postbox.");

        $.validator.addMethod("pocheck", function (value, element) {
            if (value.length > 1 && (value.indexOf("_") > -1 || value.indexOf(" ") > -1)) {
                return false;
            } else {
                return true;
            }
        }, "Please enter a valid purchase order number.");

        $.validator.addMethod("phone", function (value, element) {
            return (/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/).test(value);
        }, "Please enter a valid phone number.");

        $.validator.addMethod("zipcode", function (value, element) {
            return this.optional(element) || /\d{5}-\d{4}$|^\d{5}$/.test(value);
        }, "Please enter a valid zip code.");

        $.validator.addMethod("cc_length_valid", function (value, element) {
            let valid_length = true;
            $("#" + element.id).validateCreditCard(function (result) {
                valid_length = result.length_valid;
                return valid_length;
            });
            return valid_length;
            //return element.validateCreditCard(value,{validate_number}).length_valid;
        }, "Please enter a valid credit card number");

        $.validator.addMethod("cc_valid", function (value, element) {
            let cc_valid = true;
            $("#" + element.id).validateCreditCard(function (result) {
                cc_valid = result.luhn_valid && result.length_valid;
                return cc_valid;
            });
            return cc_valid;
            //return element.validateCreditCard(value,{validate_number}).length_valid;
        }, "Please enter a valid credit card number");


        $.validator.addMethod("cvvcheck", function (value, element) {
            const cvv_cardtype = value;
            const separatorIndex = cvv_cardtype.indexOf('/');
            if (separatorIndex == -1) return false;
            const cvv_cardtype_arr = cvv_cardtype.split('/');
            if (cvv_cardtype_arr.length > 2 || cvv_cardtype_arr.length <= 0) return false;
            const ccCVVNum = cvv_cardtype_arr[0];
            const ccType = cvv_cardtype_arr[1];
            if (ccCVVNum != undefined) {
                if (ccCVVNum == '' || ccCVVNum == '000' || ccCVVNum == '0000') {
                    return false;
                }
                else if (ccType == '3000') {
                    if (ccCVVNum.length != 4) {
                        return false;
                    }
                }
                else if (ccCVVNum.length != 3) {
                    return false;
                }
            }
            return true;
        }, "Please enter a valid cvv.");

        $.validator.addMethod("birthValidation", function (value, element) {
            return (/^\d{1,2}\/\d{4}$/).test(value);
        }, "Must be a valid Date.");


        $.validator.addMethod("ccexpdate", function (value, element) {
            // Initialize todays date   i.e start date
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
            // Initialize End/Expiry date i.e. adding 10 years to expire
            const futureLimitDate = new Date(today.getFullYear() + 10, today.getMonth(), 1, 0, 0, 0, 0);
            let expDate = value;
            let expYearCheck = '';
            // Check Date format
            const separatorIndex = expDate.indexOf('/');
            if (separatorIndex == -1) return false; // Return false if no / found
            const expDateArr = expDate.split('/');
            if (expDateArr.length > 2) return false; // Return false if no num/num format found
            // Check Month for validity
            if (parseInt(expDateArr[0], 10) < 1 || parseInt(expDateArr[0], 10) > 12) {
                //If month is not valid i.e not in range 1-12
                return false;
            }
            //Check Year for format YY or YYYY
            switch (expDateArr[1].length) {
                case 2: expYearCheck = String(2000 + parseInt(expDateArr[1], 10)); break; // If YY format convert it to 20YY to it
                case 4: expYearCheck = expDateArr[1]; break; // If YYYY format assign it to check Year Var
                default: return false;
            }
            // Calculated new exp Date for ja
            expDate = new Date(parseInt(expYearCheck, 10), (parseInt(expDateArr[0], 10) - 1), 1, 0, 0, 0, 0);
            if (startDate <= expDate) {
                if (expDate <= futureLimitDate) {
                    // Date validated
                    return true;
                } else {
                    // Date exceeds future date
                    return false;
                }
            } else {
                // Date is earlier than todays date
                return false;
            }
        }, "Must be a valid Expiration Date.");

        /* INPUT FIELDS ACCEPT ONLY ALPHABETS -START */

        /*
                USE class="alpha-only" in HTML block
        */
        $('.alpha-only').keydown(function (evt) {
            if (evt.ctrlKey || evt.altKey) {
                evt.preventDefault();
            } else {
                const key = (evt.which) ? evt.which : evt['keyCode'];
                if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
                    evt.preventDefault();
                }
            }
        });


        /* INPUT FIELDS ACCEPT ONLY ALPHABETS -ENDS */

        /* INPUT FIELDS ACCEPT ONLY ALPHABETS AND NUMBERS -START */

        /*
            USE class="alpha-numeric" in HTML block
        */
        $(".alpha-numeric").on("keypress", function (evt) {
            const keycode = (evt.which) ? evt.which : evt['keyCode'];
            if (!((keycode >= 65 && keycode <= 90) ||
            (keycode >= 97 && keycode <= 122) ||
            (keycode >= 48 && keycode <= 57) ||
            (keycode == 8) || (keycode == 32) ||
            (keycode >= 37 && keycode <= 40) ||
            (keycode == 46) || (keycode < 31)
            ))
                evt.preventDefault();
            else
                return true;
        });

        /* INPUT FIELDS ACCEPT ONLY ALPHABETS AND NUMBERS -ENDS */

        /* INPUT FIELDS ACCEPT ONLY NUMBERS -START */

        /*
            USE class="number-only" in HTML block
        */
        $(".number-only").on("keypress", function (evt) {
            const charCode = (evt.which) ? evt.which : evt['keyCode'];
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;

            return true;
        });

        /* INPUT FIELDS ACCEPT ONLY NUMBERS -ENDS */

        /* INPUT FIELD FOR QUANTITY -START */

        /*
            USE class="qnty-only" in HTML block
                - Accepts only numbers, backspace, delete.
                - Default input will be 1 if user enter 0 or null/empty value.
        */
        $(".item-quantity").on("keypress", function (evt) {
            const charCode = (evt.which) ? evt.which : evt['keyCode'];
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;

            return true;

        });
        $(".item-quantity").on("blur", function (e) {
            const $this = $(this).val();
            if ($this == "" || $this == 0)
                $(this).val('1');
        });

        /* INPUT FIELD FOR QUANTITY -ENDS */
    }
}
