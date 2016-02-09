#!/bin/bash

SCRIPT_DIR=$( cd $(dirname $0) ; pwd -P )
DATA_DIR="$SCRIPT_DIR/data"
DATA_FILE="$DATA_DIR/`date --utc +%Y`-`date --utc +%V`.txt"
MAILQ_FILE="$DATA_DIR/mailq-`date --utc +%Y`-`date --utc +%V`.txt"

# Collect "uptime" stats: 1m 5m 15m avrg load.
#
echo "`date +%s` `uptime | grep -ohe 'load average[s:][: ].*' | cut -d' ' -f3,4,5 | sed -e 's/, / /g' | sed -e 's/,/./g'`" >> $DATA_FILE

# Collect "mailq" stats: Number of items in the mailq.
#
echo "`date +%s` `mailq | grep -P '^[0-9A-F]{10}\s{2,}' | wc -l`" >> $MAILQ_FILE


