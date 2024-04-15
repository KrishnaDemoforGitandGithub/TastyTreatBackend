import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  nutrients: [Number],
  price: Number,
  sort: String,
  category: String,
  img: String,
});

const userModal = mongoose.model("FoodDatas", userSchema);
export default userModal;
