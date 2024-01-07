const form = document.getElementById("Form")
form.addEventListener("submit", ()=> {
    event.preventDefault();
    let transactionFromData = new FormData(form)
    let transactionFromDataObj = transformtransactionFromDataToObj(transactionFromData)
    addTransactionToTable(transactionFromDataObj)
    sendTransactionToBackend(transactionFromDataObj)
    form.reset()
})

document.addEventListener('DOMContentLoaded', ()=> {
    fetch('http://localhost:3000/transactions').then(x => x.json()).then(data => recorrerElementos(data))
})
function recorrerElementos(element){
    element.forEach((arrElement)=> {
        addTransactionToTable(arrElement)
    })
}
function sendTransactionToBackend(transactionFromDataObj){
    fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers:
        {'Content-Type': 'application/json'},
        body: JSON.stringify(transactionFromDataObj)
    })
}


function createTransactionId(){
    let oldTransactionId = localStorage.getItem("transactionId") || "0"
    let newTransactionId = (JSON.parse(oldTransactionId) + 1)
    localStorage.setItem("transactionId", JSON.stringify(newTransactionId))
    return newTransactionId 
}



function transformtransactionFromDataToObj(transactionFromData){
    TypeTransaction = transactionFromData.get("TypeTransaction");
    TransactionMount = transactionFromData.get("TransactionMount");
    nameTransaction = transactionFromData.get("nameTransaction");
    descriptionTransaction = transactionFromData.get("descriptionTransaction");
    transactionId =  createTransactionId()
    return {
        "TypeTransaction" : TypeTransaction,
        "TransactionMount" : TransactionMount,
        "nameTransaction" : nameTransaction,
        "descriptionTransaction" : descriptionTransaction,
        "transactionId": transactionId

    }
}


function addTransactionToTable(transactionFromDataObj){
    const tableRef = document.getElementById("TableTrasaction")
    let insertNewRow = tableRef.insertRow(-1)
    insertNewRow.setAttribute("data-transaction-Id", transactionFromDataObj["transactionId"]);
    let insertNewCell = insertNewRow.insertCell(0)
    insertNewCell.textContent = transactionFromDataObj["TypeTransaction"]
    if(transactionFromDataObj["TypeTransaction"] == "Ingreso"){
        insertNewCell = insertNewRow.insertCell(1)
        insertNewCell.textContent = transactionFromDataObj["TransactionMount"] 
        insertNewCell.style.color = "green"
    } else {
        insertNewCell = insertNewRow.insertCell(1)
        insertNewCell.textContent = "-" + transactionFromDataObj["TransactionMount"]
        insertNewCell.style.color = "red"
    }
    

    insertNewCell = insertNewRow.insertCell(2)
    insertNewCell.textContent = transactionFromDataObj["nameTransaction"]

    insertNewCell = insertNewRow.insertCell(3)
    insertNewCell.textContent = transactionFromDataObj["descriptionTransaction"]

    let NewDeleteCell = insertNewRow.insertCell(4)
    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Eliminar"
    NewDeleteCell.appendChild(deleteButton)
    deleteButton.addEventListener("click", ()=> {
        let transactionRow = event.target.parentNode.parentNode
        transactionRow.remove()
        //REVISAR
        let transactionId = transactionRow.getAttribute("data-transaction-Id")
        console.log(transactionId)
        //Obtenemos id de transaccion de columna a borrar
        deleteTransactionFromBackend(transactionId);
    })
    function deleteTransactionFromBackend(transactionId) {
        fetch(`http://localhost:3000/transactions/${transactionId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log(`Transacción con ID ${transactionId} eliminada del backend.`);
            } else {
                console.error(`Error al eliminar la transacción con ID ${transactionId} del backend.`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}






