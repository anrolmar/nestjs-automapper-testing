import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
  PORT: parseInt(process.env.APP_PORT, 10) || 3000,
  NAME: process.env.APP_NAME
}));
