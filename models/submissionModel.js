import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Submission = sequelize.define("Submission", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    projectName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ideaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    figmaLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    githubLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    otherLink1: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    otherLink2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    progressDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pptLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "submissions",
    timestamps: false,
    indexes: [
        { unique: true, fields: ["teamSrNo", "roundId"] },
    ],
});

export default Submission;