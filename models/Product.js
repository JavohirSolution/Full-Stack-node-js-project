const { Schema, model } = require("mongoose")
const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user" },
}, {
    timestamps: true
})

const Product = model("product", ProductSchema);
module.exports.Product = Product;