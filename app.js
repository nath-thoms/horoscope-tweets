const app = require('express')();
const bodyParser = require('body-parser');
const { getStarSign } = require('./controllers');

app.use(bodyParser.json());
app.get('/:twit_name', getStarSign);


app.use('/*', (req, res, next) => next({ status: 404 }))


app.use((err, req, res, next) => {
    if (err.status === 400) res.status(400).send({ message: 'Bad request' });
    else if (err.status = 404) res.status(404).send({ message: 'Page not found' });
    else res.status(500).send({ message: 'Internal server error' })
});

module.exports = app;