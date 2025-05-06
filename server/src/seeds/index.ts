import { sequelize } from '../models/index.js';
import seedUsers from './userSeeds.js';

const seedAll = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    
    // Run seed operations
    await seedUsers();
    
    console.log('All seeds completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAll();
