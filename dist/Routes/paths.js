"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const url_1 = __importDefault(require("url"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Schema_1 = __importDefault(require("../Schema"));
const router = express_1.default.Router();
dotenv_1.default.config();
router.get("/", (req, res) => {
    res.send("Hello");
});
// ----------------------ADD TO CART-----------------------
function setCookies(req, res, next) {
    const myurl = url_1.default.parse(req.url, true);
    let items = [];
    // -------------------Convert to jwt--------------------
    const token = jsonwebtoken_1.default.sign({
        itemIndex: Number(myurl.query.index),
        quantity: Number(myurl.query.quantity),
    }, process.env.SECRET_KEY || "");
    // ------------------End----------------------
    items = req.cookies.items ? req.cookies.items : [];
    items.push(token);
    res.clearCookie("items");
    res.cookie("items", items, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    next();
}
router.get("/addToCart", setCookies, (req, res) => {
    var _a;
    const result = ((_a = req.cookies.items) === null || _a === void 0 ? void 0 : _a.map((itemToken) => jsonwebtoken_1.default.verify(itemToken, process.env.SECRET_KEY || ""))) || [];
    res.json(result);
});
// ------------------------------END OF ADD TO CART------------------------
// -------------------------------REMOVE FROM CART-------------------------
function removeItemFromCookie(req, res, next) {
    const myurl = url_1.default.parse(req.url, true);
    let items = [];
    if (req.cookies.items) {
        items = req.cookies.items;
        const idx = items.find((item) => {
            item = jsonwebtoken_1.default.verify(item, process.env.SECRET_KEY || "");
            return (item.itemIndex == Number(myurl.query.index) &&
                item.quantity == Number(myurl.query.quantity));
        });
        items.splice(items.indexOf(idx), 1);
        res.clearCookie("items");
        res.cookie("items", items);
        res.cookie("items", items, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        // -----------------------------Jwt Verification-----------------
        const result = req.cookies.items.map((itemToken) => jsonwebtoken_1.default.verify(itemToken, process.env.SECRET_KEY || ""));
        res.json(result);
    }
    // -------------------------------End----------------------------
    next();
}
router.get("/removeItem", removeItemFromCookie, (req, res) => { });
// ----------------------------------END OF REMOVE CART-----------
// -------------------------No. OF ITEMS IN CART------------------
router.get("/getItems", (req, res) => {
    let items = req.cookies.items || []; // Ensure items is an array
    res.status(200).send({ length: items.length });
});
// -------------------------------END-------------------------------
router.get("/getFoodItems", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const food = yield Schema_1.default.find();
        res.json(food);
    }
    catch (error) {
        console.log(error);
    }
}));
// -------------------------GET COOKIES--------------------
router.get("/getcartItems", (req, res) => {
    const result = req.cookies.items
        ? req.cookies.items.map((itemToken) => jsonwebtoken_1.default.verify(itemToken, process.env.SECRET_KEY || ""))
        : 0;
    res.json(result);
});
exports.default = router;
//# sourceMappingURL=paths.js.map