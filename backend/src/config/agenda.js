import { Agenda } from 'agenda';
import { MongoBackend } from '@agendajs/mongo-backend';

export const agenda = new Agenda({
  backend: new MongoBackend({
    address: process.env.MONGO_URI,
    collection: 'agendaJobs',
  }),
});
agenda.processEvery('5 seconds');
