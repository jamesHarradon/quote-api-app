const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const Low = require('lowdb');
const app = express();
const funnyQuotesRouter = require('./routes/API/funny-quotes');
const computerQuotesRouter = require('./routes/API/computer-quotes');

const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = Low(adapter);


db.defaults({quotes: []}).write();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Quotes API',
            version: '1.0.0',
            description: 'A simple Express Quotes API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
    },
    apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

// note : this app uses two routers, funnyQuotesRouter and computerQuotesRouter. These each contain the same code but use different data arrays. They could easily be refactored to use only one file, in server.js however it is a good example of separating routes into modules.

const PORT = process.env.PORT || 3000;

// this code allows expres to serve all files in the public directory
// this is what displays the website
app.use(express.static('public'));



app.use('/api/funny-quotes', funnyQuotesRouter);
app.use('/api/computer-quotes', computerQuotesRouter);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

