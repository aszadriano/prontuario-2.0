import { promises as fs } from 'fs';
import { join } from 'path';

const toPascalCase = (value: string) =>
  value
    .replace(/(^|[-_\s])(\w)/g, (_, __, c) => c.toUpperCase())
    .replace(/[^A-Za-z0-9]/g, '');

async function run() {
  const [, , rawName] = process.argv;
  if (!rawName) {
    console.error('⚠️  Please provide a migration name. Example: npm run db:generate -- create-users-table');
    process.exit(1);
  }

  const timestamp = Date.now();
  const className = `${toPascalCase(rawName)}${timestamp}`;
  const fileName = `${timestamp}-${rawName.replace(/\s+/g, '-').toLowerCase()}.ts`;

  const template = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
  name = '${className}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: implement migration logic
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: revert migration changes
  }
}
`;

  const targetPath = join(__dirname, fileName);
  await fs.writeFile(targetPath, template, { encoding: 'utf8' });
  console.log(`✅ Migration scaffold created at ${targetPath}`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
