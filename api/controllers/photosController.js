const sharp = require("sharp");
const { THUMBNAIL_PATH, UPLOAD_PATH } = require("../../config");

const getName = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const getPhotosFromDisk = () => {
  return new Promise((resolve, reject) => {
    const glob = require("glob");

    var getDirectories = function (src, callback) {
      glob(src + "/**/*", callback);
    };
    getDirectories(UPLOAD_PATH, function (err, res) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        let finalArr = [];

        res?.map((image) => {
          finalArr.push({
            url: image?.replace("public", ""),
            fileName: getName(image),
          });
        });
        console.log(finalArr);
        resolve(finalArr);
      }
    });
  });
};

exports.getPhotos = async (req, res) => {
  let arrPhotos = await getPhotosFromDisk();
  res.send(JSON.stringify(arrPhotos));
};

exports.uploadPhotos = (req, res) => {
  console.log("File was: ", req.files);

  req?.files?.map((file) => {
    sharp(file.path)
      .resize(250, 250)
      .withMetadata()
      .toFile(THUMBNAIL_PATH + "/thumb_" + file.filename, (err, info) => {
        console.log("Sharp: ", { err, info });
      });
  });
  res.status(200).json({ message: "Images uploaded!" });
};
