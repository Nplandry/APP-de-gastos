const form = document.getElementById("Form")
form.addEventListener("submit", ()=> {
    event.preventDefault();
    let TransactionFormData = new FormData(form);
    let FormDataObj = TransformFormDataToObj(TransactionFormData);
    TransactionFormDatainTable(FormDataObj)
    SaveTransactionFormDataInLs(FormDataObj)
    form.reset()
    saveTransactionInBackEnd(FormDataObj)
})

document.addEventListener("DOMContentLoaded", ()=> {
    fetch('http://localhost:3000/transaction').then(promise => promise.json()).then(data => mostrarEnPantallaArrDeLaTransaccion(data))
})

function mostrarEnPantallaArrDeLaTransaccion(element){
    element.forEach(
        (arrElement)=> {
            TransactionFormDatainTable(arrElement)
        }
    )
}

function getTransactionsFromApi(){
    let alltransactions = fetch('http://localhost:3000/transaction')
    return alltransactions
}


function getNewTransactionId(){
    let LasttransactionId = localStorage.getItem("TransactionId") || "0"
    let NewTransactionId = JSON.parse(LasttransactionId) + 1;
    localStorage.setItem("TransactionId", JSON.stringify(NewTransactionId))
    return NewTransactionId;
}

function TransformFormDataToObj(TransactionFormData){
    TypeTransaction = TransactionFormData.get("TypeTransaction")
    TransactionMount = TransactionFormData.get("TransactionMount")
    nameTransaction = TransactionFormData.get("nameTransaction")
    descriptionTransaction = TransactionFormData.get("descriptionTransaction")
    transactionId = getNewTransactionId()
    return{
        "TypeTransaction" : TypeTransaction,
        "TransactionMount" : TransactionMount,
        "nameTransaction" : nameTransaction,
        "descriptionTransaction" : descriptionTransaction,
        "transactionId" : transactionId
    }
}

function deleteTransactionObj(transactionId){
    let transactionObjArr = JSON.parse(localStorage.getItem("Transactions"));
    let transactionIndexinArr = transactionObjArr.findIndex(x => x.transactionId == transactionId)
    transactionObjArr.splice(transactionIndexinArr, 1)
    let transactionArrJson = JSON.stringify(transactionObjArr)
    localStorage.setItem("Transactions", transactionArrJson)
}


function mapola(transactionId){
    let TransactionObjArr = localStorage.getItem("transactions");
    let TransactionIndex = TransactionObjArr.findIndex(x => x.transactionId == transactionId);
    TransactionObjArr.splice(TransactionIndex, 1)
    let TransactionObjArrJson = JSON.stringify(TransactionObjArr)
    localStorage.setItem("transactions", TransactionObjArrJson)
}


function TransactionFormDatainTable(FormDataObj){
    let transactionTableRef = document.getElementById("TableTrasaction")
    let CreateNewRow = transactionTableRef.insertRow(-1);
    CreateNewRow.setAttribute("data-transactionId", FormDataObj["transactionId"]);
    let InsertNewCell = CreateNewRow.insertCell(0)
    InsertNewCell.textContent = FormDataObj["TypeTransaction"];

    if (FormDataObj["TypeTransaction"] == "Ingreso"){
    InsertNewCell = CreateNewRow.insertCell(1)
    InsertNewCell.textContent = FormDataObj["TransactionMount"];
    InsertNewCell.style.color = "green"
    } else {
    InsertNewCell = CreateNewRow.insertCell(1)
    InsertNewCell.textContent = FormDataObj["TransactionMount"];
    InsertNewCell.style.color = "red"
    }
    

    InsertNewCell = CreateNewRow.insertCell(2)
    InsertNewCell.textContent = FormDataObj["nameTransaction"];

    InsertNewCell = CreateNewRow.insertCell(3)
    InsertNewCell.textContent = FormDataObj["descriptionTransaction"];

    let newDeleteCells = CreateNewRow.insertCell(4);
    let NewButton = document.createElement("button");
    NewButton.textContent = "Eliminar"
    newDeleteCells.appendChild(NewButton)
    
    NewButton.addEventListener("click", ()=> {
        let transactionRow = event.target.parentNode.parentNode
        let transactionId = transactionRow.getAttribute("data-transactionId")
        transactionRow.remove()
        deleteTransactionObj(transactionId)
        deleteTransactionFromBackend(transactionId)
    })
}

function deleteTransactionFromBackend(transactionId){
    console.log(fetch(`http://localhost:3000/transaction/${transactionId}`).then(promise => promise.json()).then(data => console.log(data)))
}

function saveTransactionInBackEnd(FormDataObj){
const miArray = FormDataObj;
fetch('http://localhost:3000/transaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ data: miArray })
})
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del servidor:', data);
  })
  .catch(error => {
    console.error('Error al enviar el array al servidor:', error);
  });

}

function SaveTransactionFormDataInLs(FormDataObj){
    let GetOldTransactionsArr = JSON.parse(localStorage.getItem("Transactions")) || []
    GetOldTransactionsArr.push(FormDataObj)
    let FormDataObjJson = JSON.stringify(GetOldTransactionsArr)
    localStorage.setItem("Transactions", FormDataObjJson)

}

