This is the companion repository to the tutorial [How to Create a Blog with the Airtable API & Next.js](https://davidyeiser.com/tutorial/how-to-create-blog-airtable-api-next-js)

## Setup

You’ll need an Airtable account with an API key. The sample code is matched to a table structured like so:

![Screenshot of Table in Airtable](https://davidyeiser.com/static/images/tutorial-ex-airtable-blog-setup.png)

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

3. Start Next with:

````
npm run dev
````

Now go to `http://localhost:3000` and you should see your Airtable data. If you run into trouble, or have any questions, please feel free to file an issue.
