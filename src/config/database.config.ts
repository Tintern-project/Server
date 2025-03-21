import * as dotenv from 'dotenv';

dotenv.config();

export const DatabaseConfig = {
  uri: 'mongodb://localhost:27017/nestdb',
  options: {
    dbName: 'nestdb', 
  },
};
