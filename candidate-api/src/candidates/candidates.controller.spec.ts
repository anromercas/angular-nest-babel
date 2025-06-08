import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { BadRequestException } from '@nestjs/common';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: Partial<CandidatesService>;

  beforeEach(async () => {
    service = {
      processExcel: jest.fn().mockResolvedValue({
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        years: 2,
        availability: true,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        { provide: CandidatesService, useValue: service },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería lanzar BadRequestException si falta el archivo', async () => {
    await expect(controller.uploadCandidate(undefined as any, 'John', 'Doe'))
      .rejects.toThrow(BadRequestException);
  });

  it('debería lanzar BadRequestException si faltan name o surname', async () => {
    const fakeFile = { buffer: Buffer.from('') } as Express.Multer.File;
    await expect(controller.uploadCandidate(fakeFile, '', 'Doe'))
      .rejects.toThrow(BadRequestException);
  });

  it('debería delegar en el servicio y devolver el candidato', async () => {
    const fakeFile = { buffer: Buffer.from('') } as Express.Multer.File;
    const dtoName = 'John';
    const dtoSurname = 'Doe';

    const result = await controller.uploadCandidate(fakeFile, dtoName, dtoSurname);
    expect(service.processExcel).toHaveBeenCalledWith(fakeFile.buffer, dtoName, dtoSurname);
    expect(result).toEqual({
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 2,
      availability: true,
    });
  });
});
