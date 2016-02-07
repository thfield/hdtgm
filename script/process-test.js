'use strict'
const fs = require('fs')

let episodesFile = 'dataEpisodes.json',
    outputFile = "testResults.json"

let episodesData = JSON.parse(fs.readFileSync(episodesFile, 'utf8')),
    outputData = episodesData.map(doSomething)





// do something to each episode
function doSomething(ep){

  let presence = Object.keys(ep.hosts).map(host=> ep.hosts[host])
  if ( presence.some(elem => elem == 'null') ){
      return [ep.episode, ep.title]
  }

}





function writeToFile(string, filename){
  fs.writeFile(filename, string, function(err) {
    if(err) {
      console.log('error saving document', err)
    } else {
      console.log('The file was saved as ' + filename)
    }
  })
}

writeToFile(JSON.stringify(outputData), outputFile)