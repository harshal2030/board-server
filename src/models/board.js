const {Model, DataTypes} = require('sequelize');
const sequelize = require('./../db');

class Board extends Model {}

Board.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.STRING(2048),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mediaPath: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'boards',
    freezeTableName: true,
    timestamps: true,
})

module.exports = Board;
