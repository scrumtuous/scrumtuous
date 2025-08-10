import os
import boto3
from mimetypes import guess_type

# ----------- Configuration -------------
BUCKET_NAME = 'certificationexams.guru'
LOCAL_DIRECTORY = r'F:\_repos\scrumtuous\scrumtuous\_site'
S3_PREFIX = ''  # Set to a subfolder path if you want, e.g., 'dev-site/'
NO_CACHE_EXTENSIONS = ('.html', '.js', '.css')

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

def upload_directory(local_dir, s3_prefix=''):
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, local_dir)
            s3_key = os.path.join(s3_prefix, relative_path).replace('\\', '/')
            upload_file(full_path, s3_key)

# ---------- Run Upload -----------------
if __name__ == '__main__':
    print(f"Uploading files from {LOCAL_DIRECTORY} to s3://{BUCKET_NAME}/")
    upload_directory(LOCAL_DIRECTORY, S3_PREFIX)
    print("✅ Upload complete.")