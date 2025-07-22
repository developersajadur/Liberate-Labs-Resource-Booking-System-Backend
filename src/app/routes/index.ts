import { Router } from 'express';
import { bookingRoutes } from '../modules/Booking/booking.route';
import { resourceRoutes } from '../modules/Resource/resource.route';



const router = Router();

const moduleRoutes = [
  {
    path: '/',
    route: bookingRoutes,
  },
  {
    path: '/',
    route: resourceRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
