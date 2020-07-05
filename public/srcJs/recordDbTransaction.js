export function recordTransaction(data, db) {
    //create a new transaction
    const transaction = db.transaction(["pendingTransactions"], "readwrite");
    //open the object store
    const store = transaction.objectStore("pendingTransactions");
    //add the data
    store.add(data);
}