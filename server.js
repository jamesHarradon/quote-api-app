const express = require('express');
const cors = require('cors');
const StormDB = require('stormdb');
const morgan = require('morgan');
const app = express();
const funnyQuotesRouter = require('./routes/API/funny-quotes');
const computerQuotesRouter = require('./routes/API/computer-quotes');

const engine = new StormDB.localFileEngine('./db.json');
const db = new StormDB(engine);

db.default({quotes: []}).save();

// note : this app uses two routers, funnyQuotesRouter and computerQuotesRouter. These each contain the same code but use different data arrays. They could easily be refactored to use only one file, in server.js however it is a good example of separating routes into modules.

const PORT = process.env.PORT || 3000;

// this code allows expres to serve all files in the public directory
// this is what displays the website
app.use(express.static('public'));

app.db = db;

app.use('/api/funny-quotes', funnyQuotesRouter);
app.use('/api/computer-quotes', computerQuotesRouter);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

