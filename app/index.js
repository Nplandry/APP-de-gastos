const express = require('express');
const cors = require('cors')

const app = express()
const port = 3000;

app.use(express.urlencoded({
    extended: true
}))

let transactionArr = [];
/*{
    TransactionMount : "1",
    TypeTransaction : "Ingreso",
    descriptionTransaction : "1",
    nameTransaction : "1"
    }*/

app.use(express.json({
    type: "*/*"
}))

app.use(cors())

app.get('/transactions', (req, res)=> {
    res.send(transactionArr)
})

app.post('/transactions', (req, res)=> {
    let frontArr = req.body
    transactionArr.push(frontArr)
    res.send('Guardado bb')
})

app.get('/transactions/:id', (req, res)=> {
    const transactionId = req.params.id;/*Obtiene el id del directorio*/
    const selectedTransaction = transactionArr.filter(transactionArr => transactionArr.transactionId == transactionId)
    res.send(selectedTransaction)
    //transactionArr.splice(selectedTransaction, 1)
    console.log(transactionArr)
 })
 app.delete('/transactions/:Id', (req, res) => {
    const transactionId = req.params;
    let transactionIdRef = parseInt(transactionId.Id, 10)
    console.log(transactionIdRef) /* ESTA BIEN*/
    
    // Encontrar la transacción por su ID en el almacén (o en tu base de datos)
    const index = transactionArr.findIndex(transactionArr => transactionArr.transactionId == transactionIdRef);

    if (index !== -1) {
    transactionArr.splice(index, 1); // Eliminar la transacción del almacén
      res.status(200).json({ message: `Transacción con ID ${transactionId} eliminada` });
    } else {
      res.status(404).json({ error: `Transacción con ID ${transactionId} no encontrada` });
    } 
  });

app.listen(port, ()=> {
    console.log(`Pagina inicializada en http://localhost:${port}`)
})