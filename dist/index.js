"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const paths_1 = __importDefault(require("./Routes/paths"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
(0, db_1.default)();
// ------------Middlewares----------------------------
// ----------Cors Control-----------------
app.use((0, cors_1.default)({
    credentials: true,
    origin: true,
}));
// -----------End of Cors Control----------
app.use((0, cookie_parser_1.default)());
// ------------End of Middleware----------------------------
// --------------Requests--------------------------------
app.use("/", paths_1.default);
// -----------------End------------------------------------
app.listen(8080, () => {
    console.log("Running in port " + 8080);
});
//# sourceMappingURL=index.js.map