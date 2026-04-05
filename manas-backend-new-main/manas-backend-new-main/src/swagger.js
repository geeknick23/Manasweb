const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Manas API',
            version: '1.0.0',
            description: 'API documentation for Manas Foundation Backend',
            contact: {
                name: 'Manas Foundation',
                email: 'manasfoundation2025@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://manas-backend-new-f7vf.vercel.app',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        name: { type: 'string' },
                        phone: { type: 'string' },
                        gender: { type: 'string', enum: ['male', 'female', 'other'] },
                        dateOfBirth: { type: 'string', format: 'date' },
                        profilePicture: { type: 'string' },
                        isVerified: { type: 'boolean' }
                    }
                },
                ImpactCard: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        imageUrl: { type: 'string' },
                        count: { type: 'number' }
                    }
                },
                AchievementCard: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        imageUrl: { type: 'string' },
                        date: { type: 'string', format: 'date' }
                    }
                },
                SuccessStory: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        imageUrl: { type: 'string' },
                        author: { type: 'string' }
                    }
                },
                MediaCard: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        mediaUrl: { type: 'string' },
                        type: { type: 'string', enum: ['image', 'video'] }
                    }
                },
                Event: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        location: { type: 'string' },
                        imageUrl: { type: 'string' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        error: { type: 'string' }
                    }
                }
            }
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User management endpoints' },
            { name: 'Admin', description: 'Admin panel endpoints' },
            { name: 'Volunteer', description: 'Volunteer registration endpoints' },
            { name: 'Public', description: 'Public content endpoints' }
        ],
        paths: {
            // Auth routes
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password', 'name', 'phone'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', minLength: 6, example: 'password123' },
                                        name: { type: 'string', example: 'John Doe' },
                                        phone: { type: 'string', example: '+911234567890' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'User registered successfully, OTP sent' },
                        '400': { description: 'Validation error' },
                        '409': { description: 'User already exists' }
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', example: 'password123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Login successful, returns JWT token' },
                        '401': { description: 'Invalid credentials' }
                    }
                }
            },
            '/api/auth/verify-otp': {
                post: {
                    tags: ['Auth'],
                    summary: 'Verify OTP',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'otp'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        otp: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'OTP verified successfully' },
                        '400': { description: 'Invalid or expired OTP' }
                    }
                }
            },
            '/api/auth/resend-otp': {
                post: {
                    tags: ['Auth'],
                    summary: 'Resend OTP',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'OTP resent successfully' },
                        '404': { description: 'User not found' }
                    }
                }
            },

            // User routes
            '/api/users/profile': {
                get: {
                    tags: ['Users'],
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        '401': { description: 'Unauthorized' }
                    }
                },
                put: {
                    tags: ['Users'],
                    summary: 'Update current user profile',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        phone: { type: 'string' },
                                        gender: { type: 'string' },
                                        dateOfBirth: { type: 'string', format: 'date' },
                                        bio: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Profile updated' },
                        '401': { description: 'Unauthorized' }
                    }
                }
            },
            '/api/users/profiles': {
                get: {
                    tags: ['Users'],
                    summary: 'Get all user profiles',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'List of user profiles' },
                        '401': { description: 'Unauthorized' }
                    }
                }
            },
            '/api/users/profile/{id}': {
                get: {
                    tags: ['Users'],
                    summary: 'Get user profile by ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: {
                        '200': { description: 'User profile' },
                        '404': { description: 'User not found' }
                    }
                }
            },
            '/api/users/express-interest': {
                post: {
                    tags: ['Users'],
                    summary: 'Express interest in a user',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['targetUserId'],
                                    properties: {
                                        targetUserId: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Interest expressed' },
                        '401': { description: 'Unauthorized' }
                    }
                }
            },
            '/api/users/accept-interest': {
                post: {
                    tags: ['Users'],
                    summary: 'Accept interest from a user',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['requestId'],
                                    properties: {
                                        requestId: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Interest accepted' }
                    }
                }
            },
            '/api/users/reject-interest': {
                post: {
                    tags: ['Users'],
                    summary: 'Reject interest from a user',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['requestId'],
                                    properties: {
                                        requestId: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Interest rejected' }
                    }
                }
            },

            // Public content routes
            '/api/users/impact-cards': {
                get: {
                    tags: ['Public'],
                    summary: 'Get all impact cards',
                    responses: {
                        '200': { description: 'List of impact cards' }
                    }
                }
            },
            '/api/users/achievement-cards': {
                get: {
                    tags: ['Public'],
                    summary: 'Get all achievement cards',
                    responses: {
                        '200': { description: 'List of achievement cards' }
                    }
                }
            },
            '/api/users/success-stories': {
                get: {
                    tags: ['Public'],
                    summary: 'Get all success stories',
                    responses: {
                        '200': { description: 'List of success stories' }
                    }
                }
            },
            '/api/users/media-cards': {
                get: {
                    tags: ['Public'],
                    summary: 'Get all media cards',
                    responses: {
                        '200': { description: 'List of media cards' }
                    }
                }
            },
            '/api/users/events': {
                get: {
                    tags: ['Public'],
                    summary: 'Get all events',
                    responses: {
                        '200': { description: 'List of events' }
                    }
                }
            },
            '/api/users/contact': {
                post: {
                    tags: ['Public'],
                    summary: 'Submit contact form',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'message'],
                                    properties: {
                                        name: { type: 'string' },
                                        email: { type: 'string', format: 'email' },
                                        phone: { type: 'string' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Contact form submitted' }
                    }
                }
            },

            // Admin routes
            '/api/admin/send-otp': {
                post: {
                    tags: ['Admin'],
                    summary: 'Send admin OTP',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'OTP sent' }
                    }
                }
            },
            '/api/admin/verify-otp': {
                post: {
                    tags: ['Admin'],
                    summary: 'Verify admin OTP',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'otp'],
                                    properties: {
                                        email: { type: 'string', format: 'email' },
                                        otp: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '200': { description: 'Admin authenticated, returns JWT' }
                    }
                }
            },
            '/api/admin/users': {
                get: {
                    tags: ['Admin'],
                    summary: 'Get all users (Admin)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'List of all users' }
                    }
                }
            },
            '/api/admin/users/{id}': {
                get: {
                    tags: ['Admin'],
                    summary: 'Get user by ID (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { '200': { description: 'User details' } }
                },
                put: {
                    tags: ['Admin'],
                    summary: 'Update user (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
                    responses: { '200': { description: 'User updated' } }
                },
                delete: {
                    tags: ['Admin'],
                    summary: 'Delete user (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { '200': { description: 'User deleted' } }
                }
            },
            '/api/admin/impact-cards': {
                get: { tags: ['Admin'], summary: 'Get all impact cards (Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List of impact cards' } } },
                post: { tags: ['Admin'], summary: 'Create impact card', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ImpactCard' } } } }, responses: { '201': { description: 'Card created' } } }
            },
            '/api/admin/impact-cards/{id}': {
                put: { tags: ['Admin'], summary: 'Update impact card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Card updated' } } },
                delete: { tags: ['Admin'], summary: 'Delete impact card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Card deleted' } } }
            },
            '/api/admin/achievement-cards': {
                get: { tags: ['Admin'], summary: 'Get all achievement cards (Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List' } } },
                post: { tags: ['Admin'], summary: 'Create achievement card', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AchievementCard' } } } }, responses: { '201': { description: 'Created' } } }
            },
            '/api/admin/achievement-cards/{id}': {
                put: { tags: ['Admin'], summary: 'Update achievement card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated' } } },
                delete: { tags: ['Admin'], summary: 'Delete achievement card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } }
            },
            '/api/admin/success-stories': {
                get: { tags: ['Admin'], summary: 'Get all success stories (Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List' } } },
                post: { tags: ['Admin'], summary: 'Create success story', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessStory' } } } }, responses: { '201': { description: 'Created' } } }
            },
            '/api/admin/success-stories/{id}': {
                put: { tags: ['Admin'], summary: 'Update success story', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated' } } },
                delete: { tags: ['Admin'], summary: 'Delete success story', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } }
            },
            '/api/admin/media-cards': {
                get: { tags: ['Admin'], summary: 'Get all media cards (Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List' } } },
                post: { tags: ['Admin'], summary: 'Create media card', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MediaCard' } } } }, responses: { '201': { description: 'Created' } } }
            },
            '/api/admin/media-cards/{id}': {
                put: { tags: ['Admin'], summary: 'Update media card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated' } } },
                delete: { tags: ['Admin'], summary: 'Delete media card', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } }
            },
            '/api/admin/events': {
                get: { tags: ['Admin'], summary: 'Get all events (Admin)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List' } } },
                post: { tags: ['Admin'], summary: 'Create event', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } } }, responses: { '201': { description: 'Created' } } }
            },
            '/api/admin/events/{id}': {
                put: { tags: ['Admin'], summary: 'Update event', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated' } } },
                delete: { tags: ['Admin'], summary: 'Delete event', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } }
            },
            '/api/admin/admin-users': {
                get: { tags: ['Admin'], summary: 'Get all admin users', security: [{ bearerAuth: [] }], responses: { '200': { description: 'List' } } },
                post: { tags: ['Admin'], summary: 'Create admin user', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, name: { type: 'string' } } } } } }, responses: { '201': { description: 'Created' } } }
            },

            // Volunteer routes
            '/api/volunteer': {
                post: {
                    tags: ['Volunteer'],
                    summary: 'Register as volunteer',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'phone'],
                                    properties: {
                                        name: { type: 'string' },
                                        email: { type: 'string', format: 'email' },
                                        phone: { type: 'string' },
                                        message: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        '201': { description: 'Volunteer registered' }
                    }
                },
                get: {
                    tags: ['Volunteer'],
                    summary: 'Get all volunteers (Admin)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'List of volunteers' }
                    }
                }
            }
        }
    },
    apis: [] // We're defining paths inline
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Manas API Documentation'
    }));

    // Also serve the raw JSON spec
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

module.exports = { setupSwagger, specs };
