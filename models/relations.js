import AllowedEmail from "./allowedEmail.js";
import User from "./userModel.js";
import Admin from "./adminModel.js";

// User ↔ AllowedEmail (1:1)
AllowedEmail.hasOne(User, {
  foreignKey: "email",
  sourceKey: "email",
  as: "user",
  onDelete: "CASCADE",
});

User.belongsTo(AllowedEmail, {
  foreignKey: "email",
  targetKey: "email",
  as: "allowedEmail",
  onDelete: "CASCADE",
});


export { AllowedEmail, User, Admin };
