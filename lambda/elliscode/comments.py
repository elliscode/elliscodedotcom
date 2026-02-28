from .lambda_logger import log
from .utils import (
    TABLE_NAME,
    python_obj_to_dynamo_obj,
    dynamo,
    parse_body,
    format_response,
    dynamo_obj_to_python_obj,
    create_id,
    authenticate,
    alert_admin,
)
from .input_validation import (
    validate_schema,
    LEAVE_COMMENT_SCHEMA,
    GET_COMMENTS_SCHEMA,
    APPROVE_COMMENT_SCHEMA,
    DELETE_COMMENT_SCHEMA,
)
import time

def leave_comment(event):
    log("Attempting to parse body from event")
    body = parse_body(event.get('body'))
    log("Validating body", body)
    body = validate_schema(body, LEAVE_COMMENT_SCHEMA)
    if not body:
        return format_response(event=event, http_code=403, body="Forbidden")

    log("Searching database for the post name", event)
    response = dynamo.get_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj({"key1": "post", "key2": body['postId'], }),
    )

    if "Item" not in response:
        return format_response(
            event=event,
            http_code=403,
            body="Forbidden",
        )

    log("Writing post to the DB", event)
    password = create_id(64)
    comment_json = {
        "key1": f"unreviewed_comment",
        "key2": f"{int(time.time())}_{password}",
        "text": f"{body['commentText']}",
        "user": f"{body['name']}",
        "password": password,
        "post": f"{body['postId']}",
        "time": f"{int(time.time())}",
        "expiration": int(time.time()) + (30 * 24 * 60 * 60),
    }
    write_response = dynamo.put_item(
        TableName=TABLE_NAME,
        Item=python_obj_to_dynamo_obj(comment_json),
    )
    if (
        "ResponseMetadata" not in write_response
        or "HTTPStatusCode" not in write_response["ResponseMetadata"]
        or write_response["ResponseMetadata"]["HTTPStatusCode"] != 200
    ):
        return format_response(
            event=event,
            http_code=403,
            body="Forbidden",
        )
    response = dynamo.get_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj({"key1": "admin", "key2": "alert", }),
    )
    if "Item" not in response:
        alert_admin(f"Someone left a comment on your blog post {body['postId']}, go to the approval page and review it")
        dynamo.put_item(
            TableName=TABLE_NAME,
            Item=python_obj_to_dynamo_obj({
                "key1": "admin",
                "key2": "alert",
                "expiration": int(time.time()) + (60 * 60),
            }),
        )
    return format_response(
        event=event,
        http_code=200,
        body={
            "commentId": comment_json['key2'],
            "password": password,
            "time": comment_json['time'],
        },
    )

@authenticate
def get_approvable_comments(event, user_data, body):
    log("Getting comments", event)
    response = dynamo.query(
        TableName=TABLE_NAME,
        KeyConditions={
            "key1": {"AttributeValueList": [{"S": f"unreviewed_comment"}], "ComparisonOperator": "EQ"},
        },
        ScanIndexForward=True,
    )
    output = []
    for item in response.get("Items", []):
        python_item = dynamo_obj_to_python_obj(item)
        output.append({
            "commentText": python_item["text"],
            "time": python_item["time"],
            "name": python_item["user"],
            "commentId":  python_item["key2"],
            "postId": python_item["post"],
        })
    return format_response(
        event=event,
        http_code=200,
        body=output,
    )



@authenticate
def approve_comment(event, user_data, body):
    log("Entered approve comment", event)
    body = validate_schema(body, APPROVE_COMMENT_SCHEMA)
    if not body:
        return format_response(event=event, http_code=403, body="Forbidden")
    response = dynamo.get_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj({"key1": "unreviewed_comment", "key2": body['commentId'], }),
    )
    if "Item" not in response:
        return format_response(
            event=event,
            http_code=403,
            body="Forbidden",
        )

    post_json = dynamo_obj_to_python_obj(response["Item"])
    delete_key = {"key1": post_json['key1'], "key2": post_json['key2']}
    post_json['key1'] = f"comment_{post_json['post']}"

    dynamo.delete_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj(delete_key),
    )
    write_response = dynamo.put_item(
        TableName=TABLE_NAME,
        Item=python_obj_to_dynamo_obj(post_json),
    )
    if (
        "ResponseMetadata" not in write_response
        or "HTTPStatusCode" not in write_response["ResponseMetadata"]
        or write_response["ResponseMetadata"]["HTTPStatusCode"] != 200
    ):
        return format_response(
            event=event,
            http_code=403,
            body="Forbidden",
        )
    return format_response(
        event=event,
        http_code=200,
        body="Successfully promoted comment",
    )


def get_comments(event):
    log("Attempting to parse body from event")
    body = parse_body(event.get('body'))
    log("Validating body", body)
    body = validate_schema(body, GET_COMMENTS_SCHEMA)
    if not body:
        return format_response(event=event, http_code=403, body="Forbidden")

    log("Searching database for the post name", event)
    response = dynamo.get_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj({"key1": "post", "key2": body['postId'], }),
    )

    if "Item" not in response:
        return format_response(
            event=event,
            http_code=403,
            body="Forbidden",
        )

    log("Getting comments", event)
    response = dynamo.query(
        TableName=TABLE_NAME,
        KeyConditions={
            "key1": {"AttributeValueList": [{"S": f"comment_{body['postId']}"}], "ComparisonOperator": "EQ"},
        },
        ScanIndexForward=True,
    )
    output = []
    for item in response.get("Items", []):
        python_item = dynamo_obj_to_python_obj(item)
        output.append({
            "commentText": python_item["text"],
            "time": python_item["time"],
            "name": python_item["user"],
        })
    return format_response(
        event=event,
        http_code=200,
        body=output,
    )


def delete_comment(event):
    log("Attempting to parse body from event")
    body = parse_body(event.get('body'))
    log("Validating body", body)
    body = validate_schema(body, DELETE_COMMENT_SCHEMA)
    delete_key = {
        "key1": f"comment_{body['postId']}",
        "key2": body['commentId']
    }
    dynamo.delete_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj(delete_key),
    )
    delete_key = {
        "key1": "unreviewed_comment",
        "key2": body['commentId']
    }
    dynamo.delete_item(
        TableName=TABLE_NAME,
        Key=python_obj_to_dynamo_obj(delete_key),
    )
    return format_response(
        event=event,
        http_code=200,
        body="Successfully deleted comment",
    )
