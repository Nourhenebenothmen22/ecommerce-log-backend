import { logService, LogLevel } from '../services/log.service.js';
import { faker } from '@faker-js/faker';

export class LogSeeder {
  async seed() {
    console.log('Starting Log Seeding...');

    // Generate Apache Logs - Increased volume for Big Data (500 lines)
    for (let i = 0; i < 500; i++) {
      const ip = faker.internet.ip();
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
      const method = faker.helpers.arrayElement(methods);
      const urls = [
        '/api/products', '/api/products/' + faker.string.uuid(), 
        '/api/orders', '/api/orders/' + faker.string.uuid(),
        '/api/auth/login', '/api/auth/register', '/api/auth/logout',
        '/api/cart', '/api/cart/add', '/api/cart/remove',
        '/api/categories', '/api/inventory/stock', '/api/payments/verify',
        '/api/admin/dashboard', '/api/users/profile', '/api/reviews/submit',
        '/health', '/api/search?q=' + faker.commerce.productAdjective()
      ];
      const url = faker.helpers.arrayElement(urls);
      const codes = [200, 200, 200, 201, 204, 301, 302, 400, 401, 403, 404, 405, 429, 500, 502, 503];
      const code = faker.helpers.arrayElement(codes);
      const ua = faker.internet.userAgent();
      const responseTime = faker.number.int({ min: 5, max: 2000 });
      
      logService.logApache(ip, method, url, code, ua, responseTime);
    }

    // Generate App Logs for miscellaneous actions - Increased volume (200 lines)
    const appActions = [
      { action: 'ajout panier', details: 'product_id=' + faker.string.uuid() + ' quantity=' + faker.number.int({min:1, max:5}) },
      { action: 'suppression panier', details: 'product_id=' + faker.string.uuid() },
      { action: 'deconnexion utilisateur', details: '' },
      { action: 'mise a jour profil', details: 'field=' + faker.helpers.arrayElement(['email', 'address', 'phone', 'password']) },
      { action: 'annulation commande', details: 'order_id=' + faker.string.uuid() },
      { action: 'recherche produit', details: 'query="' + faker.commerce.product() + '"' },
      { action: 'consultation produit', details: 'product_id=' + faker.string.uuid() },
      { action: 'ajout avis', details: 'rating=' + faker.number.int({min:1, max:5}) },
      { action: 'application coupon', details: 'code="' + faker.string.alphanumeric(8).toUpperCase() + '"' },
      { action: 'erreur paiement', details: 'provider="stripe" error="card_declined"' }
    ];

    for (let i = 0; i < 200; i++) {
      const act = faker.helpers.arrayElement(appActions);
      const status = faker.helpers.arrayElement(['success', 'success', 'success', 'failed'] as const);
      logService.logApp(
        status === 'success' ? LogLevel.INFO : LogLevel.ERROR, 
        act.action, 
        status, 
        faker.string.uuid(), 
        act.details,
        status === 'failed' ? 'operation interrupted' : undefined
      );
    }

    console.log('Log Seeding Completed!');
  }
}

export const logSeeder = new LogSeeder();
