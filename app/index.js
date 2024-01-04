const express = require('express');
const cors = require('cors')
//Same Origins Polce SOP
const app = express();
const port = 3000;

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json({
    type: "*/*"
}))


app.use(cors())

let transactionArr = 
[
    
  ]


app.get('/', (req, res)=> {
    res.send('Ingresaron al localhost')
})

app.get('/transaction', (req, res)=> {
    res.send(transactionArr)
})

app.get('/transaction/:id', (req, res)=> {
    const transactionId = req.params.id;
    const selectedTransaction = transactionArr.filter(transactionArr => transactionArr.transactionId *= transactionId)
    res.send(selectedTransaction)
    transactionArr.splice(selectedTransaction, 1)
    console.log(transactionArr)
})

app.post('/transaction', (req, res)=> {
    const transaction = req.body.data
    transactionArr.push(transaction)
    res.send('Todo OK')
})

app.listen(port, ()=> {
    console.log(`App funcionando en https://localhost:${port}`)
})

