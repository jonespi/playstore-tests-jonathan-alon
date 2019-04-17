const express = require('express');
const morgan = require('morgan');
const playStore = require('./playstore');
const app = express();
app.use(morgan('common'));

app.get('/app', (req, res) => {
  const { sort = '', genres = ''} = req.query
  let response = [...playStore];

  if (sort) {
    if (sort.toLowerCase() === 'rating') {
      console.log('sort is', sort)
      // sort by rating code
      response = response.sort((a, b) => {
        return b['Rating'] - a['Rating'];
      })
    }  
    
    if (sort.toLowerCase() === 'app') {
      // sort by app title
      // response = response.sort((a, b) => {
      //   return a['App'[0]] - b['App'[0]];
      // })
      response = response.sort((a,b) => {
        return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0;
      })
    }

    if (sort.toLowerCase() !== 'app' && sort.toLowerCase() !== 'rating') {
      res.status(400).send('Error: sort is not valid')
    }
  }

  const availableGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  
  if (genres) {
    const matchGenres = availableGenres.filter(term => term.toLowerCase().includes(genres.toLowerCase()));

    if (matchGenres.length === 0) {
      res.status(400).send('Error: genre is not valid')
    }

    response = response.filter(app => {
      const genreArr = app.Genres.split(';');
      let multipleGenres;

      if (genreArr.length > 1) {
         multipleGenres = genreArr[1].toLowerCase().split(' ');
      }
      
      if (multipleGenres) {
        return (multipleGenres.find(word => word.toLowerCase() === matchGenres[0].toLowerCase()) === matchGenres[0].toLowerCase() ) 
      }

      return (genreArr[0].toLowerCase() === matchGenres[0].toLowerCase())
    })
  }
  
  res.status(200).send(response);
})

module.exports = app