// !! This file extends NextAuth's built-in TypeScript types to add your custom fields to the session.

// Imports NextAuth's default session type so you can spread it and keep the existing fields (name, email, image).
import { DefaultSession } from "next-auth"

// This is module augmentation — you're reaching into the existing next-auth module and modifying its types without touching the library itself.
declare module "next-auth" {
    /*
        * Redefines the Session interface to add id: string to the user object
        * & DefaultSession["user"] spreads the original fields (name, email, image) so you don't lose them
        * The & is an intersection type — the final type has both your custom fields AND the default ones
    */
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"];
    }
}