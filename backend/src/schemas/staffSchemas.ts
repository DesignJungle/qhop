import Joi from 'joi';

export const staffSchemas = {
  createStaff: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'any.required': 'Phone number is required'
      }),
    role: Joi.string()
      .valid('OWNER', 'MANAGER', 'STAFF')
      .required()
      .messages({
        'any.only': 'Role must be one of: OWNER, MANAGER, STAFF',
        'any.required': 'Role is required'
      }),
    permissions: Joi.object()
      .pattern(
        Joi.string(),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.base': 'Permissions must be an object'
      }),
    schedule: Joi.object({
      monday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      tuesday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      wednesday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      thursday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      friday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      saturday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      sunday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional()
    }).optional()
  }),

  updateStaff: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    role: Joi.string()
      .valid('OWNER', 'MANAGER', 'STAFF')
      .optional()
      .messages({
        'any.only': 'Role must be one of: OWNER, MANAGER, STAFF'
      }),
    permissions: Joi.object()
      .pattern(
        Joi.string(),
        Joi.boolean()
      )
      .optional()
      .messages({
        'object.base': 'Permissions must be an object'
      }),
    schedule: Joi.object().optional(),
    isActive: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Is active must be true or false'
      })
  }),

  updateSchedule: Joi.object({
    schedule: Joi.object({
      monday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      tuesday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      wednesday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      thursday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      friday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      saturday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional(),
      sunday: Joi.object({
        isWorking: Joi.boolean().required(),
        startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isWorking', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        breaks: Joi.array().items(
          Joi.object({
            startTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            endTime: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
            description: Joi.string().max(100).optional()
          })
        ).optional()
      }).optional()
    }).required()
  }),

  performanceQuery: Joi.object({
    period: Joi.string()
      .valid('7d', '30d', '90d', '1y')
      .default('30d')
      .messages({
        'any.only': 'Period must be one of: 7d, 30d, 90d, 1y'
      }),
    metrics: Joi.array()
      .items(
        Joi.string().valid(
          'customers_served',
          'avg_service_time',
          'satisfaction',
          'punctuality',
          'efficiency',
          'hours_worked',
          'overtime',
          'absences'
        )
      )
      .default(['customers_served', 'avg_service_time', 'satisfaction'])
      .messages({
        'array.base': 'Metrics must be an array',
        'any.only': 'Invalid metric type'
      })
  })
};
