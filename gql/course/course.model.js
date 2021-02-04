const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: { type: String },
    name_lowered: { type: String },
    rating: { type: Number },
    image: { type: String },
    description: { type: String },
    par: { type: Number },
    metres: { type: Number },
  },
  { timestamps: true }
);

let courseModel = mongoose.model("Course", courseSchema);

module.exports = {
  courses: courseSchema,
  coursesModel: courseModel,
};
