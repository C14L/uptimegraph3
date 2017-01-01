#!/bin/bash

SCRIPT_DIR=$( cd $(dirname $0) ; pwd -P )
DATA_DIR="$SCRIPT_DIR/data"

DATA_FILE="$DATA_DIR/`date --utc +%G`-`date --utc +%V`.txt"
MPSTAT_ALL_FILE="$DATA_DIR/mpstat-all-`date --utc +%G`-`date --utc +%V`.txt"
MPSTAT_P0_FILE="$DATA_DIR/mpstat-p0-`date --utc +%G`-`date --utc +%V`.txt"
MPSTAT_P1_FILE="$DATA_DIR/mpstat-p1-`date --utc +%G`-`date --utc +%V`.txt"
MAILQ_FILE="$DATA_DIR/mailq-`date --utc +%G`-`date --utc +%V`.txt"
SENT_FILE="$DATA_DIR/mailsent-`date --utc +%G`-`date --utc +%V`.txt"
RECV_FILE="$DATA_DIR/mailrecv-`date --utc +%G`-`date --utc +%V`.txt"
MEM_FILE="$DATA_DIR/mem-`date --utc +%G`-`date --utc +%V`.txt"

###
# Collect "uptime" stats: 1m 5m 15m avrg load.
###
echo "`date +%s` `uptime | grep -ohe 'load average[s:][: ].*' | cut -d' ' -f3,4,5 | sed -e 's/, / /g' | sed -e 's/,/./g'`" >> $DATA_FILE

###
# Collect "mpstat" stats: 
###
echo "`date +%s` `mpstat 1 1 | tail -n1 | cut -c17-`" >> $MPSTAT_ALL_FILE
echo "`date +%s` `mpstat -P 0 1 1 | tail -n1 | cut -c17-`" >> $MPSTAT_P0_FILE
echo "`date +%s` `mpstat -P 1 1 1 | tail -n1 | cut -c17-`" >> $MPSTAT_P1_FILE

###
# Collect "mailq" stats: Number of items in the mailq.
###
echo "`date +%s` `mailq | grep -P '^[0-9A-F]{10}\s{2,}' | wc -l`" >> $MAILQ_FILE

###
# Collect number of emails sent during the past minute.
###
MON=$(date +%b)
DAY=$(date +%e)
HOU=$(date +%H)
MIN=$(($(date +%M | sed 's/^0//')-1))
if [ $MIN == '-1' ]; then HOU=$(($HOU-1)); MIN='59'; fi
if [ $HOU == '-1' ]; then DAY=$(($DAY-1)); HOU='23'; fi
#
# This leaves a gap for the last minute of every month. That's okay.
#
echo "`date +%s` `cat /var/log/mail.log | grep -P "$MON\s+$DAY\s+$HOU:$MIN:" | grep 'status=sent' | wc -l`" >> $SENT_FILE

###
# Collect number of emails received in INBOX files during the past minute.
###
MON=$(date +%b)
DAY=$(date +%e)
HOU=$(date +%H)
MIN=$(($(date +%M | sed 's/^0//')-1))
if [ $MIN == '-1' ]; then HOU=$(($HOU-1)); MIN='59'; fi
if [ $HOU == '-1' ]; then DAY=$(($DAY-1)); HOU='23'; fi
#
# This leaves a gap for the last minute of every month. That's okay.
#
echo "`date +%s` `cat /var/log/dovecot.log | grep -P "$MON\s+$DAY\s+$HOU:$MIN:" | grep ': saved mail to INBOX' | wc -l`" >> $RECV_FILE

###
# Collect memory stats "total used free" in MiB
###
echo "`date +%s` `free -m | grep Mem | awk '{print $2,$3,$4}'`" >> $MEM_FILE
