const { Schema, model, models } = require("mongoose");
const bcrypt = require("bcrypt");

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "'Name' field is required"],
    },
    lastName: {
      type: String,
      required: [true, "'Last Name' field is required"],
    },
    email: {
      type: String,
      required: [true, "'email' field is required"],
      match: [emailRegex, "invalid email"],
      validate: [
        {
          validator(email) {
            return models.User.findOne({ email })
              .then((user) => {
                return !user;
              })
              .catch(() => false);
          },
          message: "email is already in use",
        },
      ],
    },
    phone: {
      type: String,
      required: [true, "'Phone' field is required"],
    },
    password: {
      type: String,
      required: [true, "'Password' field is required"],
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/mashcol/image/upload/v1651865781/quizapp-images/john-doe_zzcele_wzppji.png",
    },
    quizzes: {
      type: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    },
    subscribedQuizzes: {
      type: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});

const User = model("User", userSchema);

module.exports = User;
