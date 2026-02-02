import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateRandomSufix } from 'src/common/utils/gerenate-random-sufix';

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
      ![
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
      ].includes(fileType.mime)
    ) {
      throw new BadRequestException('Arquivo inválido ou tipo não permitido.');
    }

    const today = new Date().toISOString().split('T')[0];
    const uploadPath = resolve(__dirname, '..', '..', 'uploads', today);

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${generateRandomSufix()}`;
    const fileExtension = fileType.ext;
    const fileName = `${uniqueSuffix}.${fileExtension}`;
    const fileFullPath = resolve(uploadPath, fileName);

    writeFileSync(fileFullPath, file.buffer);

    return {
      url: `/uploads/${today}/${fileName}`,
    };
  }
}
