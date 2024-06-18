const express = require("express");
const router = express.Router();
const multer = require("multer");
const ProdController = require("../controllers/prodController");

const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

router.post("/", upload.single("productImage"), ProdController.createProduct);
router.get("/show", ProdController.getProducts);

module.exports = router;
