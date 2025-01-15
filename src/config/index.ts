import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  // server env
  node_env: process.env.NODE_ENV,
  server_port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  // jwt env
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expiresin: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expiresin: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,

  // gmail info
  gmail_app_user: process.env.GMAIL_APP_USER,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,

  // referral point
  referral_point: process.env.REFERRAL_POINT,

  // popular service document count
  popular_service_document_count: process.env.POPULAR_SERVICE_DOCUMENT_COUNT
};
