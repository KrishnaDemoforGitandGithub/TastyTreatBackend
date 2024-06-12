"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    nutrients: [Number],
    price: Number,
    sort: String,
    category: String,
    img: String,
});
const userModal = mongoose_1.default.model("FoodDatas", userSchema);
exports.default = userModal;
//# sourceMappingURL=Schema.js.map