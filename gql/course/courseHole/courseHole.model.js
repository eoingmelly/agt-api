const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseHoleSchema = new Schema({
  holeNumber: Number,
  strokeIndex: Number,
  par: Number,
  length: Number,
});

const CourseHole = mongoose.model("CourseHole", courseHoleSchema);

module.exports = {
  courseHoleSchema: courseHoleSchema,
  courseHoleModel: CourseHole,
};
