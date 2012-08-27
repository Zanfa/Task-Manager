#!/bin/bash

ROOTDIR="$( cd "$( dirname "$0")" && pwd )"

java -jar $ROOTDIR/JsTestDriver-1.3.4.b.jar --basePath ./ --config $ROOTDIR/jsTestDriver.conf --server http://localhost:9876 $*
