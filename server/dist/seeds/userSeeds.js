import { User } from '../models/user.js';
const seedUsers = async () => {
    try {
        // Clear existing users
        await User.destroy({ where: {} });
        // Create test users
        const users = [
            {
                username: 'testuser',
                password: 'password123'
            },
            {
                username: 'admin',
                password: 'admin123'
            }
        ];
        // Create users using the model to ensure passwords are hashed
        for (const userData of users) {
            const user = User.build(userData);
            await user.save();
        }
        console.log('Users seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding users:', error);
    }
};
export default seedUsers;
