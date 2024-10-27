const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const cors = require('cors');
dotEnv.config({ path: "./config.env" });
const { connectToDatabase } = require('./config/db');

connectToDatabase()

const PORT = process.env.PORT || 9000

app.use(express.json());
app.use(cors());

const studentRoutes = require('./routes/student')
const subjectRoutes = require('./routes/subjectMarks')
const resultRoutes = require('./routes/result')
const authRoutes = require('./routes/auth')

// app.use('/', authRoutes)
app.use('/student', studentRoutes)
app.use('/subject', subjectRoutes)
app.use('/result', resultRoutes)
// app.use()

app.listen(PORT, () => {
    console.log(`Connect to localhost at ${PORT}`)
})