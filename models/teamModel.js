import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Team = sequelize.define("Team", {
    srNo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3, 50],
                msg: "Team name must be between 3 and 50 characters long",
            },
        },
    },

    teamCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    leaderId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'eliminated', 'dissolved'),
        allowNull: false,
        defaultValue: 'active',
        validate: {
            isIn: {
                args: [["active", "eliminated", "dissolved"]],
                msg: "Status must be either 'active', 'eliminated', or 'dissolved'",
            },
        },
    },
    trackId:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        tableName: "teams",
        timestamps: false
    });

export default Team;