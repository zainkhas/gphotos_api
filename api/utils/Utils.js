import { THUMBNAIL_PATH } from "../../config";

const ExifImage = require("exif").ExifImage;
const sharp = require("sharp");

export const getExif = (image) => {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image }, (error, exifData) => {
        console.log("Exif: ", error, exifData);
        if (error) resolve(null);
        else resolve(exifData);
      });
    } catch (error) {
      console.log("Exif error: ", error);
      resolve(null);
    }
  });
};

export const generateThumbnail = (image) => {
  return new Promise((resolve, reject) => {
    sharp(image.path)
      .resize(250, 250)
      .withMetadata()
      .toFile(THUMBNAIL_PATH + "/thumb_" + image.filename, (err, info) => {
        console.log("Sharp: ", { err, info });
        resolve();
      });
  });
};

export const getFileNameFromPath = function (path) {
  return path.split("\\").pop().split("/").pop();
};

export const getPhotosFromDisk = (path) => {
  return new Promise((resolve, reject) => {
    const glob = require("glob");

    glob(path + "/**/*", (err, res) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        let finalArr = [];

        res?.map((image) => {
          finalArr.push({
            url: image,
            fileName: getFileNameFromPath(image),
          });
        });
        console.log(finalArr);
        resolve(finalArr);
      }
    });
  });
};

export const deleteFilesInDir = async (directory) => {
  const fsPromises = require("fs").promises;
  return fsPromises.rm(directory, {
    recursive: true,
  });
};

export const deleteFile = async (path) => {
  const fsPromises = require("fs").promises;
  return fsPromises.unlink(path);
};

export const createDirectory = (directory) => {
  const fsPromises = require("fs").promises;
  return fsPromises.mkdir(directory, {
    recursive: true,
  });
};

export const calculateMegaPixels = (width, height) => {
  let res = (width * height) / 1024000;
  return Math.round(res)?.toFixed(2);
};

export const formatBytes = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};

export const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

export const convertCoordinate = (coordinate) => {
  if (coordinate) {
    if (coordinate?.length > 0) {
      coordinate = coordinate.join();
    }

    coordinate = coordinate?.toString();
    coordinate = coordinate.replace(".", "");

    let firstComma = coordinate.indexOf(",");
    coordinate = setCharAt(coordinate, firstComma, ".");
    coordinate = coordinate.replace(",", "");
    coordinate = coordinate.replaceAll(" ", "");
    return coordinate;
  }
  return "0.0";
};

export const toFixed = (x) => {
  if (!x) {
    x = 0;
  }
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join("0");
    }
  }
  return x;
};

export const toFixedTrunc = (x, n) => {
  x = toFixed(x);

  // From here on the code is the same than the original answer
  const v = (typeof x === "string" ? x : x.toString()).split(".");
  if (n <= 0) return v[0];
  let f = v[1] || "";
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += "0";
  return `${v[0]}.${f}`;
};
