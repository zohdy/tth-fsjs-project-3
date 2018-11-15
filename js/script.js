$(document).ready(() => {
    // Add focus to the first input-field on the site
    $('input').first().focus();
    handleJobRole();
    handleTshirtMenu();
    handleActivitiesRegister();
    handlePaymentInfo();
    handleValidation();
    removeErrorMessageOnFocus();
});

handleJobRole = () => {
    // Hide input-field initially
    $('#other-title').hide();
    // Show input-field if checkbox option 'other' is selected.
    $('#title').change(() => {
        const selectedOption = $('#title option:selected').text();
        if(selectedOption === 'Other'){
            $('#other-title').show();
        } else {
            $('#other-title').hide();
        }
    });
};
handleTshirtMenu = () => {
    // Make the first dropdown menu option unselectable
    $("select option:contains('Select Theme')").prop('disabled', true);
    // Hide color label and menu initially
    $('#colors-js-puns').hide();

    $('#design').change(() => {
        // Show color label and menu after t-shirt is selected
        $('#colors-js-puns').show();
        // If the first menu option in the 'design' select-box is selected.
        if ($('#design option:eq(1)').is(':selected')) {
            // Loop through the items in the 'color' select-box and only display the first 3
            $('#color > option').each((colIndex, colElm) => {
                if(colIndex > 2){
                    $(colElm).hide();
                } else {
                    $(colElm).show();
                }
            });
        } else {
            // Else only display the last 3
            $('#color > option').each((colIndex, colElm) => {
                if(colIndex < 3){
                    $(colElm).hide();
                } else {
                    $(colElm).show();
                }
            });
        }
    });
};

handleActivitiesRegister = () => {
    let total = 0;

    $('.activities input').click(function() {
        // Get the price from the corresponding labels text and format it
        let price = parseInt($(this).parent()
            .text()
            .match(/\$[0-9]+/)[0]
            .replace('$', ''));
        if ($(this).prop('checked')) {
            total += price;
        } else {
            total -= price;
        }
        // Remove the element first, to avoid re-appending for each click event
        $('.total-price').remove();
        $('.activities').append(`<h3 class="total-price">Total: \$${total}</h3>`);

        switch ($(this).attr('name')) {
                case 'js-frameworks':
                    updateRegistrationFields('express');
                    break;
                case 'js-libs':
                    updateRegistrationFields('node');
                    break;
                case 'express':
                    updateRegistrationFields('js-frameworks');
                    break;
                case 'node':
                    updateRegistrationFields('js-libs');
                    break;
            }
        });
     // Helper method to change property values based on the clicked checkbox
     const updateRegistrationFields = (name) => {
        $('input[name='+ name +']').prop('disabled', event.currentTarget.checked);
        $("input:disabled").parents('label').css('color', 'grey');
        $("input:enabled").parents('label').css('color', '#000');
    }
};

handlePaymentInfo = () => {
    const creditCardDiv = $('#credit-card');
    const paypalDiv = creditCardDiv.next();
    const bitcoinDiv = paypalDiv.next();

    // Display the creditcard div by default and hide the others. Disable the title option on the select dropdown
    $("select option:contains('Select Payment Method')").prop('disabled', true);
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
    // Realtime email validation
    const emailField = $("#mail");
    let isEmailValid = false;
    emailField.on('keypress keydown keyup', function () {
        // Regex pattern borrowed from https://stackoverflow.com/a/9082446
        if(!$(this).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) || $(this).val().trim().length < 1){
            if(!$(this).next().hasClass('error')){
                $('#mail').after('<div class="error">Email must be valid e.g. "john@doe.com"</div>');
            }
        } else {
            isEmailValid = true;
            $(this).next('.error').remove();
        }
    });

   $('form').submit(function(){
       event.preventDefault();
       const nameField = $("#name").val().trim();
       const credCardNum = $('#cc-num').val().trim();
       const credCardZip = $('#zip').val().trim();
       const credCardCVV = $('#cvv').val().trim();

       // to avoid elm duplication
       $('.error').remove();

       // Regex pattern from 'https://andrewwoods.net/blog/2018/name-validation-regex/'
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
           } else if(!/^\d{13,16}$/.test(credCardNum)) {
               $('#cc-num').after('<div class="error">Card Number must contain 13-16 digits</div>');
               return false;
           }
           if (!/\d{5}/.test(credCardZip)){
               $('#zip').after('<div class="error">Zip Code must contain at least 5-digits</div>');
               return false
           }
           if (!/^\d{3}$/.test(credCardCVV)){
               $('#cvv').after('<div class="error">CVV must be a 3-digit number</div>');
               return false
           }
       }
       alert('Form submitted!');
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





