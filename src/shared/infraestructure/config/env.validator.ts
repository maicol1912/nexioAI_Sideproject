import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // == APP
  PORT: Joi.number().integer().positive().required(),
  TRANSPORT_PORT: Joi.number().integer().positive().required(),
  JWT_EXPIRATION_TIME: Joi.number().integer().positive().required(),
  FALLBACK_LANGUAGE: Joi.string().required(),
  ENABLE_ORM_LOGS: Joi.boolean().required(),
  ENABLE_DOCUMENTATION: Joi.boolean().required(),
  API_VERSION: Joi.string().pattern(/^v\d+\.\d+\.\d+$/).required(),

  // == JWT Auth
  JWT_PRIVATE_KEY: Joi.string().required(),
  JWT_PUBLIC_KEY: Joi.string().required(),

  // == DB
  DB_TYPE: Joi.string().valid('postgres', 'mysql', 'sqlite', 'mariadb').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().integer().positive().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // == AWS
  AWS_S3_ACCESS_KEY_ID: Joi.string().allow(''),
  AWS_S3_SECRET_ACCESS_KEY: Joi.string().allow(''),
  AWS_S3_BUCKET_REGION: Joi.string().required(),
  AWS_S3_API_VERSION: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),

  // == NATS
  NATS_ENABLED: Joi.boolean().required(),
  NATS_HOST: Joi.string().hostname().required(),
  NATS_PORT: Joi.number().integer().positive().required(),

  // == Redis
  REDIS_CACHE_ENABLED: Joi.boolean().required(),
  REDIS_HOST: Joi.string().hostname().required(),
  REDIS_PORT: Joi.number().integer().positive().required(),

  // == Throttler
  THROTTLER_TTL: Joi.string().required(),
  THROTTLER_LIMIT: Joi.number().integer().positive().required(),
}).unknown();

export function validateConfig(config: Record<string, unknown>) {
  const { error, value } = envSchema.validate(config, { abortEarly: false });

  if (error) {
    console.error(
      'Error en las variables de entorno:',
      error.details.map((x) => x.message).join(', ')
    );
    process.exit(1);
  }

  return value;
}
