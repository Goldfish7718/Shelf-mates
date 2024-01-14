# **Shelf Mates** (E-Commerce Project built on MERN Stack)🚀

Shelf-mates is an online E-commerce delivery platform I built on top of **MERN** Stack (MongoDB, Express, React, Node.js)

### TL;DR
> Shelf Mates implements an *E-commerce Gorcery Delivery platform* which has customer side as well as admin side features. Customer side has fully enabled CRUD operations for profile, cart, orders, reviews and addresses.
> While the client side has an Admin Dashboard with various Data-visualisations with the help of [recharts](https://recharts.org/en-US/) library. It also provides general statistics and data for each product such as sales, stars and customer feedback.
> On the backend I've used MongoDB and express to make the API. I've also implemented a secure authentication system using JWT and storing them inside cookies.

 # How to run project

> Client
  1. To run this project, first run this command:  `git clone https://github.com/Goldfish7718/Shelf-mates.git`
  2. Now run `cd client` and create a **.env** file and pass one environment variable: `VITE_API_URL=http://<API_URL>`. **Replace `<API_UR>` with actual API URL**
  3. After cloning this project, open terminal inside the root directory and then run 2 commands:  a. `npm install` b. `npm run dev`

> Server
  1. First cd into the *server* folder with the following command: `cd server`
  2. Now create a **.env** file and pass 2 Environment variables in it as follows:
      a. `JWT_SECRET=<ANY_STRING>`. Replace `<ANY_STRING>` with any string you wish.
      b. `STRIPE_API_KEY=<YOUR_STRIPE_API_KEY>`. Replace `<STRIPE_API_KEY>` with your actual Stripe API Key

      > If you don't have a Stripe API key, head over to [Official Stripe website](https://stripe.com/en-in) then Sign Up/Log in. Now go to developers tab and you should see **two**
      > API keys. A ***Publishable Key*** and a ***Secret key***. Copy the **Secret key** and paste it.
      
  3. Now run `npm install` and wait for the dependencies to install.
  4. Now open `indes.ts` in the server directory and change the mongoose connection string to whatever your connection string is. For eg:- `http://mongodb:27017/database-name`.
  5. Now run `npm run dev` to start the server.
  6. You should see the message `Server started on port 3000`. (You can change the port number if you want).

## And that's it! That's how you run this project! 
