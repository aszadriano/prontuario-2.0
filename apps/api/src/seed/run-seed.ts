import appDataSource from '../database/data-source';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { MedicalRecord } from '../records/entities/medical-record.entity';
import { Medication } from '../medications/entities/medication.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { PrescriptionItem } from '../prescriptions/entities/prescription-item.entity';
import { USER_ROLES } from '@prontuario/shared';
import * as bcrypt from 'bcrypt';

async function seedUsers() {
  const userRepository = appDataSource.getRepository(User);

  const seeds = [
    {
      name: 'Administrador Demo',
      email: 'admin@demo.com',
      role: USER_ROLES.ADMIN,
      password: 'Admin#2024!'
    },
    {
      name: 'Dra. Ana Demo',
      email: 'medico@demo.com',
      role: USER_ROLES.MEDICO,
      password: 'Medico#2024!'
    },
    {
      name: 'Secretária Demo',
      email: 'secretaria@demo.com',
      role: USER_ROLES.SECRETARIA,
      password: 'Secretaria#2024!'
    }
  ];

  for (const seed of seeds) {
    const existing = await userRepository.findOne({ where: { email: seed.email } });
    if (existing) {
      continue;
    }

    const passwordHash = await bcrypt.hash(seed.password, 10);
    const user = userRepository.create({
      name: seed.name,
      email: seed.email,
      role: seed.role,
      passwordHash
    });
    await userRepository.save(user);
  }
}

async function seedPatients() {
  const patientRepository = appDataSource.getRepository(Patient);

  const seeds: Array<Partial<Patient>> = [
    {
      fullName: 'João da Silva',
      birthDate: '1985-04-10',
      documentId: '12345678900',
      rg: '221144557',
      gender: 'Masculino',
      maritalStatus: 'Casado',
      profession: 'Engenheiro',
      phone: '+55 11 99999-0000',
      whatsapp: '+55 11 99999-0000',
      email: 'joao.silva@example.com',
      addressJson: {
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      emergencyContact: {
        name: 'Maria da Silva',
        phone: '+55 11 90000-1234',
        relationship: 'Esposa'
      }
    },
    {
      fullName: 'Maria Souza',
      birthDate: '1990-09-15',
      documentId: '98765432100',
      rg: '998877665',
      gender: 'Feminino',
      maritalStatus: 'Solteira',
      profession: 'Designer',
      phone: '+55 21 98888-1111',
      whatsapp: '+55 21 98888-1111',
      email: 'maria.souza@example.com',
      addressJson: {
        street: 'Rua das Flores',
        number: '200',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20000-000'
      },
      emergencyContact: {
        name: 'Carlos Souza',
        phone: '+55 21 97777-2222',
        relationship: 'Pai'
      }
    }
  ];

  for (const seed of seeds) {
    const existing = await patientRepository.findOne({
      where: { documentId: seed.documentId as string }
    });
    if (existing) {
      continue;
    }
    const patient = patientRepository.create(seed);
    await patientRepository.save(patient);
  }
}

async function seedMedicalRecord() {
  const recordRepository = appDataSource.getRepository(MedicalRecord);
  const patientRepository = appDataSource.getRepository(Patient);
  const userRepository = appDataSource.getRepository(User);

  const doctor = await userRepository.findOne({ where: { email: 'medico@demo.com' } });
  const patient = await patientRepository.findOne({
    where: { documentId: '12345678900' }
  });

  if (!doctor || !patient) {
    return;
  }

  const existing = await recordRepository.findOne({
    where: {
      doctor: { id: doctor.id },
      patient: { id: patient.id }
    }
  });

  if (existing) {
    return;
  }

  const record = recordRepository.create({
    doctor,
    patient,
    summary: 'Consulta inicial de avaliação geral',
    notes: {
      symptoms: ['Cansaço', 'Cefaleia recorrente'],
      observations: 'Paciente relata histórico familiar de hipertensão.'
    },
    tags: ['inicial', 'avaliação']
  });

  await recordRepository.save(record);
}

async function seedMedications() {
  const medicationRepository = appDataSource.getRepository(Medication);

  const seeds: Array<Partial<Medication>> = [
    {
      name: 'Paracetamol',
      genericName: 'acetaminofen',
      concentration: '500mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Ibuprofeno',
      genericName: 'ibuprofeno',
      concentration: '400mg',
      form: 'tablet',
      manufacturer: 'Eurofarma'
    },
    {
      name: 'Amoxicilina',
      genericName: 'amoxicilina',
      concentration: '500mg',
      form: 'capsule',
      manufacturer: 'EMS'
    },
    {
      name: 'Omeprazol',
      genericName: 'omeprazol',
      concentration: '20mg',
      form: 'capsule',
      manufacturer: 'EMS'
    },
    {
      name: 'Losartana',
      genericName: 'losartana potássica',
      concentration: '50mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Metformina',
      genericName: 'cloridrato de metformina',
      concentration: '500mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Dipirona',
      genericName: 'metamizol sódico',
      concentration: '500mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Cetirizina',
      genericName: 'cloridrato de cetirizina',
      concentration: '10mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Prednisolona',
      genericName: 'prednisolona',
      concentration: '5mg',
      form: 'tablet',
      manufacturer: 'EMS'
    },
    {
      name: 'Fluoxetina',
      genericName: 'cloridrato de fluoxetina',
      concentration: '20mg',
      form: 'capsule',
      manufacturer: 'EMS'
    }
  ];

  for (const seed of seeds) {
    const existing = await medicationRepository.findOne({
      where: { 
        name: seed.name,
        concentration: seed.concentration
      }
    });
    if (existing) {
      continue;
    }
    const medication = medicationRepository.create(seed);
    await medicationRepository.save(medication);
  }
}

async function seedAppointments() {
  const appointmentRepository = appDataSource.getRepository(Appointment);
  const patientRepository = appDataSource.getRepository(Patient);
  const userRepository = appDataSource.getRepository(User);

  const doctor = await userRepository.findOne({ where: { email: 'medico@demo.com' } });
  const patient = await patientRepository.findOne({
    where: { documentId: '12345678900' }
  });

  if (!doctor || !patient) {
    return;
  }

  const seeds = [
    {
      patientId: patient.id,
      doctorId: doctor.id,
      doctor,
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: 'scheduled' as const,
      notes: 'Consulta de retorno'
    },
    {
      patientId: patient.id,
      doctorId: doctor.id,
      doctor,
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      status: 'scheduled' as const,
      notes: 'Avaliação de exames'
    }
  ];

  for (const seed of seeds) {
    const existing = await appointmentRepository.findOne({
      where: {
        patientId: seed.patientId,
        doctorId: seed.doctorId,
        dateTime: seed.dateTime
      }
    });
    if (existing) {
      continue;
    }
    const appointment = appointmentRepository.create(seed);
    await appointmentRepository.save(appointment);
  }
}

async function seedPrescriptions() {
  const prescriptionRepository = appDataSource.getRepository(Prescription);
  const prescriptionItemRepository = appDataSource.getRepository(PrescriptionItem);
  const patientRepository = appDataSource.getRepository(Patient);
  const userRepository = appDataSource.getRepository(User);
  const medicationRepository = appDataSource.getRepository(Medication);

  const doctor = await userRepository.findOne({ where: { email: 'medico@demo.com' } });
  const patient = await patientRepository.findOne({
    where: { documentId: '12345678900' }
  });

  if (!doctor || !patient) {
    return;
  }

  // Get some medications for the prescription
  const paracetamol = await medicationRepository.findOne({ where: { name: 'Paracetamol' } });
  const amoxicilina = await medicationRepository.findOne({ where: { name: 'Amoxicilina' } });

  if (!paracetamol || !amoxicilina) {
    return;
  }

  const existing = await prescriptionRepository.findOne({
    where: {
      patientId: patient.id
    }
  });

  if (existing) {
    return;
  }

  const prescription = prescriptionRepository.create({
    patientId: patient.id,
    status: 'active',
    notes: 'Tratamento para infecção respiratória. Retornar em 7 dias para reavaliação.'
  });

  const savedPrescription = await prescriptionRepository.save(prescription);

  // Create prescription items
  const items = [
    {
      prescriptionId: savedPrescription.id,
      medicationId: paracetamol.id,
      dosage: '500mg',
      frequency: '3x/dia',
      duration: '7 dias',
      instructions: 'Tomar com água após as refeições',
      quantity: 21
    },
    {
      prescriptionId: savedPrescription.id,
      medicationId: amoxicilina.id,
      dosage: '500mg',
      frequency: '3x/dia',
      duration: '10 dias',
      instructions: 'Completar o tratamento conforme orientado',
      quantity: 30
    }
  ];

  for (const item of items) {
    const prescriptionItem = prescriptionItemRepository.create(item);
    await prescriptionItemRepository.save(prescriptionItem);
  }
}

async function runSeed() {
  await appDataSource.initialize();
  try {
    await seedUsers();
    await seedPatients();
    await seedMedicalRecord();
    await seedMedications();
    await seedAppointments();
    await seedPrescriptions();
  } finally {
    await appDataSource.destroy();
  }
}

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('✅ Seed completed successfully');
    })
    .catch((error) => {
      console.error('❌ Seed failed', error);
      process.exit(1);
    });
}
