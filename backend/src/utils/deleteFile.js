import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), '/src', filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};
// process.cwd() -->  D:\HabitTracker\backend
// filePath -->  "/uploads/profile/6958094d482346b295179588-1767383863766.jpg"
