import os
import boto3
from mimetypes import guess_type

# ----------- Configuration -------------
BUCKET_NAME = 'certificationexams.guru'
NO_CACHE_EXTENSIONS = ('.html', '.js')

# ----------- S3 Client -----------------
s3_client = boto3.client('s3')

# ----------- Upload Logic --------------
def upload_file(file_path, s3_key):
    content_type, _ = guess_type(file_path)
    extra_args = {}

    if content_type:
        extra_args['ContentType'] = content_type

    if file_path.lower().endswith(NO_CACHE_EXTENSIONS):
        extra_args['CacheControl'] = 'no-cache, no-store, must-revalidate'

    s3_client.upload_file(file_path, BUCKET_NAME, s3_key, ExtraArgs=extra_args)
    print(f'Uploaded: {file_path} --> s3://{BUCKET_NAME}/{s3_key}')
    if extra_args:
        print(f'  Headers: {extra_args}')

def upload_script_directory():
    # Get the actual directory where this script resides
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Uploading .html and .js files from: {script_dir}")

    for file in os.listdir(script_dir):
        full_path = os.path.join(script_dir, file)
        if os.path.isfile(full_path) and file.lower().endswith(NO_CACHE_EXTENSIONS):
            upload_file(full_path, file)

# ---------- Run Upload -----------------
if __name__ == '__main__':
    upload_script_directory()
    print("✅ Upload complete.")
