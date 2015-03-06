#!/bin/bash
cat get.txt | while read line; do 
    title=$(sed -e 's, ,+,g' <<< "$line")
    #curl -s "http://www.omdbapi.com/?t=$title&y=&plot=short&r=json&tomatoes=true" >> temp_result.txt
    curl -s "http://www.omdbapi.com/?i=$title&y=&plot=short&r=json&tomatoes=true" >> temp_result.txt
    curl -s "http://www.myapifilms.com/imdb?idIMDB=$title&actors=S" >> temp_actors.txt

done