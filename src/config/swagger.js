const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Edunext API",
      version: "1.0.0",
      description: "EduNext - Next-Generation Learning Management System",
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
      {
        name: "User",
        description: "User management APIs",
      },
      {
        name: "Admin Panel",
        description: "Global Setting",
      },
    ],

    servers: [
      {
        url: "https://edunext-api-docker.onrender.com",
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
        UserCreateRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: { type: "string", example: "12345678" },
            phoneNumber: { type: "string", example: "09120000000" },
            gender: {
              type: "string",
              enum: ["male", "female", "other"],
              example: "male",
            },
            birthday: { type: "string", format: "date", example: "1995-01-01" },
            about: { type: "string", example: "About me" },
            profileImage: { type: "string", example: "https://..." },
          },
        },

        UserUpdateRequest: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe Updated" },
            email: {
              type: "string",
              format: "email",
              example: "john.updated@example.com",
            },
            password: { type: "string", example: "newpassword123" },
            phoneNumber: { type: "string", example: "09120000001" },
            gender: {
              type: "string",
              enum: ["male", "female", "other"],
              example: "other",
            },
            birthday: { type: "string", format: "date", example: "1996-02-02" },
            about: { type: "string", example: "Updated about me" },
            profileImage: { type: "string", example: "https://..." },
          },
        },

        RoleRequest: {
          type: "object",
          required: ["role"],
          properties: {
            role: {
              type: "string",
              enum: ["user", "admin", "moderator", "teacher", "superadmin"],
              example: "teacher",
            },
          },
        },

        UserData: {
          type: "object",
          properties: {
            id: { type: "string", example: "665f1b2e9c..." },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            phoneNumber: { type: "string", example: "09120000000" },
            gender: { type: "string", example: "male" },
            birthday: { type: "string", format: "date" },
            about: { type: "string", example: "About me" },
            profileImage: { type: "string", example: "https://..." },
            role: {
              type: "array",
              items: { type: "string" },
              example: ["user"],
            },
            isVerified: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        UserListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            count: { type: "integer", example: 10 },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/UserData" },
            },
          },
        },

        UserResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/UserData" },
          },
        },

        SimpleSuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"],
};

module.exports = swaggerJsdoc(options);
