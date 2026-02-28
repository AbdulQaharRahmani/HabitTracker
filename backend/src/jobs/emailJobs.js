import { backoffStrategies } from 'agenda';
import { sendEmail } from '../utils/email.js';

export const defineResetPasswordEmailJobs = async (agenda) => {
  agenda.define(
    'send-reset-password-email',
    async (job) => {
      const { email, username, resetUrl } = job.attrs.data;

      try {
        await sendEmail({
          to: email,
          subject: 'Reset password requested',
          username: username,
          resetUrl: resetUrl,
        });
      } catch (error) {
        throw error;
      }
    },
    {
      backoff: backoffStrategies.exponential({
        delay: 1000,
        maxRetries: 4,
        factor: 2,
        jitter: 0.2,
      }),
      priority: 10,
      concurrency: 5,
      lockLimit: 5,
      lockDuration: 30000,
      removeOnComplete: true,
    }
  );
};
