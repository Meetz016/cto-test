import dotenv from 'dotenv';

// Load environment variables from the .env file once at startup.
dotenv.config();

const parsePort = (): number => {
  const value = process.env.PORT ?? '3000';
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid PORT value provided: ${value}`);
  }

  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(),
};
