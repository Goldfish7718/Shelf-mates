# **Shelf Mates** (E-Commerce Project built on MERN Stack)🚀

Shelf-mates is an online E-commerce delivery platform I built on top of **MERN** Stack (MongoDB, Express, React, Node.js)

### TL;DR
> Shelf Mates implements an *E-commerce Gorcery Delivery platform* which has customer side as well as admin side features. Customer side has fully enabled CRUD operations for profile, cart, orders, reviews and addresses.
> While the client side has an Admin Dashboard with various Data-visualisations with the help of [recharts](https://recharts.org/en-US/) library. It also provides general statistics and data for each product such as sales, stars and customer feedback.
> On the backend I've used MongoDB and express to make the API. I've also implemented a secure authentication system using JWT and storing them inside cookies.

 # How to run project

> Client
  1. To run this project, first run this command:  
  ```bash
  git clone https://github.com/Goldfish7718/Shelf-mates.git
  ```
  2. Now run `cd client` and create a **.env** file and pass one environment variable: `VITE_API_URL=http://<API_URL>`. **Replace `<API_URL>` with actual API URL**
  3. Now run 2 commands:
  ```bash
  npm install
  npm run dev
  ```

> Server
  1. First *cd* into the *server* folder with the following command: `cd server`
  2. Now create a **.env** file and pass 2 Environment variables in it as follows:<br>
      a. `JWT_SECRET=<ANY_STRING>`. Replace `<ANY_STRING>` with any string you wish.<br>
      b. `STRIPE_API_KEY=<YOUR_STRIPE_API_KEY>`. Replace `<STRIPE_API_KEY>` with your actual Stripe API Key.

      > If you don't have a Stripe API key, head over to [Official Stripe website](https://stripe.com/en-in) then Sign Up/Log in. Now go to developers tab and you should see **two**
      > API keys. A ***Publishable Key*** and a ***Secret key***. Copy the **Secret key** and paste it.
      
  3. Now open `index.ts` in the **server/src** directory and change the mongoose connection string to whatever your connection string is. For eg:- `mongodb://localhost:27017/database-name`.

  ```javascript
  app.listen(3000, () => {
    connectDB('mongodb://localhost:27017/Shelf-mates')
    console.log("Server started on port 3000");    
  })
  ```

  4. Now install dependencies and start the server

  ```bash
  npm install
  npm run dev
  ```
  
  6. You should see the following message in the terminal. (You can change the port number if you want).

  ```bash
  Server started on port 3000
  ```
  **Congratulations!** You've successfully started both the servers

## Contact 🔗

- For any questions, please contact me on my email: [tejasnanoti2@gmail.com](mailto:tejasnanoti2@gmail.com)
- [X/Twitter](https://twitter.com/tejas_jsx)
- [LinkedIn](https://www.linkedin.com/in/tejas-nanoti-23965823b/)

## Licenses 📃

- This project is licensed under the [MIT License](LICENSE).

