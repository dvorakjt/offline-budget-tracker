export function readDatabase(db) {
    //open a new transaction
    const transaction = db.transaction(["pendingTransactions"], "readwrite");
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
                    const transaction = db.transaction(["pendingTransactions"], "readwrite");
                    const store = transaction.objectStore("pendingTransactions");
                    store.clear();
                });
        }
    }
}