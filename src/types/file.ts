type FileUploadStatus = 'TEMP';

type UploadImageResponse = {
  file_id: number;
  original_file_name: string;
  content_type: string;
  file_size: number;
  image_url: string;
  status: FileUploadStatus;
  created_at: string;
};

type FileErrorCode =
  | 'FILE_REQUIRED'
  | 'UNSUPPORTED_IMAGE_TYPE'
  | 'FILE_SIZE_EXCEEDED'
  | 'FILE_UPLOAD_FAILED'
  | 'UNAUTHORIZED'
  | 'FILE_NOT_FOUND'
  | 'FILE_ALREADY_IN_USE'
  | 'FILE_DELETE_FAILED';

type FileErrorResponse = {
  code?: FileErrorCode;
  message?: string;
};

class FileError extends Error {
  status: number;
  code?: FileErrorCode;

  constructor(message: string, status: number, code?: FileErrorCode) {
    super(message);
    this.name = 'FileError';
    this.status = status;
    this.code = code;
  }
}

export { FileError };
export type {
  FileErrorCode,
  FileErrorResponse,
  FileUploadStatus,
  UploadImageResponse,
};
