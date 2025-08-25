// Updated Admin model with hooks
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define("Admin", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
    primaryKey: true
  },
}, {
  tableName: "admins",
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

export default Admin;