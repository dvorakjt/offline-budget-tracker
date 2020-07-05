//create a variable to represent indexed db
let indxDb;

//open the database
const request = indexedDB.open("budgetTracker", 1);

// when the application is first opened or the version changes, create the object store
request.onupgradeneeded = event => {
    const indxDb = event.target.result;
    indxDb.createObjectStore("pendingTransactions", { autoIncrement: true });
}

//when the db is successfully opened, check if online, and if so, read from db
request.onsuccess = event => {
    indxDb = event.target.result;
    if (navigator.onLine) {
        readDatabase();
    }
}

//if there is an error, log it
request.onerror = event => {
    console.log(`Error: ${event.target.errorCode}`);
}

//this function saves data in the indxDB
const recordTransaction = data => {
    //create a new transaction
    const transaction = indxDb.transaction(["pendingTransactions"], "readwrite");
    //open the object store
    const store = transaction.objectStore("pendingTransactions");
    //add the data
    store.add(data);
}

//this function reads from the database
const readDatabase = () => {
    //open a new transaction
    const transaction = indxDb.transaction(["pendingTransactions"], "readwrite");
    const store = transaction.objectStore("pendingTransactions");
    const allRecords = store.getAll();

    allRecords.onsuccess = () => {
        //if there is at least one record in the db, make a post request to the api to update it
        if (allRecords.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(allRecords.result),
                headers: {
                    accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(() => {
                    //now clear all items from the pendingTransactions list after they have been added to the mongoDB
                    const transaction = indxDb.transaction(["pendingTransactions"], "readwrite");
                    const store = transaction.objectStore("pendingTransactions");
                    store.clear();
                });
        }
    }
}

//when the app is reconnected to the network, read from the db
window.addEventListener("online", readDatabase);