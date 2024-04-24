import express, { Request, Response } from "express";
import url from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModal from "../Schema";
const router = express.Router();
dotenv.config();
// ----------------------ADD TO CART-----------------------
function setCookies(req: Request, res: Response, next: any) {
  const myurl = url.parse(req.url, true);

  let items: any[] = [];
  // -------------------Convert to jwt--------------------
  const token = jwt.sign(
    {
      itemIndex: Number(myurl.query.index),
      quantity: Number(myurl.query.quantity),
    },
    process.env.SECRET_KEY || ""
  );
  // ------------------End----------------------
  items = req.cookies.items ? req.cookies.items : [];

  items.push(token);

  res.clearCookie("items");

  res.cookie("items", items, { httpOnly: true });

  next();
}

router.get("/addToCart", setCookies, (req: Request, res: Response) => {
  const result =
    req.cookies.items?.map((itemToken: any) =>
      jwt.verify(itemToken, process.env.SECRET_KEY || "")
    ) || [];
  res.json(result);
});
// ------------------------------END OF ADD TO CART------------------------

// -------------------------------REMOVE FROM CART-------------------------

function removeItemFromCookie(req: Request, res: Response, next: any) {
  const myurl = url.parse(req.url, true);
  let items = [];
  items = req.cookies.items;

  const idx = items.find((item: any) => {
    item = jwt.verify(item, process.env.SECRET_KEY || "");
    return (
      item.itemIndex == Number(myurl.query.index) &&
      item.quantity == Number(myurl.query.quantity)
    );
  });

  items.splice(items.indexOf(idx), 1);

  res.clearCookie("items");

  res.cookie("items", items);
  res.cookie("items", items, { httpOnly: true });
  // -----------------------------Jwt Verification-----------------
  const result = req.cookies.items.map((itemToken: any) =>
    jwt.verify(itemToken, process.env.SECRET_KEY || "")
  );
  res.json(result);
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
  const result = req.cookies.items
    ? req.cookies.items.map((itemToken: any) =>
        jwt.verify(itemToken, process.env.SECRET_KEY || "")
      )
    : 0;
  res.json(result);
});
export default router;
