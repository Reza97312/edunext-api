const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Edunext API",
      version: "1.0.0",
      description: "Authentication & Authorization API",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication & Authorization APIs",
      },
      {
        name: "Course",
        description: "Course management APIs",
      },
    ],

    servers: [
      {
        url: "http://localhost:5050/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@test.com",
            },
            password: { type: "string", example: "123456" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "rezakazemi1384@yahoo.com",
            },
            password: { type: "string", example: "Reza9734" },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "password"],
          properties: {
            token: { type: "string" },
            password: { type: "string", example: "newpassword123" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation error" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: {
                    type: "string",
                    example: "Email is required",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"],
};

module.exports = swaggerJsdoc(options);
