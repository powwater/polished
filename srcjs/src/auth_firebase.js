const auth = firebase.auth()


const auth_firebase = (ns_prefix) => {

  let cookie_options = {expires: 365} // set cookie to expire in 1 year
  if (location.protocol === 'https:') {
    // add cookie options that browsers are starting to require to allow you to
    // use cookies within iframes.  Only works when app is running on https.
    cookie_options.sameSite = 'none'
    cookie_options.secure = true
  }

  const send_token_to_shiny = (user) => {

    return user.getIdToken(true).then(firebase_token => {

      const polished_cookie = "p" + Math.random()


      Cookies.set(
        'polished',
        polished_cookie,
        cookie_options
      )

      Shiny.setInputValue(`${ns_prefix}check_jwt`, {
        jwt: firebase_token,
        cookie: polished_cookie
      }, {
        event: "priority"
      });
    })
  }


  // Google Sign In
  const provider_google = new firebase.auth.GoogleAuthProvider();

  $(document).on("click", `#${ns_prefix}sign_in_with_google`, () => {
    auth.signInWithPopup(provider_google).then(function(result) {

      return send_token_to_shiny(result.user)
    }).catch(function(err) {

      console.log(err)

      toastr.error(`Sign in Error: ${err.message}`, null, toast_options)
    })
  })

  // Microsoft Sign In
  var provider_microsoft = new firebase.auth.OAuthProvider('microsoft.com');
  $(document).on("click", `#${ns_prefix}sign_in_with_microsoft`, () => {
    auth.signInWithPopup(provider_microsoft).then(function(result) {

      return send_token_to_shiny(result.user)
    }).catch(err => {

      console.log(err)

      toastr.error(`Sign in Error: ${err.message}`, null, toast_options)
    })
  })

  // Facebook Sign In
  var provider_facebook = new firebase.auth.FacebookAuthProvider();
  $(document).on("click", `#${ns_prefix}sign_in_with_facebook`, () => {
    auth.signInWithPopup(provider_facebook).then(function(result) {

      return send_token_to_shiny(result.user)
    }).catch(err => {

      console.log(err)

      toastr.error(`Sign in Error: ${err.message}`, null, toast_options)
    })
  })

  // Phone Number (SMS) Registration ONLY

  // Turn off phone auth app verification (TESTING)
  // auth.settings.appVerificationDisabledForTesting = true;


  var phone_register_counter = 0;

  $(document).on("click", `#${ns_prefix}submit_continue_register_phone`, () => {

    var phoneNumber = $(`#${ns_prefix}register_phone`)[0].dataset.full_phone_number;

    // var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {

        Shiny.setInputValue(`${ns_prefix}render_recaptcha`, phone_register_counter + 1, { event: "priority" });
      },
    });

    // appVerifier.render();

    // $(document).on("click", `#${ns_prefix}submit_phone_code`, () => {

    //   var testVerificationCode = $(`#${ns_prefix}phone_code`).val();

      auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {



          $(document).on("click", `#${ns_prefix}submit_phone_code`, () => {



            var testVerificationCode = $(`#${ns_prefix}phone_code`).val();

            // confirmationResult can resolve with the fictional testVerificationCode above.
            confirmationResult.confirm(testVerificationCode).then((result) => {

              Shiny.setInputValue(`${ns_prefix}phone_register_verified`, phone_register_counter + 1, { event: "priority" })
            })
          })


        }).catch(function (error) {
          // Error; SMS not sent
          // ...




          // Reset the reCAPTCHA (w/o widget ID stored)
          appVerifier.render().then(function(widgetId) {



          // window.recaptchaVerifier.render().then(function(widgetId) {
            grecaptcha.reset(widgetId);
          });
        });
    // })

  })

}

