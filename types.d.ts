import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

export { };

/*
**The Problem**
* In Next.js dev mode, due to **hot reloading**, your server code re-executes on every file change. If you create a new Mongoose connection every time, you'll quickly hit MongoDB's connection limit and see warnings like:
```
MongooseError: Too many connections
```
So the standard fix is to **cache the connection** on the `global` object — because `global` persists across hot reloads, unlike module-level variables.

```
let cachedConn = null; // this resets on every hot reload ❌
global.mongoose = { conn: null, promise: null }; // this persists across hot reloads ✅
```

**The Problem with TypeScript**
* When you write `global.mongoose`, TypeScript has no idea what `mongoose` is on the `global` object. It'll throw:
```
Property 'mongoose' does not exist on type 'typeof globalThis'
```

**What this file does**
* It **extends the global TypeScript type** to tell it: *"hey, `global.mongoose` is a valid property, and here's its shape"*. This is called **ambient declaration** — you're not creating anything at runtime, just informing TypeScript about something that will exist.
- `conn` — stores the active Mongoose connection once established
- `promise` — stores the in-flight connection promise to avoid creating duplicate connections


**Why a `.d.ts` file?**
* `.d.ts` files are **declaration-only files** — pure TypeScript types, no runtime code. They're the right place for things like extending global types, because:
- They don't emit any JavaScript
- TypeScript automatically picks them up across your project
- Keeps type augmentation separate from actual logic


**The `export {}` at the bottom**
* Without this, TypeScript treats the file as a **script** (global scope), and `declare global` behaves differently. Adding any `export` or `import` makes it a **module**, which is required for `declare global` to correctly augment the global type rather than just redefine it.
*/