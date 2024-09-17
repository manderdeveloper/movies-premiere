import { config } from 'dotenv';
import * as express from "express";
import { handler as lambdaHandler } from './index';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.all('*', async (req, res) => {
    config()
    const lambdaEvent = {
        body: JSON.stringify(req.body),
        headers: req.headers,
        httpMethod: req.method,
        isBase64Encoded: false,
        path: req.path,
        queryStringParameters: req.query,
    };

    try {
        const result = await lambdaHandler(lambdaEvent, {}, () => {});
        res.status(200).send(result);
    } catch (error) {
        console.error('Error ejecutando la función Lambda:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
