const Product = require("../models/prodModel");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.createProduct = async (req, res, next) => {
  try {
    // Convert the file buffer to a base64 string
    const productImageBase64 = req.file.buffer.toString('base64');

    const newProduct = {
      category: req.body.categoryId,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      productImage: productImageBase64, // Store the base64 string in the database
      quantity: req.body.quantity,
    };

    const product = await Product.create(newProduct);
    return res.status(200).send({ message: "Product created successfully!", product });
  } catch (error) {
    if (error.code === 11000) return res.status(200).send({ message: "Product already exists" });
    return res.status(400).send({ message: "Unable to create product", error });
  }
};

exports.updateProduct = async (req, res, next) => {
  const filter = { _id: req.body.id };
  const update = {
    // your update logic
  };
  await Product.findByIdAndUpdate(filter, update);
}

exports.getProducts = (req, res, next) => {
  const pageNo = parseInt(req.query.pageNo);
  const size = 3;

  if (pageNo <= 0) {
    return res.status(200).send({ error: true, message: "Invalid page number" });
  }

  const query = {
    // skip: size * (pageNo - 1),
    // limit: size,
  };

  Product.find({}, {}, query)
    .select("-_id -__v -updatedAt")
    .populate("category", "-_id name")
    .exec((err, products) => {
      if (err) return res.status(400).send({ message: "Error showing products", err });
      return res.status(200).send({ message: "Showing all products", products });
    });
};
