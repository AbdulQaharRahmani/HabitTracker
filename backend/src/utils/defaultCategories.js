import { v4 as uuidv4 } from 'uuid';

const defaultCategories = [
  { name: 'sport', icon: 'sport', backgroundColor: '#ed6f07' },
  { name: 'health', icon: 'health', backgroundColor: '#82ed18' },
  { name: 'study', icon: 'study', backgroundColor: '#169ef2' },
  { name: 'work', icon: 'work', backgroundColor: '#ed8907' },
];

export function getDefaultCategories(userId) {
  if (!userId) return null;

  const categories = [];

  defaultCategories.forEach((category) => {
    categories.push({ ...category, userId, clientId: uuidv4() });
  });

  return categories;
}
