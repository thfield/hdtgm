'use strict'
const fs = require('fs')

let inputFile = 'episodes.json',
    outputFile = "duplicateGuests.json"

let inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8')),
    data = {},
    outputData = []


inputData.map(doSomething, data)
function doSomething(ep){
  ep.guest.map( value => this[value] = this[value] ? this[value] + 1 : 1 )
}



for(let o in data) {
  outputData.push( {value:o, count:data[o]} )
}


outputData.sort(sortHighToLow)
function sortHighToLow(a, b) {
  return b.count - a.count
}


writeToFile(JSON.stringify(outputData), outputFile)
function writeToFile(string, filename){
  fs.writeFile(filename, string, function(err) {
    if(err) {
      console.log('error saving document', err)
    } else {
      console.log('The file was saved as ' + filename)
    }
  })
}