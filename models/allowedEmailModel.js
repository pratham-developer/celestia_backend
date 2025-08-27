import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AllowedEmail = sequelize.define("AllowedEmail", {
  email: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: "allowed_emails",
  timestamps: false,
  hooks: {
    beforeCreate: (record) => {
      if (record.email) record.email = record.email.toLowerCase();
    },
    beforeUpdate: (record) => {
      if (record.email) record.email = record.email.toLowerCase();
    },
  },
  indexes: [
    { unique: true, fields: ["email"] },
  ],
});

export default AllowedEmail;