const { Model, DataTypes, Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sha512 = require('crypto-js/sha512');

const { usernamePattern } = require('../utils/regexPatterns')
const sequelize = require('./../db');

const privateKeyPath = path.join(__dirname, './../keys/private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

class User extends Model {
    async generateAuthToken() {
        const user = this;

        const token = jwt.sign({username: user.username.toString()}, privateKey, {algorithm: 'RS256'});
        user.tokens.push(token);
        await user.save({ fields: ['tokens'] });
        return token;
    }

    async removeSensetiveInfo() {
        const user = this.toJSON();

        return {
            name: user.name,
            username: user.username,
            bio: user.bio,
        }
    }

    static async findByCredentials(query, password) {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        username: query,
                    },
                    {
                        email: query,
                    },
                ],
            }
        })

        if (!user) {
            throw new Error('No such user')
        }

        const pass = sha512(password).toString()

        if (pass !== user.password) {
            throw new Error('Invalid credentials');
        }

        return user;
    }
}

User.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 100,
            min: 1,
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            max: 30,
            min: 1,
            is: usernamePattern,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 6,
        },
    },
    tokens: {
        type: DataTypes.ARRAY(DataTypes.STRING(400)),
        defaultValue: [],
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: '/images/avatar/default.png',
    },
    bio: {
        type: DataTypes.STRING,
        defaultValue: '',
    }
}, {
    sequelize,
    modelName: 'users',
    freezeTableName: true,
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            user.password = sha512(user.password).toString();
        }
    }
})

sequelize.sync()

module.exports = User;
