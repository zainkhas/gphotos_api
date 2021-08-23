const sharp = require("sharp");

const getName = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const getPhotosFromDisk = () => {
  return new Promise((resolve, reject) => {
    const glob = require("glob");

    var getDirectories = function (src, callback) {
      glob(src + "/**/*", callback);
    };
    getDirectories("public/uploads", function (err, res) {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        let finalArr = [];

        res?.map((image) => {
          finalArr.push({
            img: image?.replace("public", ""),
            title: getName(image),
            author: "Zain",
            cols: 2,
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
      .toFile("uploads/thumb/thumb_" + file.filename, (err, info) => {
        console.log("Sharp: ", { err, info });
      });
  });
  res.status(200).json({ message: "Please select file first" });
};
