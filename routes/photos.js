var express = require("express");
var router = express.Router();

const getName = function (str) {
  return str.split("\\").pop().split("/").pop();
};

const getPhotos = () => {
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

router.post("/", async function (req, res, next) {
  let arrPhotos = await getPhotos();
  res.send(JSON.stringify(arrPhotos));
});

module.exports = router;
