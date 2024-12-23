#!/bin/bash

FORMAT=${1:-"json2"}
TYPE=${2:-"json"}
FILE_NAME=${2:-"report"}
SHOULD_GEN_HTML=${3:-true}
FILES=$(git ls-files '*.py')

if [ "$TYPE" = "text" ]; then
    TYPE="txt"
fi


echo "Running pylint..."
mkdir -p ./tmp/reports
pylint --load-plugins=pylint-json2html --output-format=$FORMAT $FILES > ./tmp/reports/$FILE_NAME.$TYPE

if [ $? -eq 0 ]; then
    echo "Pylint passed"
    cat $FILE_NAME.json
    if $SHOULD_GEN_HTML && [ "$TYPE" = "json" ]; then
        echo "Making html linting report"
        pylint-json2html -f jsonextended -o $FILE_NAME.html ./tmp/reports/$FILE_NAME.json
        if [ $? -eq 0 ]; then
            echo "Html report generated"
        else
            echo "Html report generation failed"
            exit 1
        fi
    fi
else
    echo "Pylint failed"
    exit 1
fi