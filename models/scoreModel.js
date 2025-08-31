import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Score = sequelize.define("Score", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    teamSrNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    criteria: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: "scores",
    timestamps: false,
    indexes: [
        { unique: true, fields: ["teamSrNo", "roundId"] },
    ],
});

export default Score;
