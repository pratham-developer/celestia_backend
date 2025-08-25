import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AllowedEmail = sequelize.define("AllowedEmail", {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      isEmail: true, // ensures valid email format
    },
  },
}, {
  tableName: "allowed_emails", // table name
  timestamps: false, // disable createdAt/updatedAt
  hooks: {
    beforeCreate: (record) => {
      if (record.email) record.email = record.email.toLowerCase();
    },
    beforeUpdate: (record) => {
      if (record.email) record.email = record.email.toLowerCase();
    },
  },
});

export default AllowedEmail;
