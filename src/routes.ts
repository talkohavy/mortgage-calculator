import { lazy } from 'react';
import type { Route } from './common/types';

// Main pages
const HomePage = lazy(() => import('./pages/Home'));
const MortgageCalculatorPage = lazy(() => import('./pages/MortgageCalculator'));

export const routes: Array<Route> = [
  {
    to: 'home',
    text: 'Home',
    Component: HomePage,
  },
  {
    to: 'mortgage-calculator',
    text: 'Mortgage Calculator',
    Component: MortgageCalculatorPage,
  },
];
