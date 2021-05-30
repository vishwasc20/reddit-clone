# Running the app locally

## Run reddit-client

Go to reddit-client folder and execute `npm run dev`

## Run reddit-server

Go to reddit-server folder and execute `npm run watch` for typescript compile and `npm run dev` for node server

## Note

You need to have postgres database & redis installed locally with postgres database name matching the one in `reddit-server/.env` file ex: `reddittypeorm`

# Running the app using docker compose ( dev mode )

This is pretty simple compared to running locally. Just execute `docker compose up --build` in root level OR `reddit-clone` folder.

## Note

- You need to have docker installed locally to run the above command
- reddit-client is run on port 8080
- reddit-server is run on port 4000
