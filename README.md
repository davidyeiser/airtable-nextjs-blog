## NOTE

**This repository and companion tutorial have been retired**. No further updates will be made. See the [note on the tutorial](https://davidyeiser.com/tutorials/how-to-create-blog-airtable-api-next-js) for more information.

## Tutorial

This is the companion repository for the tutorial:

**[How to Create a Blog with the Airtable API & Next.js](https://davidyeiser.com/tutorial/how-to-create-blog-airtable-api-next-js)**.

## Setup

You’ll need an Airtable account with an API key. The sample code is matched to a table structured like so:

![Screenshot of Table in Airtable](https://davidyeiser.com/images/general/tutorial-ex-airtable-blog-setup.png)

## Install

1. Clone this repository and run:

````
npm install
````

2. Then create a `.env` file and add your Airtable API key and Base ID to it like so:

````
AIRTABLE_API_KEY=keyXXXXXX
AIRTABLE_BASE_ID=appXXXXXX
````

## Run

1. First start the Redis server with:

````
redis-server
````

2. Then Start Next with:

````
npm run dev
````

Now go to `http://localhost:3000` and you should see your Airtable data. If you run into trouble, have any questions, etc. feel free to file an issue.
