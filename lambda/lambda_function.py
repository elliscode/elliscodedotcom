import boto3
import re
import time
from html import escape

BUCKET_NAME = 'daniel-townsend-ellisrecipes'
PROCESSING_FILE_NAME = '.processing'
s3 = boto3.client('s3')
temp_path = '/tmp/index.html'


def lambda_handler(event, context):
    if does_s3_file_exist(bucket=BUCKET_NAME, key=PROCESSING_FILE_NAME):
        message = 'Looks like we\'re already processing, skipping...'
        print(message)
        return {
            'statusCode': 200,
            'body': message,
        }
    
    write_processing_file(bucket=BUCKET_NAME)
    
    print("Sleeping for 20 seconds to wait for all files to exist")
    time.sleep(20)
    
    print(f'Fetching all files from the {BUCKET_NAME}/blog/ directory...')
    first_time = True
    cont_token = None
    while first_time and not cont_token:
        files = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='blog/', ContinuationToken=cont_token)
        for file in files.get('Contents', []):
            generate_blog_html_from_markdown(file)
        cont_token = files.get('ContinuationToken')
        first_time = False
    print(f'Finished fetching all files from the {BUCKET_NAME}/blog/ directory!')
    
    print(f'Writing file to {temp_path}...')
    with open(temp_path, 'w') as f:
        f.write('''
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ellis Recipes</title>
    <meta name="description" content="Adaptations of recipes found on the internet">
    <meta name="author" content="elliscode.com">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href="img/favicon.png">
    <link rel="stylesheet" href="css/stylesheet.css">
    <link rel="stylesheet" href="css/loader.css">
    <link rel="stylesheet" href="css/responsive.css">
    <noscript>
        <link rel="stylesheet" href="css/noscript.css" />
    </noscript>
    <!-- <script type="text/javascript" src="js/main_RecipeFormattingMain.js"></script> -->
    <!-- <script type="text/javascript" src="js/script.js"></script> -->
    <!-- <script type="text/javascript" src="js/nosleep.js"></script> -->
</head>
<body id="body">
    <div id="wrapper">
        <h1>Ellis Recipes</h1>
        <div id="option-buttons" style="display: block;">
            <img id="set-screen-lock" class="screen-lock-off" src="img/transparent.png" alt="Set screen lock">
        </div>
        <div id="search-group" style="display: block;">
            <input type="text" id="search" placeholder="Search...">
            <button id="search-clear">&times;</button>
        </div>
        <div id="recipes" style="display: block;">
            <!-- recipe divs -->''')
        for category, recipe_list in grouped_text.items():
            f.write(f'<h2>{category}</h2>\n')
            for recipe in recipe_list:
                f.write(recipe)
        f.write('''
            <!-- end recipe divs -->
        </div>
    </div>
    <div id="info">
        <p>text copied</p>
    </div>
    <script src="js/ellisrecipes.js"></script>
</body>
</html>''')
    print(f'Finished writing file to {temp_path}!')
    
    print(f'Copying {temp_path} file to {BUCKET_NAME}/index.html...')
    with open(temp_path, 'r') as f:
        s3.put_object(
            Bucket=BUCKET_NAME, 
            Key='index.html', 
            Body=f.read().encode('utf-8'), 
            # SourceFile='/tmp/index.html',
            ContentType='text/html',
        )
    print(f'Finished copying {temp_path} file to {BUCKET_NAME}/index.html!')

    delete_processing_file(bucket=BUCKET_NAME)

    return {
        'statusCode': 200,
        'body': 'Successfully completed the generation ellisrecipes index file',
    }


def generate_blog_html_from_markdown(s3_file_path):
    pass


def does_s3_file_exist(bucket: str, key: str):
    return 'Contents' in s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PROCESSING_FILE_NAME)


def write_processing_file(bucket: str):
    s3.put_object(
        Bucket=bucket, 
        Key=PROCESSING_FILE_NAME,
        Body='',
    )


def delete_processing_file(bucket: str):
    s3.delete_object(
        Bucket=bucket, 
        Key=PROCESSING_FILE_NAME,
    )
