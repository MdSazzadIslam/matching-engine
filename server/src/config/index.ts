export const config = {
  port: process.env.PORT || 8080,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
};
