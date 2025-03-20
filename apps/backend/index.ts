import express from "express"
import { prismaClient } from "db";
import cors from "cors";




const PORT = process.env.PORT || 3010;

const app = express();

app.use(cors())
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "All Good"
    })
})


// Get the details of the problem like boilerplate code and everything
app.get("/v1/getproblem", async (req, res) => {


    const slug = req.query.slug 

    const problemInfo = await prismaClient.problemInfo.findFirst({
        where: {
            slug
        }
    })

    res.status(200).json({
        problemInfo
    });

    return;
})


// // Get Submission Status of an Problem
// app.get("/v1/submissioninfo/:id", async (req, res) => {


// })

// // Get ALL the submission status of the problem
// app.get("/v1/submissioninfobulk/:id", async (req, res) => {

// })



// // Submitting a Problem
// app.post("/v1/submit", async (req, res) => {

// })

app.listen(PORT, () => {
    console.log("Server is running in PORT:3010")
})