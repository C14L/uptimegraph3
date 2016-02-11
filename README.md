# uptimegraph3
Simple server monitoring. Collects data from "uptime" and displays it as a graph to quickly see server health.

Usage
-----

Upload to a public directory on your server and setup a cronjob to run `.collect.sh` once per minute. The script collects data from `uptime` calls into files in `data/YYYY-MM.txt` (YYYY == year, MM == month).

Open `index.html` in a browser to see the `load average` values over a month as a graph.

![Screenshot](http://imgur.com/w8yleGu)
