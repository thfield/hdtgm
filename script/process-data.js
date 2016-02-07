'use strict'
const fs = require('fs');

let episodesfile = 'dataEpisodes.json',
    myapifilmsFile = 'dataMyAPIFilms.json',
    omdbFile = 'dataOMDB.json',
    outputFile = 'episodes-processed.json',
    outputFile2 = 'nameKey.json'

let episodes = JSON.parse(fs.readFileSync(episodesfile, 'utf8')),
    myapifilmsData = JSON.parse(fs.readFileSync(myapifilmsFile, 'utf8')),
    omdbData = JSON.parse(fs.readFileSync(omdbFile, 'utf8'))

let allActors = {},
    repeatActors = {},
    moviesWithRepeatActors = {},
    allActorKey = {},
    actorKey = {},

    allDirectors = {},
    repeatDirectors = {},
    moviesWithRepeatDirectors = {},
    allDirectorKey = {},
    directorKey = {},

    allWriters = {},
    repeatWriters = {},
    moviesWithRepeatWriters = {},
    allWriterKey = {},
    writerKey = {};



function writeToFile(data, filename){
  fs.writeFile(filename, data, function(err) {
    if(err) {
      console.log('error saving document', err)
    } else {
      console.log('The file was saved as ' + filename)
    }
  })
}
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
function unique(array){
  return Array.from(new Set(array));
}

episodes.forEach(function(ep, i) {
  let amov = myapifilmsData.find( movie => movie.title == ep.title ),
      mmov = omdbData.find( movie => movie.Title == ep.title );

  if (amov) {
    ep['allActors'] = amov.actors;
    ep['directors'] = amov.directors;
    ep['writers'] = amov.writers;
    ep['release'] = amov.releaseDate;
    ep['genres'] = amov.genres;
    ep['plot'] = amov.plot;
  };

  if (mmov) {
    ep['imdbID'] = mmov.imdbID;
    ep['rated'] = mmov.rated;
    ep['poster'] = mmov.Poster;
    ep['runtime'] = mmov.runtime;
    ep['imdbRating'] = mmov.imdbRating;
    ep.tomato = {};
    ep.tomato["tomatoMeter"] = mmov.tomatoMeter;
    ep.tomato["tomatoImage"] = mmov.tomatoImage;
    ep.tomato["tomatoRating"] = mmov.tomatoRating;
    ep.tomato["tomatoReviews"] = mmov.tomatoReviews;
    ep.tomato["tomatoFresh"] = mmov.tomatoFresh;
    ep.tomato["tomatoRotten"] = mmov.tomatoRotten;
    ep.tomato["tomatoConsensus"] = mmov.tomatoConsensus;
    ep.tomato["tomatoUserMeter"] = mmov.tomatoUserMeter;
    ep.tomato["tomatoUserRating"] = mmov.tomatoUserRating;
    ep.tomato["tomatoUserReviews"] = mmov.tomatoUserReviews;
  };

  if (!ep.imdbID){
    ep.imdbID = 'ep' + ep.episode;
    // console.log('noid')
  }

  // movieKey[ep.episode] = {'title': ep.title, 'id': ep.imdbID};

  if (ep.allActors) {
    ep.allActors.forEach(function(actor) {
      allActors[actor.actorId] = allActors[actor.actorId] || [];
      allActors[actor.actorId].push(ep.imdbID);
      allActorKey[actor.actorId] = allActorKey[actor.actorId] || actor.actorName;
    });

    ep.directors.forEach(function(director) {
      allDirectors[director.nameId] = allDirectors[director.nameId] || [];
      allDirectors[director.nameId].push(ep.imdbID);
      allDirectorKey[director.nameId] = allDirectorKey[director.nameId] || director.name;
    });

    ep.writers.forEach(function(writer) {
      allWriters[writer.nameId] = allWriters[writer.nameId] || [];
      allWriters[writer.nameId].push(ep.imdbID);
      allWriterKey[writer.nameId] = allWriterKey[writer.nameId] || writer.name;
    });
  };

});

let nameKey = {};
function makeKeys(part, repeatRoles, allRoles, allRolesKey){
    for (let role in allRoles) {
    if (part == 'writer'){
      allRoles[role]=unique(allRoles[role]);
        }
    if (allRoles[role].length > 1) {
      repeatRoles[role] = allRoles[role];
      nameKey[role] = nameKey[role] || {'name':allRolesKey[role]} ;
      nameKey[role]['repeats'] = nameKey[role]['repeats'] || {};
      nameKey[role].repeats[part] = repeatRoles[role];
    };
  };
  // return roleKey;
}

actorKey = makeKeys('actor', repeatActors, allActors, allActorKey);
directorKey = makeKeys('director', repeatDirectors, allDirectors, allDirectorKey);
writerKey = makeKeys('writer', repeatWriters, allWriters, allWriterKey);

function pushMovies(role, repeatRoles, allRoles){
  let returnObj = {};
  for (let role in repeatRoles) {
    allRoles[role].forEach(function(movie) {
      returnObj[movie] = returnObj[movie] || [];
      returnObj[movie].push(role);
    });
  };
  return returnObj;
}

moviesWithRepeatActors = pushMovies('actor', repeatActors, allActors);
moviesWithRepeatDirectors = pushMovies('director', repeatDirectors, allDirectors);
moviesWithRepeatWriters = pushMovies('writer', repeatWriters, allWriters);

episodes.forEach(function(episode){
  let id = episode.imdbID;
  delete episode.allActors;
  episode['repeats'] = {};
  episode.repeats['writer'] = moviesWithRepeatWriters[id];
  episode.repeats['actor'] = moviesWithRepeatActors[id];
  episode.repeats['director'] = moviesWithRepeatDirectors[id];
});

//output the file(s)
writeToFile(JSON.stringify( episodes ), outputFile)
writeToFile(JSON.stringify( nameKey ), outputFile2)
