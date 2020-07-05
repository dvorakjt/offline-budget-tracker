# PWA: Offline Budget Tracker
![Screenshot of offline-budget-tracker by dvorakjt]("/public/screenshots/app-in-use.png")  

This repo contains a refactor of an existing full-stack application. It was completed as a homework assignment for the Penn LPS Full-stack web development bootcamp. My task was to transform the application into a progressive web app (PWA) that could function both online and offline. The app is also installable. A link to the deployed version can be found [here.](https://obscure-peak-69005.herokuapp.com/)
## Table of Contents

[Introduction](#introduction)  
[Installation](#installation)  
[The Code](#the-code)
[Usage](#usage)  
[Contributing](#contributing)  
[About the Author](#about-the-author)  

## Introduction

![GitHub language count](https://img.shields.io/github/languages/count/dvorakjt/offline-budget-tracker) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/dvorakjt/offline-budget-tracker) ![GitHub repo size](https://img.shields.io/github/repo-size/dvorakjt/offline-budget-tracker)

All of the front-end and back-end code needed to run the app online was provided by the Penn LPS Bootcamp/Trilogy education service. As such, there were three main tasks I worked on in order to transform the app into a PWA that could run offline and could be installed to a device. These were: 1. Adding a service-worker file to cache requests to the server and their responses, and then respond with cached data when the app is offline. 2. Adding a file to create a database within indexed db, open an objectstore within it, save records to it, and read it when the app is back online. This proved to require more than one file due to my attempts to use webpack (more on that later). 3. Creating a manifest file so that the app is installable. Additionally, I wound up using webpack-pwa-manifest to generate the manifest file, as well as to create a bundle.js file. This required some revision of the indexedDb file. I had to chunk it into several different components so that they could then be imported into the index2.js file, which was then used by webpack to create the bundle.js file.

## Installation
![Installation Image ]("./public/screenshots/standalone-app.png")

To install the app, click the plus sign to the right of the url.

### Dependencies

compression, express, lite-server, mongoose, morgan, webpack, webpack-cli, webpack-pwa-manifest

## The Code  

The files I added included: ./public/service-worker.js, ./public/srcJs/activateDb.js, ./public/srcJs/readDatabase.js, ./public/srcJs/recordDbTransaction.js. I also used webpack/webpack-pwa-manifest to generate bundle.js and manifest.json files, which can be found in the ./public/dist directory (this required the addition of a webpack.config.js file as well). The index.js file needed some slight modifcation, and the index.html needed to be linked to the manifest and the bundle.js, as well as include a script element for activating the service-worker.  

### ./public/srcJs  

The files in the srcJs directory are used by webpack to construct the bundle.js file. Originally, I was using one file to create and modify records within objectStores inside IndexedDb, but this proved problematic to bundle, so I chunked it into smaller pieces, and then imported them into the index2.js file before bundling them.   

#### activateDb.js  

This file exports a function that opens a database called "budgetTracker" within IndexedDb and creates an object store, called "pendingTransactions", within said db. The function returns a promise, and resolves with the db that was created. The file is also dependent upon the readDatabase.js file within the same directory.  

#### readDatabase.js  

This file exports a function that reads all records in the db, and if there is at least one, it makes a post request to the api. Once the post request is successful, all records in the object store are cleared. This file is used both in the activateDb.js when the application is first started, and as part of an event listener in the index2.js file which calls this function anytime the app is brought back online. 

#### recordTransaction.js

This file exports a function that takes two parameters: the data to add to a database, and the db to add it to. In index2.js, immediately after importing these three files, an anonymous, self-invoking async function is called which does three things: 
-calls activateDb to open the Db
-sets the value of db (previously declared as a let) equal to the db that was opened
-adds an eventlistener to the DOM using this value.
The value of db is then used later in the index2.js file to call recordTransaction when a post request to the server is unsuccessful.

#### Modifications to the Index.js file

index2.js imports the 3 above files, and also begins with an anonymous self-invoking async callback function which uses these files to open a connection to indexedDb.

#### service-worker.js

The service-worker.js file is relatively boiler-plate. The only change necessary was to the list of files to be cached.

## Usage
![Usage Image]("./public/screenshots/online-offline.gif")

To use the app, navigate to the deployed application, or your installed application. If you wish to simulate an offline experience, go to the network tab in developer tools and select "offline." You should still be able to submit new budget items, and these will be added to the mongoDB once the app is back online. I did notice that occasionally, the data-cache (while online) sometimes requires an extra refresh or two to be generated.

## Contributing

If you notice an issues with the code, please submit a github issue. 


## About the Author

Joe Dvorak

Github: dvorakjt

Github repository: [github.com/dvorakjt](https://github.com/dvorakjt/)

Portfolio: [dvorakjt.github.io/](https://userName.github.io/)

Email: dvorakjt@gmail.com

README generated by GeneREADME. Original template written with [StackEdit](https://stackedit.io/). Badges provided through shields.io.
