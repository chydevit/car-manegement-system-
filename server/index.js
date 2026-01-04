const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const favoriteRoutes = require("./routes/favorites");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/ping", (req, res) => res.json({ status: "alive", users: require("./models/user").listUsers().length }));

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
