import appDataSource from '../database/data-source';

async function run() {
  await appDataSource.initialize();
  await appDataSource.runMigrations();
  await appDataSource.destroy();
}

if (require.main === module) {
  run()
    .then(() => {
      console.log('Migrations executed successfully');
    })
    .catch((error) => {
      console.error('Failed to run migrations', error);
      process.exit(1);
    });
}
