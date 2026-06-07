import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    // Your application logic to authenticate the user
    // For example, you can check if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response

    try {
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
            // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        })

        return Response.json({ token, expire, signature, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } catch (error) {
        console.error("Error while authenticating for ImageKit: ", error)
        return Response.json(
            { error: "Authentication for Imagekit failed" },
            { status: 500 }
        )
    }
}

/*
    * This is an authentication endpoint for ImageKit uploads. It's a security layer that ensures only your server (with the private key) can authorize uploads — never the client directly.

    * Why this endpoint needs to exist?
    * ImageKit requires a signature to validate that an upload request is legitimate. You can't generate this signature on the frontend because that would expose your privateKey to anyone who opens DevTools.

    So the flow is:
    Frontend wants to upload
        ↓
    Asks YOUR server for auth params
        ↓
    Your server generates signature using private key
        ↓
    Frontend uses those params to upload directly to ImageKit
        ↓
    ImageKit validates the signature ✅

    * Your private key never leaves your server.
*/