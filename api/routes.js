const router = require("express").Router();

const photosController = require("./controllers/photosController");

router.get("/", (req, res) => {
  res.json({
    message: "Ok",
  });
});

//Photos

//List all Photo URLs
router.post("/photos", photosController.getPhotos);

//List all Photo URLs that are trashed
router.post("/trashedphotos", photosController.getTrashedPhotos);

//Upload multiple photos
router.post(
  "/photos/upload",
  photosController.createDirectories,
  photosController.uploadPhotos,
  photosController.generateThumbnailsAndExif
);

//Delete all photos and thumbnails
router.post("/deleteAll", photosController.deleteAll);

//Trash multiple Photos
router.post("/photos/trash", photosController.trash);

module.exports = router;
