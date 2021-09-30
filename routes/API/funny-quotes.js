const express = require('express');

const { quotes } = require('../../funny-quote-data');
const { getRandomElement } = require('../../utils');
const { getQuoteById } = require('../../utils');
const { getIndexById } = require('../../utils');
const { idFree } = require('../../utils');

const funnyQuotesRouter = express.Router();

funnyQuotesRouter.use('/:id', (req, res, next) => {
    let quoteObj = getQuoteById(req.params.id, quotes);
    req.quoteObj = quoteObj;
    next();
})

funnyQuotesRouter.get('/random', (req, res, next) => {
    let randomQuote = getRandomElement(quotes);
    res.status(200).send({ quote: randomQuote });
});

funnyQuotesRouter.get('/', (req, res, next) => {
    if (req.query.person) {
        let quotesByPerson = quotes.filter(quote => quote.person === req.query.person);
        res.status(200).send({ quotes: quotesByPerson});
    } else {
        res.status(200).send({ quotes: quotes});
    }
});

funnyQuotesRouter.post('/', (req, res, next) => {

    if (req.query.person && req.query.quote) {
        let quoteObj = {
            id: idFree(quotes),
            person: req.query.person,
            quote: req.query.quote
        };
        quotes.splice(quoteObj.id-1, 0, quoteObj)
        res.status(201).send({ quote: quoteObj })
    } else {
        res.status(400).send();
    }
});

funnyQuotesRouter.put('/:id', (req, res, next) => {
   
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
});

funnyQuotesRouter.delete('/:id', (req, res, next) => {
    let ind = getIndexById(req.params.id, quotes);
    if (ind !== -1) {
        quotes.splice(ind, 1);
        // the below is meant to be 204 but does not let you send data.
        res.status(200).send({quote: req.quoteObj});
    } else {
        res.status(404).send()
    }
})

module.exports = funnyQuotesRouter;