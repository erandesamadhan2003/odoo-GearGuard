import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

export const configurePassport = (passportInstance) => {

    passportInstance.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
        },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ where: { googleId: profile.id } });
                    if (user) {
                        return done(null, user);
                    }

                    const existingEmailUser = await User.findOne({
                        where: { email: profile.emails[0].value.toLowerCase() }
                    });

                    if (existingEmailUser) {
                        existingEmailUser.googleId = profile.id;
                        existingEmailUser.authProvider = 'google';
                        existingEmailUser.profilePicture = profile.photos[0]?.value || '';
                        await existingEmailUser.save();
                        return done(null, existingEmailUser);
                    }

                    user = await User.create({
                        googleId: profile.id,
                        fullName: profile.displayName,
                        email: profile.emails[0].value.toLowerCase(),
                        authProvider: 'google',
                        profilePicture: profile.photos[0]?.value || ''
                    });

                    done(null, user);

                } catch (error) {
                    console.error("Error in Google Strategy: ", error);
                    done(error, null);
                }
            }
        )
    );

    passportInstance.serializeUser((user, done) => {
        done(null, user.id);
    });

    passportInstance.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
