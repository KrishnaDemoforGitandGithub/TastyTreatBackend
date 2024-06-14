import express, { Request, Response } from "express";
import url from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModal from "../Schema";
const router = express.Router();
dotenv.config();

router.get("/", (req, res) => {
  res.send("Hello");
});
// ----------------------ADD TO CART-----------------------
function setCookies(req: Request, res: Response, next: any) {
  const myurl = url.parse(req.url, true);

  // -------------------Convert to jwt--------------------
  const token = jwt.sign(
    {
      itemIndex: Number(myurl.query.index),
      quantity: Number(myurl.query.quantity),
    },
    process.env.SECRET_KEY || ""
  );
  // ------------------End----------------------
  res.send(token);
  next();
}

router.get("/addToCart", setCookies, (req: Request, res: Response) => {});
// ------------------------------END OF ADD TO CART------------------------

// -------------------------------REMOVE FROM CART-------------------------

function removeItemFromCookie(req: Request, res: Response, next: any) {
  const myurl = url.parse(req.url, true);
  let storedItems: any = myurl.query.jwtitems;
  if (storedItems && storedItems !== "null") {
    let tempitems = storedItems.split(",");

    const idx = tempitems.find((item: any) => {
      item = jwt.verify(item, process.env.SECRET_KEY || "");
      return item.iat == Number(myurl.query.iat);
    });

    tempitems.splice(tempitems.indexOf(idx), 1);
    if (tempitems.length == 0) res.send(null);
    else res.send(tempitems.join(","));
  }

  // -------------------------------End----------------------------
  next();
}

router.get(
  "/removeItem",
  removeItemFromCookie,
  (req: Request, res: Response) => {}
);

// ----------------------------------END OF REMOVE CART-----------
// -------------------------No. OF ITEMS IN CART------------------
router.get("/getItems", (req: Request, res: Response) => {
  let items = req.cookies.items || []; // Ensure items is an array
  res.status(200).send({ length: items.length });
});
// -------------------------------END-------------------------------
router.get("/getFoodItems", async (req: Request, res: Response) => {
  try {
    const food = await userModal.find();
    res.json(food);
  } catch (error) {
    console.log(error);
  }
});

// -------------------------GET COOKIES--------------------
router.get("/getcartItems", (req: Request, res: Response) => {
  const myurl = url.parse(req.url, true);
  let storedItems: any = myurl.query.jwtitems;

  if (storedItems && storedItems !== "null") {
    let tempitems = storedItems.split(",");
    const items: any[] = [];
    tempitems.forEach((token: string) => {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "");
      items.push(decoded);
    });

    res.json(items);
  } else {
    res.send(null);
  }
});

export default router;
