import { registerAs } from '@nestjs/config';

export default registerAs('integration', () => ({
  PDF_CONSUMER: process.env.PDF_CONSUMER_URL
}));
