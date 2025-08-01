import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  salt_rounds: process.env.SALT_ROUNDS,
  jwt_token_secret: process.env.JWT_TOKEN_SECRET,
  jwt_token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN,
  default_admin_email: process.env.DEFAULT_ADMIN_EMAIL,
  default_admin_phone: process.env.DEFAULT_ADMIN_PHONE,
  default_admin_password: process.env.DEFAULT_ADMIN_PASSWORD,
};
