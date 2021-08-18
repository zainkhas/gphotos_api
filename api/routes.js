const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
