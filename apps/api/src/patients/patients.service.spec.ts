import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(() => Promise.resolve({ items: [], meta: {} }))
}));

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: jest.Mocked<Repository<Patient>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis()
            })),
            preload: jest.fn(),
            remove: jest.fn()
          }
        }
      ]
    }).compile();

    service = moduleRef.get(PatientsService);
    repository = moduleRef.get(getRepositoryToken(Patient));
  });

  it('creates patient when document is unique', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.create.mockReturnValue({ id: '1' } as Patient);
    repository.save.mockResolvedValue({ id: '1' } as Patient);

    const patient = await service.create({
      fullName: 'Test',
      birthDate: '2000-01-01',
      documentId: 'ABC',
      rg: 'RG123',
      gender: 'Masculino',
      maritalStatus: 'Solteiro',
      profession: 'Tester',
      phone: undefined,
      whatsapp: undefined,
      email: undefined,
      addressJson: {
        street: 'Rua 1',
        number: '10',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000'
      },
      emergencyContact: undefined
    });

    expect(patient.id).toBe('1');
    expect(repository.save).toHaveBeenCalled();
  });

  it('throws when document already exists', async () => {
    repository.findOne.mockResolvedValue({ id: 'existing' } as Patient);

    await expect(
      service.create({
        fullName: 'Test',
        birthDate: '2000-01-01',
        documentId: 'ABC',
        rg: 'RG123',
        gender: 'Masculino',
        maritalStatus: 'Solteiro',
        profession: 'Tester',
        phone: undefined,
        whatsapp: undefined,
        email: undefined,
        addressJson: {
          street: 'Rua 1',
          number: '10',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01000-000'
        },
        emergencyContact: undefined
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when patient not found by id', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
