from elliscode.lambda_logger import log
from elliscode.utils import (
    path_equals,
    format_response,
    otp_route,
    login_route,
    clear_all_tokens_route,
    logged_in_check_route,
    ios_cookie_refresh_route,
)
from elliscode.comments import (
    leave_comment,
    delete_comment,
    get_comments,
    get_approvable_comments,
    approve_comment,
)

import traceback


def lambda_handler(event, context):
    try:
        log(event, context)
        result = route(event)
        return result
    except Exception:
        traceback.print_exc()
        return format_response(event=event, http_code=500, body="Internal server error")


# Only using POST because I want to prevent CORS preflight checks, and setting a
# custom header counts as "not a simple request" or whatever, so I need to pass
# in the CSRF token (don't want to pass as a query parameter), so that really
# only leaves POST as an option, as GET has its body removed by AWS somehow
#
# see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
def route(event):
    if path_equals(event=event, method="POST", path="/admin/otp"):
        return otp_route(event)
    if path_equals(event=event, method="POST", path="/admin/login"):
        return login_route(event)
    if path_equals(event=event, method="POST", path="/admin/logout-all"):
        return clear_all_tokens_route(event)
    if path_equals(event=event, method="POST", path="/admin/logged-in-check"):
        return logged_in_check_route(event)
    if path_equals(event=event, method="POST", path="/admin/ios-cookie-refresh"):
        return ios_cookie_refresh_route(event)
    if path_equals(event=event, method="POST", path="/admin/get-approvable-comments"):
        return get_approvable_comments(event)
    if path_equals(event=event, method="POST", path="/admin/approve-comment"):
        return approve_comment(event)
    if path_equals(event=event, method="POST", path="/get-comments"):
        return get_comments(event)
    if path_equals(event=event, method="POST", path="/comment"):
        return leave_comment(event)
    if path_equals(event=event, method="GET", path="/ping2"):
        return format_response(event=event, http_code=200, body="pong")

    return format_response(event=event, http_code=403, body="Forbidden")
