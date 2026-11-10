import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Clínica Salud Integral',
        description: 'Modulos de Recepción, Medico y Gerencia',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }
};

const outputFile = './swagger_output.json';
const routes = ['./src/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);