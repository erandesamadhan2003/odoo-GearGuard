import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Full name is required'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: {
                msg: 'Email is required'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Nullable for Google OAuth users
        validate: {
            // Only validate if password is provided (for local auth)
            len: {
                args: [6, Infinity],
                msg: 'Password must be at least 6 characters'
            }
            // Note: Sequelize automatically skips validation when value is null
        }
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        sparse: true
    },
    authProvider: {
        type: DataTypes.ENUM('local', 'google'),
        defaultValue: 'local',
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            // Lowercase email
            if (user.email) {
                user.email = user.email.toLowerCase();
            }
            // Hash password
            if (user.password && user.authProvider === 'local') {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            // Lowercase email if changed
            if (user.changed('email') && user.email) {
                user.email = user.email.toLowerCase();
            }
            // Hash password if changed
            if (user.changed('password') && user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
    if (!this.password) {
        throw new Error('Password not set for this user');
    }
    return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to convert to JSON (exclude password)
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

export { User };
