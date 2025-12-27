import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
    },
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'full_name',
        validate: {
            notEmpty: {
                msg: 'Full name is required'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
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
        type: DataTypes.STRING(255),
        allowNull: true // Nullable for Google OAuth users
    },
    googleId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        field: 'google_id'
    },
    authProvider: {
        type: DataTypes.ENUM('local', 'google'),
        defaultValue: 'local',
        allowNull: false,
        field: 'auth_provider'
    },
    profilePicture: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'profile_picture'
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'technician', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.email) {
                user.email = user.email.toLowerCase();
            }
            if (user.password && user.authProvider === 'local') {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('email') && user.email) {
                user.email = user.email.toLowerCase();
            }
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