declare module "multer" {
  import type { RequestHandler } from "express";

  export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer?: Buffer;
  }

  type Callback<TValue> = (error: Error | null, value: TValue) => void;

  export interface DiskStorageOptions {
    destination?:
      | string
      | ((req: unknown, file: UploadedFile, cb: Callback<string>) => void);
    filename?: (req: unknown, file: UploadedFile, cb: Callback<string>) => void;
  }

  export interface MulterOptions {
    storage?: unknown;
    limits?: {
      fileSize?: number;
    };
  }

  export interface MulterInstance {
    single(fieldName: string): RequestHandler;
  }

  export interface MulterStatic {
    (options?: MulterOptions): MulterInstance;
    diskStorage(options: DiskStorageOptions): unknown;
  }

  const multer: MulterStatic;
  export default multer;
}

declare namespace Express {
  interface Request {
    file?: import("multer").UploadedFile;
    uploadAuthorized?: boolean;
  }
}
