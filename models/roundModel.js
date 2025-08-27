import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Round = sequelize.define("Round", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("upcoming", "active", "completed"),
    allowNull: false,
    defaultValue: "upcoming",
    validate: {
      isIn: {
        args: [["upcoming", "active", "completed"]],
        msg: "Status must be either 'upcoming', 'active', or 'completed'",
      },
    },
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true
  },
}, {
  tableName: "rounds",
  timestamps: false,
});

export default Round;
