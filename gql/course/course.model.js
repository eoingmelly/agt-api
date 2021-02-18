const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { courseHoleSchema } = require("./courseHole/courseHole.model");

const courseSchema = new Schema(
  {
    name: { type: String },
    name_lowered: { type: String },
    rating: { type: Number },
    image: { type: String },
    description: { type: String },
    par: { type: Number },
    metres: { type: Number },

    holes: [courseHoleSchema],
  },
  { timestamps: true }
);

let courseModel = mongoose.model("Course", courseSchema);

module.exports = {
  courses: courseSchema,
  coursesModel: courseModel,
};
