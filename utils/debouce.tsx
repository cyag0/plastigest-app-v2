//make a debounce function to avoid multiple calls to the api with react

import { useEffect, useState } from "react";

export default function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
