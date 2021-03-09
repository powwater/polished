library(shiny)
library(powpolished)
library(config)

app_config <- config::get()

# configure polished
# global_sessions_config(
#   app_name = "polished_example_02",
#   api_key = app_config$api_key,
#   firebase_config = app_config$firebase,
#   is_invite_required = FALSE,
#   sign_in_providers = c("google"),
# )

# global_sessions_config(
#   app_name = "polished_example_01",
#   # PROD
#   api_key = "ajL19CnXIZEtXgTX253fE75lvfiQchyqhm"
#   # DEV
#   # api_key = "Oq7XUIXCGHhfPloJaKhfRrBZOObitdVTqy",  # app_config$api_key,
#   # api_url = "api-dev.polished.tech"  # app_config$api_url
# )


powpolished::global_sessions_config(
  api_url = "http://localhost:8080",
  app_name = "powwater_adminportal", # app_config$app_name,
  # api_key = app_config$api_key,
  api_key = "xtZ6HrhdP1OTql4bsp8KdUS6IuiDqsxKAd",
  is_invite_required = F,
  # admin_mode = T,
  sign_in_providers = 'email'
)
