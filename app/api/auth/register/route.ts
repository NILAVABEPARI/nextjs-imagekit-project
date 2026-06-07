// !! This is a Next.js API route that handles user registration. It's the backend endpoint your frontend calls when a user signs up.

import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// In Next.js App Router, you export named functions matching HTTP methods — GET, POST, PUT, etc.
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already registered" },
                { status: 400 }
            );
        }

        // Creates a new user document in MongoDB. 
        // The bcrypt pre-save hook you defined in User.ts automatically hashes the password before it's stored — I don't need to hash it manually here.
        await User.create({
            email,
            password
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error -- ', error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        )
    }
}

/*
POST /api/auth/register
    ↓
Parse body → validate inputs
    ↓
Connect to DB → check duplicate email
    ↓
Create user → password auto-hashed by pre-save hook
    ↓
Return success response
*/