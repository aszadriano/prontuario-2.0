import 'dotenv/config';
import appDataSource from '../../database/data-source';
import { Patient } from '../entities/patient.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { PrescriptionItem } from '../../prescriptions/entities/prescription-item.entity';
import { Medication } from '../../medications/entities/medication.entity';
import { User } from '../../users/entities/user.entity';

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

async function run() {
  await appDataSource.initialize();
  const patientRepo = appDataSource.getRepository(Patient);
  const consultRepo = appDataSource.getRepository(Consultation);
  const prescrRepo = appDataSource.getRepository(Prescription);
  const itemRepo = appDataSource.getRepository(PrescriptionItem);
  const medRepo = appDataSource.getRepository(Medication);
  const userRepo = appDataSource.getRepository(User);

  const keepDocs = [
    '12345678901','23456789012','34567890123','45678901234','56789012345',
    '67890123456','78901234567','89012345678','90123456789','01234567890',
    '11122233344','22233344455','33344455566','44455566677','55566677788'
  ];

  const meds = await medRepo.find({ take: 5 });
  if (meds.length === 0) {
    console.warn('No medications found; run main seed first');
  }
  const doctor = await userRepo.findOne({ where: { email: 'medico@demo.com' } });
  if (!doctor) {
    console.warn('No doctor user found; using ADMIN/first user as doctor');
  }

  const patients = await patientRepo.find({ where: keepDocs.map(d => ({ documentId: d })) as any });
  for (const p of patients) {
    // Skip if already has consultations
    const existingCons = await consultRepo.count({ where: { patientId: p.id } as any });
    if (existingCons === 0) {
      // Create two consultations in the last 60 days
      for (const delta of [45, 15]) {
        const start = daysAgo(delta);
        start.setHours(10, 0, 0, 0);
        const end = new Date(start.getTime() + 30 * 60000);
        const c = consultRepo.create({
          patientId: p.id,
          doctorId: doctor?.id || p.id, // fallback id just to satisfy schema
          schemaId: '00000000-0000-0000-0000-000000000001',
          startTime: start,
          endTime: end,
          durationMinutes: 30,
          notes: { summary: 'Consulta de rotina', tags: ['seed'] },
          summary: `Consulta - ${p.fullName}`,
        } as any);
        await consultRepo.save(c);
      }
    }

    // Skip if already has prescriptions
    const existingRx = await prescrRepo.count({ where: { patientId: p.id } as any });
    if (existingRx === 0) {
      // Create one completed prescription ~30 days ago with 2 items
      const rxEntity = prescrRepo.create({
        patientId: p.id,
        status: 'completed',
        notes: 'Prescrição gerada via seed',
      } as any);
      const rxSaved = await prescrRepo.save(rxEntity as any);
      for (let i = 0; i < Math.min(2, meds.length); i++) {
        const m = meds[i];
        const item = itemRepo.create({
          prescriptionId: (rxSaved as any).id,
          medicationId: m.id,
          dosage: '1 comp.',
          frequency: '8/8h',
          duration: '5 dias',
          instructions: 'Após as refeições',
          quantity: 10,
        });
        await itemRepo.save(item);
      }
    }
    console.log('Seeded history for:', p.fullName);
  }

  await appDataSource.destroy();
}

run().catch((e) => { console.error(e); process.exit(1); });
