import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface Candidate {
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
}

@Injectable()
export class CandidatesService {

  async processExcel(buffer: Buffer, name: string, surname: string): Promise<Candidate> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, 
        raw: false,
        defval: '',
      });

      if (jsonData.length < 2) {
        throw new BadRequestException('El Excel debe contener al menos una fila de datos');
      }

      const headers: string[] = jsonData[0].map((h: any) =>
        typeof h === 'string' ? h.toLowerCase().trim() : '',
      );
      const dataRow: any[] = jsonData[1];

      const idxSeniority = headers.findIndex((h) => h === 'seniority');
      const idxYears = headers.findIndex((h) => h === 'years');
      const idxAvailability = headers.findIndex((h) => h === 'availability');

      if (idxSeniority < 0 || idxYears < 0 || idxAvailability < 0) {
        throw new BadRequestException(
          'El Excel debe tener columnas con encabezados: seniority, years, availability',
        );
      }

      const seniorityRaw = String(dataRow[idxSeniority]).toLowerCase().trim();
      if (seniorityRaw !== 'junior' && seniorityRaw !== 'senior') {
        throw new BadRequestException(
          `Valor inválido en 'seniority': ${dataRow[idxSeniority]}`,
        );
      }
      const seniority = seniorityRaw as 'junior' | 'senior';

      const yearsRaw = Number(dataRow[idxYears]);
      if (isNaN(yearsRaw)) {
        throw new BadRequestException(
          `Valor inválido en 'years': ${dataRow[idxYears]}`,
        );
      }
      const years = yearsRaw;

      const availRaw = String(dataRow[idxAvailability]).toLowerCase().trim();
      let availability: boolean;
      if (availRaw === 'true' || availRaw === 'verdadero' || availRaw === '1') {
        availability = true;
      } else if (availRaw === 'false' || availRaw === 'falso' || availRaw === '0') {
        availability = false;
      } else {
        throw new BadRequestException(
          `Valor inválido en 'availability': ${dataRow[idxAvailability]}`,
        );
      }

      return {
        name,
        surname,
        seniority,
        years,
        availability,
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('Error al procesar el archivo Excel');
    }
  }
}
