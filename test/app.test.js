const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const playStore = require('../playstore');

describe('Get /app', () => {
  it('if no queries included, should return all apps', () => {
      const apps = [...playStore];
      return request(app)
        .get('/app')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(apps)
        })
  })

  it('if sort option is not rating or app, return an error', () => {
    return request(app)
    .get('/app')
    .query({sort: 'nothing'})
    .expect(400, 'Error: sort is not valid')
  })

  it('if sort is set as app, should order alphabetically', () => {
    return request(app)
      .get('/app')
      .query({sort: 'app'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App < res.body[i + 1].App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  })

  it('if sort is set as rating, should order numerically', () => {
    return request(app)
      .get('/app')
      .query({sort: 'rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  })

  it('should throw an error if genre is not available', () => {
    return request(app)
    .get('/app')
    .query({genres: 'nothing'})
    .expect(400, 'Error: genre is not valid')
  })

  it('if genre is selected, response should only have that genre', () => {
    return request(app)
      .get('/app')
      .query({genres: 'Arcade'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        const query = 'Arcade';
        const response = res.body;
        let sorted = null;
        response.forEach(app => {
          if (app.Genres.includes(query)) {
            sorted = true;
          } else {
            sorted = false;
          }
          expect(sorted).to.be.true;
        })
      });
  })
})