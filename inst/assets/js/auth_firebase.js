"use strict";

var auth = firebase.auth();

var auth_firebase = function auth_firebase(ns_prefix) {
  var cookie_options = {
    expires: 365
  }; // set cookie to expire in 1 year

  if (location.protocol === 'https:') {
    // add cookie options that browsers are starting to require to allow you to
    // use cookies within iframes.  Only works when app is running on https.
    cookie_options.sameSite = 'none';
    cookie_options.secure = true;
  }

  var send_token_to_shiny = function send_token_to_shiny(user) {
    return user.getIdToken(true).then(function (firebase_token) {
      var polished_cookie = "p" + Math.random();
      Cookies.set('polished', polished_cookie, cookie_options);
      Shiny.setInputValue("".concat(ns_prefix, "check_jwt"), {
        jwt: firebase_token,
        cookie: polished_cookie
      }, {
        event: "priority"
      });
    });
  }; // Google Sign In


  var provider_google = new firebase.auth.GoogleAuthProvider();
  $(document).on("click", "#".concat(ns_prefix, "sign_in_with_google"), function () {
    auth.signInWithPopup(provider_google).then(function (result) {
      return send_token_to_shiny(result.user);
    })["catch"](function (err) {
      console.log(err);
      toastr.error("Sign in Error: ".concat(err.message), null, toast_options);
    });
  }); // Microsoft Sign In

  var provider_microsoft = new firebase.auth.OAuthProvider('microsoft.com');
  $(document).on("click", "#".concat(ns_prefix, "sign_in_with_microsoft"), function () {
    auth.signInWithPopup(provider_microsoft).then(function (result) {
      return send_token_to_shiny(result.user);
    })["catch"](function (err) {
      console.log(err);
      toastr.error("Sign in Error: ".concat(err.message), null, toast_options);
    });
  }); // Facebook Sign In

  var provider_facebook = new firebase.auth.FacebookAuthProvider();
  $(document).on("click", "#".concat(ns_prefix, "sign_in_with_facebook"), function () {
    auth.signInWithPopup(provider_facebook).then(function (result) {
      return send_token_to_shiny(result.user);
    })["catch"](function (err) {
      console.log(err);
      toastr.error("Sign in Error: ".concat(err.message), null, toast_options);
    });
  }); // Phone Number (SMS) Registration ONLY
  // Turn off phone auth app verification (TESTING)
  // auth.settings.appVerificationDisabledForTesting = true;

  var phone_register_counter = 0;
  $(document).on("click", "#".concat(ns_prefix, "submit_continue_register_phone"), function () {
    var phoneNumber = $("#".concat(ns_prefix, "register_phone"))[0].dataset.full_phone_number; // var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function callback(response) {
        Shiny.setInputValue("".concat(ns_prefix, "render_recaptcha"), phone_register_counter + 1, {
          event: "priority"
        });
      }
    }); // appVerifier.render();
    // $(document).on("click", `#${ns_prefix}submit_phone_code`, () => {
    //   var testVerificationCode = $(`#${ns_prefix}phone_code`).val();

    auth.signInWithPhoneNumber(phoneNumber, appVerifier).then(function (confirmationResult) {
      $(document).on("click", "#".concat(ns_prefix, "submit_phone_code"), function () {
        var testVerificationCode = $("#".concat(ns_prefix, "phone_code")).val(); // confirmationResult can resolve with the fictional testVerificationCode above.

        confirmationResult.confirm(testVerificationCode).then(function (result) {
          Shiny.setInputValue("".concat(ns_prefix, "phone_register_verified"), phone_register_counter + 1, {
            event: "priority"
          });
        });
      });
    })["catch"](function (error) {
      // Error; SMS not sent
      // ...
      // Reset the reCAPTCHA (w/o widget ID stored)
      appVerifier.render().then(function (widgetId) {
        // window.recaptchaVerifier.render().then(function(widgetId) {
        grecaptcha.reset(widgetId);
      });
    }); // })
  });
};