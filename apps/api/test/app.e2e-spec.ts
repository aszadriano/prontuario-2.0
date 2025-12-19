import * as request from 'supertest';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as bcrypt from 'bcrypt';
import { Reflector } from '@nestjs/core';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { PatientsModule } from '../src/patients/patients.module';
import { RecordsModule } from '../src/records/records.module';
import { User } from '../src/users/entities/user.entity';
import { Patient } from '../src/patients/entities/patient.entity';
import { MedicalRecord } from '../src/records/entities/medical-record.entity';
import { UsersService } from '../src/users/users.service';
import { PatientsService } from '../src/patients/patients.service';
import { USER_ROLES } from '@prontuario/shared';

const buildTestingModule = () =>
  Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Patient, MedicalRecord],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy()
      }),
      AuthModule,
      UsersModule,
      PatientsModule,
      RecordsModule
    ]
  });

describe('App E2E', () => {
  let app: INestApplication;
  let patientRepository: Repository<Patient>;

  beforeAll(async () => {
    const moduleRef = await buildTestingModule().compile();
    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    await app.init();

    const usersService = moduleRef.get(UsersService);
    const patientsService = moduleRef.get(PatientsService);
    patientRepository = moduleRef.get(getRepositoryToken(Patient));

    await usersService.create({
      name: 'Dr. Test',
      email: 'doctor@test.com',
      role: USER_ROLES.MEDICO,
      passwordHash: await bcrypt.hash('Password#1', 10)
    });

    await patientsService.create({
      fullName: 'Paciente Demo',
      birthDate: '1995-05-05',
      documentId: '44422211100',
      rg: 'RG999',
      gender: 'Feminino',
      maritalStatus: 'Solteira',
      profession: 'Advogada',
      phone: undefined,
      whatsapp: undefined,
      email: undefined,
      addressJson: {
        street: 'Rua A',
        number: '50',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000'
      },
      emergencyContact: undefined
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('authenticates doctor and enforces RBAC on deletion', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'doctor@test.com', password: 'Password#1' })
      .expect(201);

    const token = loginResponse.body.tokens.accessToken;

    const listResponse = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listResponse.body.items)).toBe(true);

    const patient = await patientRepository.findOne({
      where: { documentId: '44422211100' }
    });

    expect(patient).toBeTruthy();

    await request(app.getHttpServer())
      .delete(`/patients/${patient!.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
