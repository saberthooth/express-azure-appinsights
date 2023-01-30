const dotenv = require('dotenv');
const appInsights = require('applicationinsights');
const express = require('express');

dotenv.config();
appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING).start();
const appInsightsClient = appInsights.defaultClient;

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    appInsightsClient.trackTrace({
        message: `ok ${Date.now()}`,
    });
    res.json({
        status: `ok ${Date.now()}`,
        date: new Date().toISOString(),
    });
});

const server = app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
});
