import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default {
  test: {
    environments: 'node',
    globals: true,
    include: ['src/**/*.test.js'],
  },
};
