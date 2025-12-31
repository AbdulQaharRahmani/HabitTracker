import { param } from 'express-validator';

// MongoDb ID validator => /habits/:id
export const IdValidator = [param('id').isMongoId().withMessage('Invalid ID')];
