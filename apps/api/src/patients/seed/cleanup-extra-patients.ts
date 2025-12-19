import appDataSource from '../../database/data-source';

async function run() {
  await appDataSource.initialize();
  const qr = appDataSource.createQueryRunner();
  const keepDocs = [
    '12345678901','23456789012','34567890123','45678901234','56789012345',
    '67890123456','78901234567','89012345678','90123456789','01234567890',
    '11122233344','22233344455','33344455566','44455566677','55566677788'
  ];

  // Find patient ids to remove
  const rows: Array<{ id: string }>= await appDataSource.query(
    `SELECT id FROM patients WHERE document_id NOT IN (${keepDocs.map((_,i)=>'$'+(i+1)).join(',')})`,
    keepDocs
  );
  const ids = rows.map(r => r.id);
  if (!ids.length) { console.log('No extra patients to delete.'); await appDataSource.destroy(); return; }
  console.log('Deleting patients:', ids.length);

  async function tableExists(name: string) {
    const res = await qr.query(`SELECT to_regclass($1) as t`, [name]);
    return res?.[0]?.t != null;
  }
  const tables = ['appointments','consultations','prescriptions','allergies','medical_records'];
  for (const t of tables) {
    try {
      const exists = await tableExists(`public.${t}`);
      if (!exists) continue;
      await qr.query(`DELETE FROM ${t} WHERE patient_id = ANY($1)`, [ids]);
    } catch (e) {
      console.log('Skip table', t, e?.message);
    }
  }

  // Finally delete patients not in the keep list
  await qr.query(`DELETE FROM patients WHERE id = ANY($1)`, [ids]);

  await appDataSource.destroy();
  console.log('Cleanup completed.');
}

run().catch((e) => { console.error(e); process.exit(1); });
