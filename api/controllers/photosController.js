const { UPLOAD_PATH, THUMBNAIL_PATH } = require("../../config");
const {
  generateThumbnail,
  getPhotosFromDisk,
  deleteFilesInDir,
  createDirectory,
  getExif,
  calculateMegaPixels,
  formatBytes,
  convertCoordinate,
  toFixedTrunc,
} = require("../utils/Utils");
const multer = require("multer");
const path = require("path");
const Photo = require("../models/photoModel");
import moment from "moment";
import { existsSync } from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

const fileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);
  const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!whitelist.includes(file.mimetype)) {
    return callback(new Error("Only images are allowed"));
  }

  if (existsSync(path.join(UPLOAD_PATH, file.originalname))) {
    callback(null, false);
  }
  callback(null, true);
};

exports.getPhotos = async (req, res) => {
  let arrPhotos = await getPhotosFromDisk(UPLOAD_PATH);
  res.send(JSON.stringify(arrPhotos));
};

exports.generateThumbnailsAndExif = async (req, res) => {
  try {
    let promises = req?.files?.map(async (image) => {
      await generateThumbnail(image);
      const exif = await getExif(image.path);
      let metaData = "";
      let date = moment();

      if (exif) {
        const dateCreated = exif?.exif?.CreateDate;
        date = moment(dateCreated, "YYYY-MM-DD HH:mm:ss");
        const width = exif?.image?.ImageHeight;
        const height = exif?.image?.ImageWidth;
        const megaPixels = calculateMegaPixels(width, height);
        const size = formatBytes(image?.size, true);
        const device = exif?.image?.Make + " " + exif?.image?.Model;
        const aperture = toFixedTrunc(exif?.exif?.MaxApertureValue, 1);
        const focalLength = exif?.exif?.FocalLength;
        const iso = exif?.exif?.ISO;
        const latitude = convertCoordinate(exif?.gps?.GPSLatitude);
        const longitude = convertCoordinate(exif?.gps?.GPSLongitude);
        //for some reason the library is confused between height and width and inverting them.
        const thumbWidth = exif?.thumbnail?.ExifImageHeight;
        const thumbHeight = exif?.thumbnail?.ExifImageWidth;

        metaData = JSON.stringify({
          dateCreated,
          megaPixels,
          width,
          height,
          size,
          device,
          aperture,
          focalLength,
          iso,
          latitude,
          longitude,
          thumbWidth,
          thumbHeight,
        });
      }

      let photo = new Photo({
        name: image?.filename,
        dateCreated: date,
        metaData,
      });
      let res = await photo.save();
      console.log("Photo saved at id: ", res?._id);
    });

    await Promise.all(promises);
    res.json({ message: "Images uploaded!" });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await deleteFilesInDir(UPLOAD_PATH);
    await deleteFilesInDir(THUMBNAIL_PATH);

    let deleteRes = await Photo.deleteMany();

    console.log("Delete res: ", deleteRes);

    res.json({ message: "Deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete files!" });
  }
};

exports.createDirectories = async (req, res, next) => {
  try {
    await createDirectory(UPLOAD_PATH);
    await createDirectory(THUMBNAIL_PATH);

    next();
  } catch (error) {
    res.status(500).json({ message: "Could not create directories" });
  }
};

exports.uploadPhotos = multer({
  storage,
  fileFilter,
}).array("photos");
