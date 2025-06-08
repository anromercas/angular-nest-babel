import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService, Candidate } from './candidates.service';
import { BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesService],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería procesar un buffer XLSX válido', async () => {
    const buffer = Buffer.from('dummy');
    jest.spyOn(XLSX, 'read').mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} as any },
    });
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      ['seniority', 'years', 'availability'],
      ['junior', '3', 'verdadero'],
    ]);

    const result = await service.processExcel(buffer, 'John', 'Doe');
    expect(XLSX.read).toHaveBeenCalledWith(buffer, { type: 'buffer' });
    expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith({}, { header: 1, raw: false, defval: '' });
    expect(result).toEqual({
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 3,
      availability: true,
    } as Candidate);
  });

  it('debería lanzar BadRequestException si faltan filas de datos', async () => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} as any },
    });
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      ['seniority', 'years', 'availability']
    ]);

    await expect(service.processExcel(Buffer.from(''), 'John', 'Doe'))
      .rejects.toThrow(BadRequestException);
  });

  it('debería lanzar BadRequestException si el valor de availability no es válido', async () => {
    jest.spyOn(XLSX, 'read').mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} as any },
    });
    jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([
      ['seniority', 'years', 'availability'],
      ['junior', '2', '¿no sé?'],
    ]);

    await expect(service.processExcel(Buffer.from(''), 'John', 'Doe'))
      .rejects.toThrow(BadRequestException);
  });

  it('debería lanzar BadRequestException si ocurre cualquier otro error interno', async () => {
    jest.spyOn(XLSX, 'read').mockImplementation(() => { throw new Error('boom'); });

    await expect(service.processExcel(Buffer.from(''), 'John', 'Doe'))
      .rejects.toThrow(BadRequestException);
  });
});
