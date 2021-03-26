#' A Shiny phone \code{input}
#'
#' This is a replica of \code{shiny::textInput()} with the HTML input \code{type}
#' attribute set to \code{"phone"} rather than \code{"text"}.
#'
#' @param inputId The \code{input} slot that will be used to access the value.
#' @param label Display label for the control, or \code{NULL} for no label.
#' @param value Initial value.
#' @param width The width of the input, e.g. \code{'400px'}.
#' @param placeholder A character string giving the user a hint as to what can be entered
#' into the control. Internet Explorer 8 and 9 do not support this option.
#'
#' @export
#'
#' @importFrom htmltools htmlDependency tags tagList
#' @importFrom shiny restoreInput icon
#'
phone_input <- function(
  inputId,
  label = tagList(icon("phone"), "Phone"),
  value = "",
  width = NULL,
  placeholder = NULL
)
{
  value <- restoreInput(id = inputId, default = value)

  tags$div(
    intlTelInputDependencies(),
    tags$style(
      ".iti {
           width: 100%;
         }"
    ),
    class = "form-group shiny-input-container",
    style = if (!is.null(width)) paste0("width: ", width, ";"),
    # style = htmltools::css(width = validateCssUnit(width)),
    # shiny:::shinyInputLabel(inputId, label),
    tags$label(
      label,
      class = "control-label",
      class = if (is.null(label)) "shiny-label-null",
      `for` = inputId
    ),
    tags$input(
      id = inputId,
      type = "tel",
      class = "form-control",
      # class = "form-control custom-phone-input",
      value = value,
      placeholder = placeholder,
      autocomplete = "tel-national"
    ),
    tags$script(paste0(
      '
      function phone_input() {
        // var telInput = document.querySelector(".custom-phone-input");
        // var telInput = document.querySelector("#', inputId, '");
        let telInput = document.querySelector("#', inputId, '");

        var iti = window.intlTelInput(telInput, {
          // any initialisation options go here

          utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js",

          // allowDropdown: false,

          // autoPlaceholder: "aggressive",

          nationalMode: false,

          formatOnDisplay: true,

          // initialCountry: "auto",

          preferredCountries: ["ke", "us"],

          separateDialCode: true
        });

        telInput.addEventListener("keyup", formatIntlTelInput);
        telInput.addEventListener("change", setInputValue);
        telInput.addEventListener("change", formatIntlTelInput);

        function formatIntlTelInput() {
            if (typeof intlTelInputUtils !== "undefined") { // utils are lazy loaded, so must check
                var currentText = iti.getNumber(intlTelInputUtils.numberFormat.E164);
                if (typeof currentText === "string") { // sometimes the currentText is an object :)
                    iti.setNumber(currentText); // will autoformat because of formatOnDisplay=true
                }
            }
        }

        function setInputValue() {
          // Set the Shiny input value
          Shiny.setInputValue("', inputId, '", iti.getNumber(), { priority: "event" });
          // Add the full Phone # to the Javascript object
          telInput.dataset.full_phone_number = iti.getNumber();
        }

      }

      phone_input()
      '
    ))
  )

}

