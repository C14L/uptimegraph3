#!/bin/bash

SCRIPT_DIR=$( cd $(dirname $0) ; pwd -P )
DATA_DIR="$SCRIPT_DIR/data"
DATA_FILE="$DATA_DIR/`date --utc +%Y`-`date --utc +%V`.txt"

echo "`date +%s` `uptime | grep -ohe 'load average[s:][: ].*' | cut -d' ' -f3,4,5 | sed -e 's/, / /g' | sed -e 's/,/./g'`" >> $DATA_FILE

