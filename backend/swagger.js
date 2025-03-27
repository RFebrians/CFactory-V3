// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catering APP",
      version: "1.0.0",
    },
  },
  apis: ["src/routes/*.ts", "src/controllers/*.ts"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
