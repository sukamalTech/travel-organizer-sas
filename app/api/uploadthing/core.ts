// app/api/uploadthing/core.ts
// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "@uploadthing/shared";

// const f = createUploadthing();

// export const ourFileRouter = {
//   // Define a file uploader that accepts PDFs and images
//   documentUploader: f({
//     image: { maxFileSize: "4MB", maxFileCount: 1 },
//     pdf: { maxFileSize: "8MB", maxFileCount: 1 },
//   })
//     .middleware(async ({ req }) => {
//       // Optional: Add Supabase auth verification here to secure your upload endpoint
//       return { userId: "mock_user_id" };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.url);
//       return { uploadedBy: metadata.userId, url: file.url, key: file.key };
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;

// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      return { userId: "user_id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete, url:", file.url);
      return { url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
