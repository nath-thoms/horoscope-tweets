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
// app.use('/*', (req, res, next) => next({ status: 404 }))


// app.use((err, req, res, next) => {
//     if (err.status === 400) res.status(400).send({ message: 'Bad request' });
//     else if (err.status = 404) res.status(404).send({ message: err });
//     else res.status(500).send({ message: 'Internal server error' })
// });

module.exports = app;