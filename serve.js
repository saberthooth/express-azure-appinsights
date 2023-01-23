const dotenv = require('dotenv');
const appInsights = require('applicationinsights');
const express = require('express');
const got = require('got');

dotenv.config();
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).start();
const appInsightsClient = appInsights.defaultClient;

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/', async (req, res, next) => {
    if (Math.random() > 0.5) {
        try {
            const { data } = await got.post('http://example.com/notfound').text();
            console.log(data);
        } catch (e) {
            next(e);
            return;
        }
    } else {
        appInsightsClient.trackTrace({
            message: `ok ${Date.now()}`,
        });
        appInsightsClient.flush();
        res.json({
            status: `ok ${Date.now()}`,
            date: new Date().toISOString(),
        });
    }
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    appInsightsClient.trackException({ exception: err });
    appInsightsClient.flush();
    res.status(500).json({
        message: err.message,
        stack: err.stack,
        response: err.response != undefined ? {
            statusCode: err.response.statusCode,
            body: err.response.body,
        } : undefined,
    });
});

const server = app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
});
