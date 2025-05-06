import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

// Use SQLite in-memory database instead of PostgreSQL
// This will work without requiring any external database setup
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Set to console.log to see SQL queries
  dialect: 'sqlite',
  storage: ':memory:',
  define: {
    freezeTableName: true,
    timestamps: true, 
    underscored: true,
  }
});

console.log('Using SQLite in-memory database instead of PostgreSQL');

const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

export { sequelize, User, Ticket };
