import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define("User",{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firebaseId:{
        type: DataTypes.STRING, //firebase uid
        unique: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    regNo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
}, {
    tableName: "Users",
    timestamps: false
});

export default User;
