const express = require("express");
require('dotenv').config();
const { Sequelize } = require("sequelize");
const fs = require('fs');
const axios = require('axios');
const Redis = require('ioredis');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit')
const config  = require("./config/config")
const passport  = require('./config/passport-config');
const customerRoutes = require("./routes/customerRoute");
const orderRoutes = require("./routes/orderRoute");
const authorRoutes = require("./routes/authorRoutes");
const bookRoutes = require("./routes/bookRoutes");
const AuthorbookRoutes =  require('./routes/AssociationsRoute');
const CachingRoute =  require('./routes/CachingRoute');
const UserRoutes =  require('./routes/UserRoutes');
const RefreshRoute =  require('./routes/RefreshRoute');
const RegisterRoute = require('./routes/RegisterRoute');
const Book  = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user")
const AuthorBooks = require("./models/AuthorBooks");

const app = express();
const sequelize = new Sequelize(config.development);

// Rate limiting
const limiter  = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max:10,
  message:"Too many requests from this IP, please try again after a minute!"
})

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/customers",passport.authenticate('jwt',{session:false}), customerRoutes);
app.use("/orders", orderRoutes);
app.use("/authors", authorRoutes);
app.use("/books",limiter, bookRoutes);
app.use('/authorbook',AuthorbookRoutes);
app.use('/auth',limiter,UserRoutes);
app.use('/',RefreshRoute);
app.use("/",RegisterRoute);
app.use("/caching",CachingRoute);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully!");
    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000 PORT `);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

app.get("/",function(req,res)
{
  res.send("Welcome to the Sequelize + Node Js Application BY Ridham Savaliya!")
})

app.get('/weather', async function (req, res) {
  const city = req.query.city || "Surat";
  const apikey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

  try {
    const response = await axios.get(url);
    const kelvinTemp = response.data.main.temp;
    const tempCelsius = (kelvinTemp - 273.15).toFixed(2);

    res.status(200).json({
      city: response.data.name,
      weather: response.data.weather[0].description,
      temperature: `${tempCelsius} °C`,
      feels_like: `${(response.data.main.feels_like - 273.15).toFixed(2)} °C`,
      temp_min: `${(response.data.main.temp_min - 273.15).toFixed(2)} °C`,
      temp_max: `${(response.data.main.temp_max - 273.15).toFixed(2)} °C`,
      pressure: response.data.main.pressure,
      humidity: response.data.main.humidity,
      visibility: `${response.data.visibility / 1000} km`,
      wind_speed: `${response.data.wind.speed} m/s`,
      country: response.data.sys.country,
      sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
    });

  } catch (error) {
    console.error("Error fetching weather data:", error.message);

    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.get('/setcookie',function(req,res){
  res.cookie('Authtoken','ridham9499.',{
    secure:true,
    sameSite:true,
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000,
  })
  res.send('Cookie has been set!')
})

app.get('/getcookie',function(req,res){
  const cookie =  req.cookies.Authtoken;
  res.send(cookie);
})

module.exports = app;
