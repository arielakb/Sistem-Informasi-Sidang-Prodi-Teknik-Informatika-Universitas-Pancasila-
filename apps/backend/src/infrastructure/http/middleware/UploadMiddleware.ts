import multer, {
  FileFilterCallback,
  StorageEngine,
} from 'multer';
import path from 'path';
import { Request, RequestHandler } from 'express';
import { ApiError } from '../../utils/ApiError';

// Konfigurasi storage
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb
  ): void => {
    cb(null, './uploads/');
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb
  ): void => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${ext}`
    );
  },
});

// Filter file
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        'Hanya file PDF dan Word yang diizinkan'
      )
    );
  }
};

// Limit 10 MB
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// Middleware single file
export const uploadSingle = (
  fieldName: string
): RequestHandler => {
  return upload.single(fieldName);
};

// Middleware multiple files
export const uploadMultiple = (
  fieldNames: string[]
): RequestHandler => {
  return upload.fields(
    fieldNames.map((name) => ({
      name,
      maxCount: 1,
    }))
  );
};