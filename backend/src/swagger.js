const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VoteHub API | Premium Governance & eAuction Suite',
      version: '1.0.0',
      description: 'The official API documentation for VoteHub. This interactive suite provides a comprehensive guide to our secure voting, eAuction, and drafting infrastructure.',
      contact: {
        name: 'VoteHub Support',
        url: 'https://votehub.com/support',
        email: 'dev@votehub.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
          },
        },
        Poll: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            isActive: { type: 'boolean' },
            endsAt: { type: 'string', format: 'date-time' },
          },
        },
        Draft: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            candidates: { type: 'array', items: { type: 'string' } },
            endsAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/routes/*.js', './src/index.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
