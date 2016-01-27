'use strict'
const fs = require('fs');
const http = require('http');
const url = require('url');

let tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'))

let getlist = fs.readFileSync('get.txt', 'utf8').split('\n'),
    myapifilmsFile = 'dataMyAPIFilms.json',
    omdbFile = 'dataOMDB.json',
    myapifilmsFileTest = 'dataMyAPIFilmsTest.json',
    omdbFileTest = 'dataOMDBTest.json'

let myapifilmsData = JSON.parse(fs.readFileSync(myapifilmsFile, 'utf8')),
    omdbData = JSON.parse(fs.readFileSync(omdbFile, 'utf8'))

function writeToFile(string, filename){
  fs.writeFile(filename, string, function(err) {
    if(err) {
      console.log('error saving document', err)
    } else {
      console.log('The file was saved as ' + filename)
    }
  })
}

function omdbapiOptions(title){
  let options = {
    protocol: 'http',
    host:'www.omdbapi.com',
    query:{
      i: title,
      plot: 'short',
      r: 'json',
      tomatoes: 'true'
    }
  }
  return options
}

function myapifilmsOptions(title){
  let options = {
    protocol: 'http',
    host:'api.myapifilms.com',
    pathname: 'imdb/idIMDB',
    query: {
      idIMDB: title,
      token: tokens.myapifilms,
      format: 'json',
      language: 'en-us',
      actors: 2
    }
  }
  return options
}

function fetchOMDB(title) {
  let path = url.format(omdbapiOptions(title))
  return apiQuery(path)
}

function fetchMyAPI(title) {
  let path = url.format(myapifilmsOptions(title))
  return apiQuery(path)
}

function apiQuery(path) {
  return new Promise((resolve, reject) => {
    http.request(path, function(response) {
      let str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function(){
        resolve(str)
      });
    }).end();
  });
}


let omdbPromises = getlist.map(fetchOMDB);
Promise.all(omdbPromises)
  .then(function(results) {
     results.forEach(function(item) {
       omdbData.push(JSON.parse(item))
     });
    writeToFile(JSON.stringify(omdbData), omdbFileTest)
  })
  .catch(function(err) {
    // Will catch failure of first failed promise
    console.log("Failed:", err);
  });

let myapifilmsPromises = getlist.map(fetchMyAPI);
Promise.all(myapifilmsPromises)
  .then(function(results) {
    results.forEach(function(item) {
       myapifilmsData.push(JSON.parse(item).data.movies[0])
    });
    writeToFile(JSON.stringify(myapifilmsData), myapifilmsFileTest)
  })
  .catch(function(err) {
    // Will catch failure of first failed promise
    console.log("Failed:", err);
  });