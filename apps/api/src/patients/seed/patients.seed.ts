import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { PatientsService } from '../patients.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const patients = app.get(PatientsService);

  const baseDocs = [
    '12345678901','23456789012','34567890123','45678901234','56789012345',
    '67890123456','78901234567','89012345678','90123456789','01234567890',
    '11122233344','22233344455','33344455566','44455566677','55566677788'
  ];
  const names = [
    'Ana Silva','Bruno Souza','Carla Pereira','Diego Santos','Eduarda Lima',
    'Felipe Alves','Gabriela Rocha','Henrique Costa','Isabela Martins','João Oliveira',
    'Karen Ribeiro','Lucas Fernandes','Mariana Araujo','Nicolas Teixeira','Otávio Mendes'
  ];
  const phones = [
    '11987654321','21987654321','31987654321','41987654321','51987654321',
    '61987654321','71987654321','81987654321','91987654321','11912345678',
    '21912345678','31912345678','41912345678','51912345678','61912345678'
  ];
  const births = [
    '1990-01-12','1985-05-23','1992-08-17','1988-03-09','1995-11-30',
    '1983-07-14','1991-02-28','1989-09-05','1993-12-21','1987-04-02',
    '1996-06-18','1984-10-26','1990-03-11','1992-01-29','1986-08-08'
  ];

  for (let i = 0; i < 15; i++) {
    try {
      await patients.create({
        fullName: names[i],
        birthDate: births[i],
        documentId: baseDocs[i],
        rg: `RG${i}`.padEnd(8, '0'),
        gender: i % 2 === 0 ? 'Feminino' : 'Masculino',
        maritalStatus: i % 3 === 0 ? 'Casado(a)' : 'Solteiro(a)',
        profession: 'Profissional de Saúde',
        phone: phones[i],
        whatsapp: phones[i],
        email: `${names[i].toLowerCase().replace(/[^a-z]/g,'')}@example.com`,
        addressJson: {
          street: `Rua Exemplo ${i + 1}`,
          number: `${100 + i}`,
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: `0100${i}-000`
        },
        emergencyContact: {
          name: `Contato ${names[i].split(' ')[0]}`,
          phone: `11${phones[i].slice(-8)}`,
          relationship: 'Família'
        }
      } as any);
      // eslint-disable-next-line no-console
      console.log(`Seeded: ${names[i]}`);
    } catch (e) {
      console.log('Seed skip/err:', names[i], e?.message);
    }
  }

  await app.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
