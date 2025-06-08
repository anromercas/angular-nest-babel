import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(xlsx|xls)$/i)
        ) {
          return cb(new BadRequestException('Solo se permiten archivos Excel'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadCandidate(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('surname') surname: string,
  ) {
    if (!file) {
      throw new BadRequestException('Falta el archivo Excel');
    }
    if (!name || !surname) {
      throw new BadRequestException('Los campos name y surname son obligatorios');
    }

    const candidate = await this.candidatesService.processExcel(
      file.buffer,
      name,
      surname,
    );
    return candidate;
  }
}
