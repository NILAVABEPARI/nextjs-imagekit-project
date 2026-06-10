"use client"
import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from "@imagekit/next";
import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "image" | "video"
}

// FileUpload component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file")
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("File size must be less than 100 MB")
            }
        }
        return true;
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;
        setUploading(true);;
        setError(null);

        try {
            const { data: authRes } = await axios.get("/api/auth/imagekit-auth");
            const response = await upload({
                // Authentication parameters
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: authRes.signature,
                expire: authRes.expire,
                token: authRes.token,
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
                // Abort signal to allow cancellation of the upload if needed.
                // abortSignal: abortController.signal,
            });
            onSuccess(response);
        } catch (error) {
            console.error('Upload Failed: ', error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <>
            <input type="file" accept={fileType === "video" ? "video/*" : "image/*"} onChange={handleFileChange} />
            {uploading && (<span>Loading...</span>)}

        </>
    );
};

export default FileUpload;