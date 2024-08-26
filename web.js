const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const prom = require('prom-client');
const packageInfo = require('./package.json');
const {Counter, Gauge} = require("prom-client");
const fs = require('fs');

const firstNames = fs.readFileSync('/first-names.txt', 'utf8').split("\n");

var item = firstNames[Math.floor(Math.random()*firstNames.length)];
function registerRegistry(registryName) {
    const registry = new prom.Registry()
    registry.setDefaultLabels({'registry_name': registryName})

    const exampleCounter = new Counter({
        name: 'example_counter',
        help: 'Just an example Counter',
        labelNames: ["application"],
        registers: [registry]
    })
    exampleCounter.labels(packageInfo["name"]).inc(Math.random() * (20))

    const exampleGauge = new Gauge({
        name: 'example_gauge',
        help: 'Just an example Gauge',
        labelNames: ["application"],
        registers: [registry]
    })
    exampleGauge.labels(packageInfo["name"]).set(Math.random() * (540))

    return registry
}

PORT = process.env.PORT || 8080

const registry = registerRegistry(item.trim())

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/metrics/', async (req, res) => {
    res.setHeader('Content-Type', registry.contentType);
    res.status(200).send(registry.metrics());
});

app.listen(PORT, () => {
    console.log("Testing app listening on port " + PORT)
    console.log("Please see http://localhost:" + PORT)
})

