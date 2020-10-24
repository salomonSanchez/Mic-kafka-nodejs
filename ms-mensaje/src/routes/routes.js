const express = require('express');
const { CompressionTypes } = require('kafkajs')
const router = express.Router();

router.get('/', (req, res) => {
    res.send('welcome:  visit /consultar/cursos ')
})

/**
 * const express = require('express')
const serverApp = express()
serverApp.get('/book/:bookId', (req, res) => {
    producer.send(JSON.stringify({
        action: 'get',
        message: req.params.bookId
    }))
    consumer.on('message', (data) => {
        res.status(200).send(JSON.parse(data))
    })
})
 */

router.post('/consultar', async(req, res) => {

    const message = {
        user: { id: 1, name: 'Diego Fernandes' },
        course: 'Kafka com Node.js',
        grade: 10,
    };

    await req.producer.send({
        topic: 'issue-certificate',
        compression: CompressionTypes.GZIP,
        messages: [
            { value: JSON.stringify(message) },
        ],
    })
    console.log('Sending payload result:', message);
    res.json(message);
});

module.exports = router;