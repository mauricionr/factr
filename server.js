require('dotenv').config({ silent: true });

const fs = require('fs');
const pages = fs.readdirSync('./app/pages');
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression'); // Provides gzip compression for the HTTP response
const bodyParser = require('body-parser')
const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
    require('marko/browser-refresh').enable();
}

//marko setup
require('app-module-path').addPath(__dirname);
require('marko/express');
require('marko/node-require');
require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())

// Enable gzip compression for all HTTP responses
app.use(compression());

// Allow all of the generated files under "static" to be served up by Express
app.use(require('lasso/middleware').serveStatic());
// Map the "/" route to the home page
app.get(`/`, require(`app/pages/home`));
app.use('/', require('./config/routes/'));
app.use('/service-worker.js', serveStatic(__dirname + '/service-worker.js'));
app.use('/client', serveStatic(__dirname + '/client'));
app.use('/manifest.json', serveStatic(__dirname + '/manifest.json'));
app.use('/offline.html', serveStatic(__dirname + '/offline.html'));
app.use('/integracao', require('./config/integracao'));

app.listen(port, function(err) {
    if (err) {
        throw err;
    }
    console.log('Listening on port %d', port);
    // The browser-refresh module uses this event to know that the
    // process is ready to serve traffic after the restart
    if (process.send) {
        process.send('online');
    }
});