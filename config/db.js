import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
 
dotenv.config();

let log;
let shouldSync;
let dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false, // Supabase requires this
  },
};

if (process.env.NODE_ENV === 'dev') {
  log = console.log;
  shouldSync = true;
} else if (process.env.NODE_ENV === 'prod') {
  log = false;
  shouldSync = false;
} else {
  throw new Error('NODE_ENV must be set to "dev" or "prod"');
}

// disable prepared statements for pooler
dialectOptions.options = '-c prepare_threshold=0';

const sequelize = new Sequelize(process.env.DB, {
  dialect: 'postgres',
  dialectModule: pg,
  protocol: 'postgres',
  dialectOptions,
  logging: log,
});

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log(`Database Connected Successfully.`);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    throw new Error('Database connection failed');
  }
}

export async function syncDB() {
  try {
    if (shouldSync) {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized in DEV (alter mode).');
    } else {
      console.log('Skipping sync in PROD.');
    }
  } catch (error) {
    console.error('Failed to synchronize database:', error.message);
    throw new Error('Database sync failed');
  }
}

export default sequelize;