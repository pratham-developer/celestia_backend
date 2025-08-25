import AllowedEmail from "./allowedEmail.js";
import User from "./userModel.js";


// 1:1 relation b/w User and Allowed Email

AllowedEmail.hasOne(User,{
    foreignKey: "email", //fk in User table (column name = email)
    sourceKey: "email", // references from Allowed Email Table (column name = email)
    as: "user"
});

User.belongsTo(AllowedEmail,{
    foreignKey : "email", //fk in User table (column name = email)
    targetKey : "email", // references from Allowed Email Table (column name = email)
    as: "allowedEmail"
});

export {AllowedEmail, User};