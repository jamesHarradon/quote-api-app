
const express = require('express');
const morgan = require('morgan');

//const { req.quotes } = require('../../computer-quote-data');
const { getRandomElement } = require('../../utils');
const { getQuoteById } = require('../../utils');
const { getIndexById } = require('../../utils');
const { idFree } = require('../../utils');


const computerQuotesRouter = express.Router();

computerQuotesRouter.all('*', (req, res, next) => {
    const quotes = req.app.db.get("quotes");
    req.quotes = quotes;
    next();
})

// this code runs before each /:id path regardless of method, therefore any repeating code in this path can be put in this middleware.
// variables can be saved as properties to the req object and named as anything you like.
// ensure next() is called as this executes the next middleware.
computerQuotesRouter.use('/:id', (req, res, next) => {
    let quoteObj = getQuoteById(req.params.id, req.quotes);
    req.quoteObj = quoteObj;
    next();
});

// the morgan package logs to the console request/response data, the argument denotes the data format. 
// 'tiny' logs method, url, status, response content length, response time.
// using it here mean it will be called with every request
computerQuotesRouter.use(morgan('tiny'));

computerQuotesRouter.get('/random', (req, res, next) => {
    let randomQuote = getRandomElement(req.quotes);
    res.status(200).send({ quote: randomQuote });
});

computerQuotesRouter.get('/', (req, res, next) => {
    
    if (req.query.person) {
        let quotesByPerson = req.quotes.filter(quote => quote.person === req.query.person);
        res.status(200).send({ quotes: quotesByPerson});
    } else {
        res.status(200).send({ quotes: req.quotes});
    }
});

computerQuotesRouter.post('/', (req, res, next) => {

    if (req.query.person && req.query.quote) {
        let quoteObj = {
            id: idFree(req.quotes),
            person: req.query.person,
            quote: req.query.quote
        };
        req.quotes.splice(quoteObj.id-1, 0, quoteObj)
        res.status(201).send({ quote: quoteObj })
    } else {
        res.status(400).send();
    }
});

// here is an example of writing a named middleware function
const editorCheck = (req, res, next) => {
    if (req.quoteObj) {
        if (req.query.person && !req.query.quote) {
            req.quoteObj.person = req.query.person;
        } else if (req.query.quote && !req.query.person) {
            req.quoteObj.quote = req.query.quote;
        } else if (req.query.quote && req.query.person) {
            req.quoteObj.person = req.query.person;
            req.quoteObj.quote = req.query.quote;
        }
        res.status(200).send({quote: req.quoteObj})
    } else {
        res.status(400).send();
    }
}

// the above middleware is then used here
// you can use any amount of middleware functions, separated by a comma.
computerQuotesRouter.put('/:id', editorCheck);

computerQuotesRouter.delete('/:id', (req, res, next) => {
    let ind = getIndexById(req.params.id, req.quotes);
    if (ind !== -1) {
        req.quotes.splice(ind, 1);
        // the below is meant to be 204 but does not let you send data.
        res.status(200).send({quote: req.quoteObj});
    } else {
        res.status(404).send()
    }
})

module.exports = computerQuotesRouter;