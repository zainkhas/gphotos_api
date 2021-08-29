const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { UPLOAD_PATH } = require("../config");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage });

const photosController = require("./controllers/photosController");

router.get("/", (req, res) => {
  res.json({
    message: "Ok",
  });
});

//Photos
router.post("/photos", photosController.getPhotos);
router.post(
  "/photos/upload",
  upload.array("photos", 50),
  photosController.uploadPhotos
);

module.exports = router;
