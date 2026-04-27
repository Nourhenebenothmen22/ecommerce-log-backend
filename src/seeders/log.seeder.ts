import { logService, LogLevel } from '../services/log.service.js';
import { faker } from '@faker-js/faker';

export class LogSeeder {
  async seed() {
    console.log('Starting Log Seeding...');

    // Generate Apache Logs
    for (let i = 0; i < 20; i++) {
      const ip = faker.internet.ip();
      const methods = ['GET', 'POST', 'PUT', 'DELETE'];
      const method = faker.helpers.arrayElement(methods);
      const urls = ['/api/products', '/api/orders', '/api/auth/login', '/api/cart', '/api/categories'];
      const url = faker.helpers.arrayElement(urls);
      const codes = [200, 201, 204, 400, 401, 403, 404, 500];
      const code = faker.helpers.arrayElement(codes);
      const ua = faker.internet.userAgent();
      const responseTime = faker.number.int({ min: 10, max: 500 });
      
      logService.logApache(ip, method, url, code, ua, responseTime);
    }

    // Generate App Logs for miscellaneous actions
    const appActions = [
      { action: 'ajout panier', details: 'product_id=' + faker.string.uuid() + ' quantity=1' },
      { action: 'suppression panier', details: 'product_id=' + faker.string.uuid() },
      { action: 'deconnexion utilisateur', details: '' },
      { action: 'mise a jour profil', details: 'field=email' },
      { action: 'annulation commande', details: 'order_id=' + faker.string.uuid() },
    ];

    for (let i = 0; i < 10; i++) {
      const act = faker.helpers.arrayElement(appActions);
      logService.logApp(LogLevel.INFO, act.action, 'success', faker.string.uuid(), act.details);
    }

    console.log('Log Seeding Completed!');
  }
}

export const logSeeder = new LogSeeder();
