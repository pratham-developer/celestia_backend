import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Result = sequelize.define("Result", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    teamSrNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    place: {
        type: DataTypes.ENUM("WINNER", "RUNNER_UP", "SECOND_RUNNER_UP", "BEST_UI_UX", "BEST_HARDWARE", "BEST_FRESHERS"),
        allowNull: false,
    },
}, {
    tableName: "results",
    timestamps: false,
});

export default Result;