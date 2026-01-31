import { createBrowserRouter } from 'react-router';
import Home from '@/app/pages/Home';
import CreditCardPreApproval from '@/app/pages/CreditCardPreApproval';
import Appointment from '@/app/pages/Appointment';
import FAQ from '@/app/pages/FAQ';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/credit-card',
    Component: CreditCardPreApproval,
  },
  {
    path: '/appointment',
    Component: Appointment,
  },
  {
    path: '/faq',
    Component: FAQ,
  },
]);

