const mongoose = require("mongoose");

const { Schema } = mongoose;

const FacesSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },
    descriptors: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faces", FacesSchema);
