import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo, VIDEO_DIMENSIONS } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        // .lean() — returns plain JavaScript objects instead of full Mongoose documents, which is faster and lighter since you don't need Mongoose methods like .save() on the result
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        return NextResponse.json(videos);

    } catch (error) {
        console.error("Error while fetching videos: ", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Checks if the user is logged in via NextAuth
        // Only authenticated users can create videos
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: VIDEO_DIMENSIONS.height,
                width: VIDEO_DIMENSIONS.width,
                quality: body.transformation?.quality ?? 100
            }
        }
        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo, { status: 201 });
    } catch (error) {
        console.error("Error while creating a video: ", error);
        return NextResponse.json(
            { error: "Failed to create a video" },
            { status: 500 }
        );
    }
}

/*
    * This file defines two API endpoints for your videos — one for fetching all videos and one for creating a new video.

    * The overall picture of both endpoints ----
    * GET  /api/video  → public, returns all videos sorted newest first
    * POST /api/video  → protected, creates a new video with default transformations
*/