import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Track = sequelize.define("Track",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    }

},
{
    tableName:"tracks",
    timestamps:false
});

export default Track;