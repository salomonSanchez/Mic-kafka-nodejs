var express = require('express');
var app = express();

const port = process.env.PORT || 4000;

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({ kafkaHost: 'kafka1:19091' }),
    producer = new Producer(client);

producer.on('ready', function() {
    console.log('Producer is ready');
});

producer.on('error', function(err) {
    console.log('Producer is in error state :');
    console.log('------------------------------------------------------------------------------------');
    console.log("cliente: ", client, "producer: ", producer)
    console.log(err);
})
app.post('/sendMsg', async function(req, res) {
    //var sentMessage = JSON.stringify(req.body.message);
    const message = {
        user: { id: 1, name: 'Diego Fernandes' },
        course: 'Kafka com Node.js',
        grade: 10,
    };
    payloads = [{
        topic: "issue-certificate",
        messages: JSON.stringify(message),
        partition: 0
    }];
    producer.send(payloads, function(error, result) {
        if (error) {
            console.error('Sending payload failed:', error);
            res.status(500).json(error);
        } else {
            console.log('Sending payload result:', result);
            res.status(202).json(result);
        }
    });

})

app.get('/', function(req, res) {
    res.json({ greeting: 'Kafka Producer' })
});

app.get('/saludar', function(req, res) {
    res.json({ greeting: 'Kafka Producer hello' })
});

app.listen(port, () => {
    console.log(`Api listening at http://localhost:${port}/`)
})