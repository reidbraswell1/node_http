#!/bin/bash
TEST_DIR=$HOME/repos/node_http_test;

if [ -d $TEST_DIR ] 
then
    echo "($TEST_DIR) exists - removing";
    rm -rf $TEST_DIR;
else
    echo "($TEST_DIR) does NOT exit"
    unzip dist/dist.zip -d $TEST_DIR
    echo "Distribution file extracted into directory ($TEST_DIR)"
fi