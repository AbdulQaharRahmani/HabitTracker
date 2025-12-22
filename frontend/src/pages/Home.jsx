export default function Home() {
  return <h1>Welcome to the Home Page</h1>
}

// backend API config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);
