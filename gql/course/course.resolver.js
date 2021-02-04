const { courses, coursesModel } = require("./course.model");

module.exports = {
  Query: {
    Courses: async (parent, args, ctx, info) => {
      let courses, error;
      // get userData from ctx
      const { userData } = ctx;
      await coursesModel
        .find()
        .then((crs) => {
          courses = crs;
        })
        .catch((err) => {
          error = err;
        });
      return { courses, error };
    },

    Course: async (parent, { id }, ctx, info) => {
      // get userData from ctx
      const { userData } = ctx;
      let course, error;
      try {
        course = await coursesModel.findById(id);
      } catch (err) {
        error = err;
      }
      return { course, error };
    },
  },
  Mutation: {
    AddCourse: async (parent, { data }, ctx, info) => {
      let newCourseData = { ...data };
      // get userData from ctx
      const { userData } = ctx;

      let error, course;
      try {
        course = await coursesModel.findOne({
          name_lowered: newCourseData.name.toLowerCase(),
        });

        if (!course) {
          let newCourse = new coursesModel(newCourseData);
          newCourse.name_lowered = newCourse.name.toLowerCase();
          await newCourse
            .save()
            .then(async (crs) => {
              course = crs;
            })
            .catch((err) => {
              error = err;
            });
        } else {
          console.log("No need, you're already here!");
        }

        return { course, error };
      } catch (err) {
        error = err;
        return { course, error };
      }
    },

    DeleteCourse: async (parent, { id }, ctx, info) => {
      let deletedCourse, error;
      // get userData from ctx
      const { userData } = ctx;
      try {
        await coursesModel
          .findByIdAndDelete(id)
          .then(async (crs) => {
            deletedCourse = crs;
          })
          .catch((err) => {
            error = err;
          });

        return { course: deletedCourse, error };
      } catch (err) {
        error = err;
        return { course: null, error };
      }
    },

    UpdateCourse: async (parent, { data, id }, ctx, info) => {
      // ctx should contain the logged in user data here, and he's the only one who can update himself.
      // But for now, just accept that it's by id passed in.
      // get userData from ctx
      const { userData } = ctx;
      let error, updatedCourse;
      try {
        let updated = { ...data };
        await coursesModel
          .findByIdAndUpdate(id, updated, { new: true })
          .then((updated) => {
            updatedCourse = updated;
          })
          .catch((err) => {
            error = err;
          });

        return { course: updatedCourse, error };
      } catch (err) {
        error = err;
        return { course: updatedCourse, error };
      }
    },

    DeleteCourses: async (parent, { data }, ctx, info) => {
      //Just a quick clear down of ALL courses, won't be keeping this!

      await coursesModel.deleteMany({});

      return "All done...";
    },
  },
};
