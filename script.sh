#!/bin/bash
TEST_DIR=$HOME/repos/node_http_test;
DIST_FILE=dist/dist.zip;

# Shell script to extract distribution file into a directory
# This script will delete the directory if it exists and 
# extract the distribution file to the directory.

function createTestDirectory() {
    unzip $DIST_FILE -d $TEST_DIR
    if [ $? -eq 0 ]
    then 
        echo "Distribution file was succesfully unziped into directory ($TEST_DIR)";
    else
        echo "Distribution file was NOT successfully unzipped into directory ($TEST_DIR)";
    fi
}

if [ -d $TEST_DIR ] 
then
    echo "($TEST_DIR) exists - removing";
    rm -rf $TEST_DIR;
    if [ $? -ne 0 ]
    then 
        echo "rm -rf was unable to remove directory ($TEST_DIR)";
    else
        echo "($TEST_DIR) was successfully removed";
        createTestDirectory
    fi
else
    echo "($TEST_DIR) does NOT exit"
    createTestDirectory
fi