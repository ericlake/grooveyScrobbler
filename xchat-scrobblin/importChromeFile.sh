#!/bin/bash
# TODO: make this much nicer and have it find the file then start looping or something
currFile='003/t/00/00000000'

echo "hit ctr-c to escape"
while true
do
cat ~/Library/Application\ Support/Google/Chrome/Default/File\ System/$currFile > ../data/scrobblin.json
sleep 15
done;
