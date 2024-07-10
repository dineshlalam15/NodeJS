import express from 'express';
(async () => {
    const dotenv = await import('dotenv');
    dotenv.config();
})();

const app = express();
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
