#' Load dependencies for intl-tel-input for \code{phone_input}
#'
#' intlTelInputDependencies()
#'
#' @importFrom htmltools htmlDependency
#'
#' @export
#'

intlTelInputDependencies <- function(pkgVersion = "17.0.12") {

  htmltools::htmlDependency(
    name = "intl-tel-input",
    version = pkgVersion,
    src = c(
      href = paste0("https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/", pkgVersion)
    ),
    script = list(
      list(
        src = "js/intlTelInput.js",
        integrity = "sha512-lib7WdJvAnfLLBi5AHdN+wUkcWwpu1fmYzyEHQijZq7WedcwBiwdVNbcML2rAtKvwtOIU7thMGB+O9Kpb9g2Cw==",
        crossorigin = "anonymous"
      ),
      list(
        src = "js/utils.js",
        integrity = "sha512-bUcJxlqkiGA3cmoYPuZaLRsyc5ChG9APG4ajom2AXKSlBtOmx4kLV3c8uv/6uSz43FMjI4Q2QI21+D223rT76w==",
        crossorigin = "anonymous"
      )
    ),
    stylesheet = c("css/intlTelInput.css", "img/flags.png")
  )
}

