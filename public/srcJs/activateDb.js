import { readDatabase } from "./readDatabase";

export function activateDb() {
    return new Promise((resolve, reject) => {
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
                readDatabase(indxDb);
                resolve(indxDb);
            }
            else {
                resolve(indxDb);
            }
        }

        //if there is an error, log it
        request.onerror = event => {
            reject(`${event.target.errorCode}`);
        }

    });
}