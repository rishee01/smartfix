const { initDb, seedData } = require('./models');

(async () => {
  try {
    await initDb();
    await seedData();
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
})();
