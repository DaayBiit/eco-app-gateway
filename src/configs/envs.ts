import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  GW_PORT: number;
  NATS_SERVER: string,
}

const envsSchema = joi
  .object({
    GW_PORT: joi.number().required(),
    NATS_SERVER: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = { 
  gwPort: envVars.GW_PORT,
  natsServer: envVars.NATS_SERVER,
}