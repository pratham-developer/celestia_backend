// Updated User model with hooks
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  regNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "users",
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
    { unique: true, fields: ["regNo"] },
  ],
});

export default User;