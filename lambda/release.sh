#!/bin/bash

TIMESTAMP=$(date +%s)
zip -vr ../lambda-release-${TIMESTAMP}.zip . -x "*.DS_Store" -x "*.test.py" -x ".venv/*" -x "pyproject.toml" -x "uv.lock" -x "release.sh"
cd ../
aws lambda update-function-code --function-name=elliscode-backend --zip-file=fileb://lambda-release-${TIMESTAMP}.zip --no-cli-pager
cd lambda