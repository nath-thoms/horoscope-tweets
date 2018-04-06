const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const { getStarSign } = require('./controllers');

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.render('pages/home')
})

app.get('/profile', getStarSign);


app.use(bodyParser.json());

app.use('/*', (req, res, next) => {
    res.render('pages/error')
    next({ status: 404 })
})
app.use((err, req, res, next) => {
    if (err.status === 404) res.render('pages/error')
    // res.status(404).send({ message: `Page not found : err` })
    else next(err)
})
app.use((err, req, res, next) => {
    // console.log(err)
    res.render('pages/error')
    // res.status(500).send({ message: 'Internal server error', err })
})

module.exports = app;