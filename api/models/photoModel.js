const mongoose = require("mongoose");

const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
    metaData: {
      type: String,
      required: false,
    },
    trashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", PhotoSchema);
