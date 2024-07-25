var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt
      .hash(this.password, 10)
      .then((hashed) => {
        this.password = hashed;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
