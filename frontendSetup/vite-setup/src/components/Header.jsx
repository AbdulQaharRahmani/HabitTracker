import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home </Link>
        <Link to="/about">About </Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}
