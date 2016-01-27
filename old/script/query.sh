#!/bin/bash
token='token-goes-here'
cat get.txt | while read line; do
    title=$(sed -e 's, ,+,g' <<< "$line")
    # curl -s "http://www.omdbapi.com/?t=$title&y=&plot=short&r=json&tomatoes=true" >> temp_result.txt #search by title
    curl -s "http://www.omdbapi.com/?i=$title&y=&plot=short&r=json&tomatoes=true" >> temp_movies.txt #search by imdbID
    curl -s "http://api.myapifilms.com/imdb/idIMDB?idIMDB=$title&token=$token&format=json&language=en-us&actors=2" >> temp_actors.txt

done
