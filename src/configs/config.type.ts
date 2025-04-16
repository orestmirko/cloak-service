export interface CONFIG_TYPES {
  APP: {
    PORT: number;
    CORS_ALLOWED_ORIGINS: string[];
  };
  DATABASE: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
  };
  REDIS: {
    HOST: string;
    PORT: number;
    TTL: number;
  };
}
