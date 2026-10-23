import { createContext, useContext } from 'react';

/** `framed` = drawn inside a PhoneFrame (desktop). False on a real phone (full screen). */
export const PhoneContext = createContext({ framed: true });
export const usePhone = () => useContext(PhoneContext);
