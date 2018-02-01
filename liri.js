var request = require('request');
// Spotify and twitter keys
var keys = require('./keys.js');

var fs = require('fs');

// user terminal input
var command = process.argv[2];

// Check input against switch statment
switch (command) {
    case "my-tweets":
        myTweets();
        write(command);
        break;
    case "spotify-this-song":
        spotifySong();
        write(command);
        break;
    case "movie-this":
        movieInfo();
        write(command);
        break;
    case "do-what-it-says":
        whatItSays();
        write(command);
        break;
    default:
        console.log('Sorry not a valid command :-(');
};

// This will write the users command to the log.txt file
function write (input) {
    fs.appendFile("log.txt", " "+ input + ",", function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Added To Log!");
        }

    });
}

// Pull tweets from twitter and write to terminal
function myTweets () {

var Twitter = require('twitter');
// twitter keys
var client = new Twitter(keys.twitter);

var params = { screen_name: 'Its_POPart' };
client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
        for(var i=0; i < tweets.length; i++){
            console.log(tweets[i].text);
            console.log(" ");
            console.log('==============================');
        }
    }else { console.log('no tweets');
    }
});
}

// Pull movie info from OMDB
function movieInfo () {
    // movie name input
    var movieName = process.argv.slice(3).join('+');
    // default movie input
    if (movieName == false) {
        movieName = "mr.nobody"
    };

    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            // Print movie info to terminal
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).imdbRating);
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);
        }
    });
}

// Pull music info from spotify
function spotifySong (mySong) {

    var Spotify = require('node-spotify-api');

    var spotify = new Spotify(keys.spotify);
    // song input
    var mySong = process.argv.slice(3).join('+');
    // default song input
    if (mySong == false) {
        mySong = "the Sign"
    }

spotify.search({type: 'track', query: mySong, limit : 5 }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

    var queryResult = data.tracks.items;

    for (var i = 0; i < queryResult.length; i++) {
        console.log(' ');
        console.log("Search result #" + (i + 1));
        console.log('Artist name: ' + queryResult[i].artists[0].name);
        console.log('Track name: ' + queryResult[i].name);
        console.log('Preview: ' + queryResult[i].preview_url);
        console.log('album name: ' + queryResult[i].album.name);
        console.log('=================================');
    }
});

}

// Pull info from random.txt to pull from spotify
function whatItSays () {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        spotifySong(dataArr[1]);
    });
}