import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_ROLES } from '@prontuario/shared';
import { RecordsService } from './records.service';
import { MedicalRecord } from './entities/medical-record.entity';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../users/entities/user.entity';

const createRepositoryMock = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn()
});

describe('RecordsService', () => {
  let service: RecordsService;
  let recordRepository: jest.Mocked<Repository<MedicalRecord>>;
  let patientRepository: jest.Mocked<Repository<Patient>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const doctorUser = Object.assign(new User(), {
    id: 'doctor-1',
    role: USER_ROLES.MEDICO
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: getRepositoryToken(MedicalRecord),
          useValue: createRepositoryMock()
        },
        { provide: getRepositoryToken(Patient), useValue: createRepositoryMock() },
        { provide: getRepositoryToken(User), useValue: createRepositoryMock() }
      ]
    }).compile();

    service = moduleRef.get(RecordsService);
    recordRepository = moduleRef.get(getRepositoryToken(MedicalRecord));
    patientRepository = moduleRef.get(getRepositoryToken(Patient));
    userRepository = moduleRef.get(getRepositoryToken(User));
  });

  it('prevents non-doctor from creating record', async () => {
    const author = Object.assign(new User(), {
      id: 'secretaria',
      role: USER_ROLES.SECRETARIA
    });

    await expect(
      service.create('patient', author, { summary: 'Test', notes: undefined, tags: [] })
    ).rejects.toThrow(ForbiddenException);
  });

  it('creates record when doctor and patient exist', async () => {
    patientRepository.findOne.mockResolvedValue({ id: 'patient' } as Patient);
    userRepository.findOne.mockResolvedValue(doctorUser);
    recordRepository.create.mockReturnValue({ id: 'record' } as MedicalRecord);
    recordRepository.save.mockResolvedValue({ id: 'record' } as MedicalRecord);

    const result = await service.create('patient', doctorUser, {
      summary: 'Resumo',
      notes: undefined,
      tags: []
    });

    expect(result.id).toBe('record');
    expect(recordRepository.save).toHaveBeenCalled();
  });

  it('prevents update by different doctor', async () => {
    const record = Object.assign(new MedicalRecord(), {
      id: 'record',
      doctor: Object.assign(new User(), { id: 'doctor-2', role: USER_ROLES.MEDICO }),
      summary: 'Old',
      tags: []
    });

    jest.spyOn(service, 'findOne').mockResolvedValue(record);

    await expect(
      service.update('record', doctorUser, { summary: 'Updated' })
    ).rejects.toThrow(ForbiddenException);
  });
});
