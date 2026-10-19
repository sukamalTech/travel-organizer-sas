// lib/uploadthing.ts
// lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// ✅ This generates and exports useUploadThing for your app router types
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
