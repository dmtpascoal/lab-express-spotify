require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
//dontenv - permite ter info confidencial, nao sao submetidos no github. só vive no nosso pc. o .gitignore vai ignorar o .env
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,     // vai buscar o ID ao .env file
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
// entry point of our application: //////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.render('index');
});
// route for artist: ////////////////////////////////////////////////////////
app.get('/artist-search', (req, res) => {
  // i want to get here the text i typped on the form of index
  //because its a FORM we do REQ.QUERY
    spotifyApi
  .searchArtists(req.query.artist) // artist é o nome do input field no form
  .then(data => {
      console.log('The received data from the API: ', data.body); //isto ve-se no terminal, SUPER IMPORTANTE
      res.render('artist-search-results', { // para mostrar no frontend, 1o argumento: view name
        //2o argumento é o que queres mostrar 
          artistsList: data.body.artists.items // é artists pq e o que aparece no terminal 
      });
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});
// route for albums: ////////////////////////////////////////////////////////
app.get("/albums/:artistId", (req, res) => {
// use route params when using a link href
  spotifyApi
      .getArtistAlbums(req.params.artistId, { limit: 10 })  //este artistId é o mesmo do app.get:/
      .then((albums) => {
          console.log(albums.body.items) // ITEMS VEM DO TERMINAL E O BODY TAMBEM
          res.render("albums", { albums: albums.body.items })
      });
})
// route for tracks: ////////////////////////////////////////////////////////
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
      .getAlbumTracks(req.params.albumId, { limit: 5 , offset : 1}) // como é link, usa-se de novo o 'params'
      .then((tracks) => {
          console.log(tracks.body.items) // o body, vem do terminal.
          res.render("tracks", { tracks: tracks.body.items })
      });
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));