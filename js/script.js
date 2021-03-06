$(document).ready(() => {
    // Add focus to the first input-field on the site
    $('input').first().focus();
    handleJobRole();
    handleTshirtMenu();
    handleActivitiesReg();
    handlePaymentInfo();
    handleValidation();
    removeErrorMessageOnFocus();
});

handleJobRole = () => {
    // Hide input-field initially
    $('#other-title').hide();
    // Show input-field if checkbox option 'other' is selected.
    $('#title').change(() => {
        $('#title').val() === 'other' ? $('#other-title').show() : $('#other-title').hide();
    });
};
handleTshirtMenu = () => {
    // Make the first dropdown menu option unselectable
    $("#design option:first-child").prop('disabled', true);
    // Hide color label and menu initially
    $('#colors-js-puns').hide();

    $('#design').change(function(){
        // If the first menu option in the 'design' select-box is selected.
        if ($('#design').val() === 'js puns') {
            // Loop through the items in the 'color' select-box and only display the first 3
            $('#color > option').each((colIndex, colElm) => {
                colIndex > 2 ? $(colElm).hide() : $(colElm).show();
            });
        } else {
            // Only display the last 3
            $('#color > option').each((colIndex, colElm) => {
                colIndex < 3 ? $(colElm).hide() : $(colElm).show();
            });
        }
        // Show color label and menu after t-shirt is selected
        $('#colors-js-puns').show();
    });
};

handleActivitiesReg = () => {

    let total = 0;
    $('.activities input').on('click', e => {
        // Get the price from the corresponding labels text and format it
        let price = parseInt(e.target.parentElement
            .innerHTML
            .match(/\$[0-9]+/)[0]
            .replace('$', ''));
        e.target.checked ? total += price : total -= price;

        // Remove the element first, to avoid re-appending for each click event
        $('.total-price').remove();
        $('.activities').append(`<h3 class="total-price">Total: \$${total}</h3>`);
        switch (e.target.name) {
                case 'js-frameworks':
                    updateRegistrationFields(e, 'express');
                    break;
                case 'js-libs':
                    updateRegistrationFields(e, 'node');
                    break;
                case 'express':
                    updateRegistrationFields(e, 'js-frameworks');
                    break;
                case 'node':
                    updateRegistrationFields(e, 'js-libs');
                    break;
            }
        });
     // Helper method to change property values based on the clicked checkbox
     const updateRegistrationFields = (e, name) => {
         console.log(e.target);
         $('input[name='+ name +']').prop('disabled', e.target.checked);
         $("input:disabled").parents('label').css('color', 'grey');
         $("input:enabled").parents('label').css('color', '#000');
    }
};

handlePaymentInfo = () => {
    const creditCardDiv = $('#credit-card');
    const paypalDiv = creditCardDiv.next();
    const bitcoinDiv = paypalDiv.next();

    // Display the creditcard div by default and hide the others. Disable the title option on the select dropdown
    $("#payment option:first-child").prop('disabled', true);
    $("#payment").val('credit card');
    paypalDiv.hide();
    bitcoinDiv.hide();

    // show or hide elements based on the current selected payment option
    $('#payment').change(function () {
        if ($(this).val() === 'credit card'){
            creditCardDiv.show();
            paypalDiv.hide();
            bitcoinDiv.hide();
        } else if($(this).val() === 'paypal'){
            paypalDiv.show();
            creditCardDiv.hide();
            bitcoinDiv.hide();
        } else {
            bitcoinDiv.show();
            creditCardDiv.hide();
            paypalDiv.hide();
        }
    });
};


handleValidation = () => {
    // Regex pattern from 'https://andrewwoods.net/blog/2018/name-validation-regex/'
    const regexEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const regexCVV = /^\d{3}$/;
    const regexZip = /\d{5}/;
    const regexCCNum = /^\d{13,16}$/;

    // Realtime email validation
    const emailField = $("#mail");
    let isEmailValid = false;
    emailField.on('keypress keydown keyup', function () {
        if(!$(this).val().match(regexEmail) || $(this).val().trim().length < 1){
            if(!$(this).next().hasClass('error')){
                $('#mail').after('<div class="error">Email must be valid e.g. "john@doe.com"</div>');
            }
        } else {
            isEmailValid = true;
            $(this).next('.error').remove();
        }
    });

   $('form').submit(function(){
       // Todo Change these duplicated selectors...
       const nameField = $("#name").val().trim();
       const credCardNum = $('#cc-num').val().trim();
       const credCardZip = $('#zip').val().trim();
       const credCardCVV = $('#cvv').val().trim();

       // to avoid elm duplication
       $('.error').remove();

       if(nameField.trim().length < 1) {
           $('#name').after('<div class="error">Name must be valid</div>');
           return false;
       }
       if(!isEmailValid) {
           $('#mail').after('<div class="error">Email must be valid e.g. "john@doe.com"</div>');
           return false;
       }
       if ($('.activities input:checked').length === 0){
           $('.activities').after('<div class="error">At least one activity must be selected</div>');
           return false;
       }
       if($('#payment').val() === null){
           $('#payment').after('<div class="error">You must select a payment method</div>');
           return false;
       }
       if($('#payment').val() === 'credit card'){
           if (credCardNum.trim().length < 1){
               $('#cc-num').after('<div class="error">Card Number can not be empty</div>');
                    return false;
               } else if(!regexCCNum.test(credCardNum)) {
                   $('#cc-num').after('<div class="error">Card Number must contain 13-16 digits</div>');
                    return false;
               }
           if (!regexZip.test(credCardZip)){
               $('#zip').after('<div class="error">Zip Code must contain at least 5-digits</div>');
               return false
           }
           if (!regexCVV.test(credCardCVV)){
               $('#cvv').after('<div class="error">CVV must be a 3-digit number</div>');
               return false
           }
       }
       alert('Form submitted successfully!');
   });
};
removeErrorMessageOnFocus = () => {
    // mail error message is handled realtime
    $("input").not('#mail').focus(function() {
        // Only remove the error message next to the element
        if($(this).next().hasClass('error')){
            $('.error').remove();
        }
    });
    $('.activities input, #payment').change(function (){
        $('.error').remove();
    });
};





