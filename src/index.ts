import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/paths";
import connectDB from "./db";

const app = express();

connectDB();
// ------------Middlewares----------------------------

// ----------Cors Control-----------------
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
// -----------End of Cors Control----------

app.use(cookieParser());

// ------------End of Middleware----------------------------

// --------------Requests--------------------------------
app.use("/", router);
// -----------------End------------------------------------

app.listen(8080, () => {
  console.log("Running in port " + 8080);
});
