/*
* Schema — used to define the shape/rules of your MongoDB documents
* model — creates a Mongoose model from a schema
* models — a registry of all already-compiled models in the current runtime
* bcrypt — for hashing passwords
*/
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId, // optional field
    createdAt?: Date, // optional field
    updatedAt?: Date // optional field
}

/*
* Defines the MongoDB document structure with validation rules
* unique: true on email ensures no two users share an email
* timestamps: true tells Mongoose to automatically manage createdAt and updatedAt fields
*/
/////////////////////////
/*
 * <IUser> is a generic type argument being passed to Schema. It tells Mongoose: "the documents in this schema will have the shape of IUser".
 * This gives you TypeScript autocompletion and type checking inside the schema definition. For example, if you typo a field name or use the wrong type, TypeScript will catch it.
*/
const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

/*
* Runs before every .save() call on a User document
* this.isModified("password") — only hashes if the password field actually changed (avoids double-hashing on unrelated updates)
* bcrypt.hash(this.password, 10) — hashes the plain-text password with a salt round of 10
* The next() comment is correct — modern Mongoose (v7+) handles async middleware automatically without needing to call next()
*/
userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    // next(); // this next() call is not required in modern mongoose versions
});

/*
* In Next.js, due to hot reloading in dev mode, the module can re-execute multiple times
* If you just called model("User", userSchema) every time, Mongoose would throw: "Cannot overwrite User model once compiled"
* So this checks: if a User model already exists in the registry, reuse it — otherwise create a fresh one
* models?.User uses optional chaining in case models is undefined
*/
const User = models?.User || model<IUser>("User", userSchema);

export default User;