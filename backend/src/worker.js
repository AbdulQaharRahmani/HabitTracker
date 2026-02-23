import 'dotenv/config';
import { agenda } from './config/agenda.js';
import { defineResetPasswordEmailJobs } from './jobs/emailJobs.js';

async function startWorker() {
  //Initial Jobs
  await defineResetPasswordEmailJobs(agenda);

  agenda.on('retry', (job, details) => {
    console.log(`Job ${job.attrs.name} retry # ${details.attempt}`);
    console.log(`Next run ${details.nextRunAt}`);
    console.log(`Delay ${details.delay}`);
    console.log(`Error ${details.error.message}`);
  });

  agenda.on('success:send-reset-password-email', (job) => {
    const { email } = job.attrs.data;
    const startTime = job.attrs.lastRunAt;
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2); //change milliseconds to seconds

    console.log(`Job ${job.attrs.name} finished in ${duration} seconds.`);
    console.log(`Email send successfull to: ${email}`);
  });

  //Start worker
  await agenda.start();
  console.log('Worker is running...');

  //Ensure when process receives a stop signal, agenda finish any running jobs graceful before process exits
  const graceful = async () => {
    console.log('Stopping worker...');
    await agenda.stop();
    process.exit(0);
  };

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful); // for teminal (Ctrl+c)
}

startWorker().catch((err) => {
  console.error('Failed to start worker:', err);
});
