## To run this app the first time there is script to tun to add some categories and create admin account please run: `npm run init`

## the script to run backend is `npm run dev` (I know that it is in package.json but to make things easier)

app should have these in .env:

    PORT=8080
    MONGO_URI=mongodb://localhost:27017/bookstore
    JWT_SECRET= 123@123
    JWT_COOKIE_EXPIRES_IN=30
    server=http://localhost:8080
    FRONT_END_SERVER=http://localhost:3000
    STRIPE_SECRET_KEY=sk_test_51QMZGuKowEM3jA9t0MJYpGY4EwunD2JAQlp2ok1I16fHeVzszN8nChKEpIv9Kd4XQHgGhLp2eizEXRZQju5CncYp00E5AFTTK9

##### NOTE I know that the stripe secret key is "SECRET" but i made this dummy account anyway and put it's key so that the app doesnt crash in start up so if you want to test you can use your own stripe account

---

## for front end:

## the script to run frontend is `npm start`

app should have these in .env:

    REACT_APP_API_URL=http://localhost:8080/api/v1
    REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51QMZGuKowEM3jA9tTH04PRGw8tE7skiE5rr5igw7M5iJpYm1b8Vs0gO5KpLxhLE5rjTyASJeTp5ajfSxNfskMxNc00gp1gRJPy


##### this is public key anyway :)
