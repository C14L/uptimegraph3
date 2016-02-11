# uptimegraph3
Simple server monitoring. Collects data from "uptime" and displays it as a graph to quickly see server health.

Usage
-----

Upload to a public directory on your server and setup a cronjob to run `.collect.sh` once per minute. The script collects data from `uptime` calls into files

- `data/YYYY-WW.txt` uptime 1, 5, 15 min load.
- `data/mailq-YYYY-WW.txt`  open items in mailq.
- `data/mailsent-YYYY-WW.txt`  email sent over the past minute (no graph yet).

(YYYY == year, WW == week number)

Open `index.html` in a browser to see the `load average` values over a month as a graph.

![Screenshot](https://github.com/C14L/uptimegraph3/blob/master/screenshot.jpg)

