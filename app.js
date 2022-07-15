const express = require('express');
const app = express();
const port = process.env.PORT || 3050;

require('dotenv').config();
const { API_KEY } = process.env;

const axios = require('axios');

const getMovieColorData = async ( page ) => {
    const colours = [ 'red', 'green', 'blue', 'yellow' ];
    //make request for each keywords
    let response = await Promise.all(colours.map( color => {
        return axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${color}&page=${page}`);
    } ))

    //store all the results into a single array
    let data = [];
    response.map( movieResult => {
        data = [...movieResult.data['Search'], ...data]
    } )

    return data;
}

const getData = async (query) => {
    let response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=1`);
    //returns an array of movies
    return response.data['Search'];
}

const getDatabyId = async (query) => {
    let response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${query}&plot=full`);
    //returns an array of movies
    
    return response.data;
}

app.use(express.json());
app.use( (req, res, next) => {
    res.set('Content-Type', 'application/json'); 
    next();
})

app.get('/', async (req, res) => {
    let page = req.query.page || 1;
    let data = await getMovieColorData(page);
    res.send( JSON.stringify( { 'results': data } ) ).status(200);
})
app.get('/search/:query', async (req, res) => {
    let query = req.params.query;
    let data = await getData(query);
    res.send( JSON.stringify({'results': data })).status(200);
})
app.get('/id/:id', async (req, res) => {
    let id = req.params.id;
    let data = await getDatabyId(id);
    res.send( JSON.stringify({'results': data })).status(200);
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, access-control-allow-origin');
    res.header("X-Requested-With", "XMLHttpRequest");
    if ( req.method === "OPTIONS" ){
        res.header('Access-Control-Allow-Methods', 'GET');
    }
    next();
})

app.listen( port, () => {
    console.log(`listening on port ${port}`);
} )