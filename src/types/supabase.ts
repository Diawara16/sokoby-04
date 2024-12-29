import { AuthSchema } from './database/auth';
import { PublicSchema } from './database/public';

export interface Database {
  auth: AuthSchema;
  public: PublicSchema;
}