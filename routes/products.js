const { AuthMiddleware } = require("../middleware/auth");
const { UserMiddleware } = require("../middleware/user");
const { Product } = require("../models/Product");

const router = require("express").Router();

router.get("/", async (req, res) => {
    const products = await Product.find().lean();
    res.render('index', {
        title: "Boom shop | Sammi",
        token: req.cookies.token ? true : false,
        products: products.reverse(),
        userId: req.userId ? req.userId.toString() : null
    })
})
router.get("/products", async (req, res) => {
    const user = req.userId ? req.userId.toString() : null;
    const MyProducts = await Product.find({ user: user }).lean().populate('user')
    res.render('products', {
        title: "Products",
        isProduct: true,
        myproducts: MyProducts.reverse()
    })
})
router.get("/add", AuthMiddleware, (req, res) => {
    res.render('add', {
        title: "Add products",
        isAdd: true,
        addProductError: req.flash("addProductError")

    })
})
router.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate("user").lean();
    res.render("product", {
        product: product
    })
})
router.get("/edit-product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate("user").lean();

    res.render("edit-product", {
        product: product,
        editProductError: req.flash("editProductError")
    })
})
router.post("/add-products", UserMiddleware, async (req, res) => {
    const { title, description, image, price } = req.body;
    if (!title || !description || !image || !price) {
        req.flash("addProductError", "All fields is required");
        res.redirect("/add");
        return
    }
    const product = await Product.create({ ...req.body, user: req.userId });
    res.redirect("/");
})
router.post("/edit-product/:id", async (req, res) => {
    const { title, description, image, price } = req.body;
    const id = req.params.id;
    if (!title || !description || !image || !price) {
        req.flash("editProductError", "All fields is required");
        res.redirect(`/edit-product/${id}`);
        return
    }
    const newProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
    res.redirect("/products")
});
router.post("/delete-product/:id", async (req, res) => {
    const id = req.params.id;

    await Product.findByIdAndDelete(id);

    res.redirect("/")
})

module.exports = router