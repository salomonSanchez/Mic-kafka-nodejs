const express = require('express');
const { Kafka, logLevel } = require('kafkajs')
const app = express();

const port = process.env.PORT || 4000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const apiRoute = require('./routes/routes');
/**
 * Kafka
 */
const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    logLevel: logLevel.WARN,
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
});
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'certificate-group-receiver' })

//hacer disponible producer para todas la rutas
app.use((req, res, next) => {
    req.producer = producer;
    return next();
})

app.use('/api/v1', apiRoute);

async function run() {
    //produccer
    await producer.connect()
        // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'certification-response' });

    await consumer.run({
        eachMessage: async({ topic, partition, message }) => {
            console.log('Respuesta', String(message.value));
        },
    });


    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}/api/v1`)
    })

}

run().catch(console.error)