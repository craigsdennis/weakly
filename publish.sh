rm index.zip
cd lambda
zip -X -r ../index.zip *
cd ..
aws lambda update-function-code --function-name Weakly --zip-file fileb://index.zip