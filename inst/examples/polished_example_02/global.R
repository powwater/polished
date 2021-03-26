library(shiny)
# library(powpolished)
devtools::load_all('../../../../powpolished')
library(config)

app_config <- config::get()

global_sessions_config(
  api_url = "http://localhost:8080",
  app_name = "vendors_dashboard", # app_config$app_name,
  api_key = app_config$powpolished$api_key,
  firebase_config = app_config$firebase,
  # admin_mode = T,
  sign_in_providers = c(
    'email',
    'phone'
  )
)
