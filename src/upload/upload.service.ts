import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class UploadService {
  async handleUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo encontrado.');
    }

    const maxFileSize = 900 * 1024;

    if (file.size > maxFileSize) {
      throw new BadRequestException('Arquivo muito grande.');
    }

    const fileType = await fileTypeFromBuffer(file.buffer);

    if (
      !fileType ||
      !['image/png', 'image.jpeg', 'image/webp', 'image/gif'].includes(
        fileType.mime,
      )
    ) {
      throw new BadRequestException('Arquivo ');
    }
  }
}
