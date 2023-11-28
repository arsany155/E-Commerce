const mongoose = require("mongoose")

async function connectToDB() {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection Failed to MongoDB", error);
    }
}

module.exports = connectToDB