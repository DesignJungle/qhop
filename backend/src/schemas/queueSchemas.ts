import Joi from 'joi';

export const queueSchemas = {
  joinQueue: Joi.object({
    businessId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid business ID format',
        'any.required': 'Business ID is required'
      }),
    queueId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid queue ID format',
        'any.required': 'Queue ID is required'
      }),
    serviceId: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'Invalid service ID format'
      })
  }),

  leaveQueue: Joi.object({
    ticketId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid ticket ID format',
        'any.required': 'Ticket ID is required'
      })
  }),

  callNext: Joi.object({
    queueId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid queue ID format',
        'any.required': 'Queue ID is required'
      })
  }),

  updateTicketStatus: Joi.object({
    ticketId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'Invalid ticket ID format',
        'any.required': 'Ticket ID is required'
      }),
    status: Joi.string()
      .valid('WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
      .required()
      .messages({
        'any.only': 'Invalid status. Must be one of: WAITING, CALLED, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW',
        'any.required': 'Status is required'
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 500 characters'
      })
  }),

  createQueue: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Queue name must be at least 2 characters',
        'string.max': 'Queue name cannot exceed 100 characters',
        'any.required': 'Queue name is required'
      }),
    maxSize: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .default(50)
      .messages({
        'number.base': 'Max size must be a number',
        'number.integer': 'Max size must be a whole number',
        'number.min': 'Max size must be at least 1',
        'number.max': 'Max size cannot exceed 1000'
      })
  }),

  updateQueue: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Queue name must be at least 2 characters',
        'string.max': 'Queue name cannot exceed 100 characters'
      }),
    maxSize: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .optional()
      .messages({
        'number.base': 'Max size must be a number',
        'number.integer': 'Max size must be a whole number',
        'number.min': 'Max size must be at least 1',
        'number.max': 'Max size cannot exceed 1000'
      }),
    isActive: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Active status must be true or false'
      }),
    status: Joi.string()
      .valid('OPEN', 'PAUSED', 'CLOSED')
      .optional()
      .messages({
        'any.only': 'Status must be one of: OPEN, PAUSED, CLOSED'
      })
  }),

  bulkUpdateTickets: Joi.object({
    ticketIds: Joi.array()
      .items(Joi.string().uuid())
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one ticket ID is required',
        'array.max': 'Cannot update more than 50 tickets at once',
        'any.required': 'Ticket IDs are required'
      }),
    status: Joi.string()
      .valid('WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
      .required()
      .messages({
        'any.only': 'Invalid status. Must be one of: WAITING, CALLED, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW',
        'any.required': 'Status is required'
      }),
    notes: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Notes cannot exceed 500 characters'
      })
  }),

  queueSettings: Joi.object({
    maxQueueSize: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .optional()
      .messages({
        'number.base': 'Max queue size must be a number',
        'number.integer': 'Max queue size must be a whole number',
        'number.min': 'Max queue size must be at least 1',
        'number.max': 'Max queue size cannot exceed 1000'
      }),
    avgServiceTime: Joi.number()
      .integer()
      .min(1)
      .max(480)
      .optional()
      .messages({
        'number.base': 'Average service time must be a number',
        'number.integer': 'Average service time must be a whole number',
        'number.min': 'Average service time must be at least 1 minute',
        'number.max': 'Average service time cannot exceed 480 minutes (8 hours)'
      }),
    allowWalkIns: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Allow walk-ins must be true or false'
      }),
    requireDeposit: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Require deposit must be true or false'
      }),
    depositAmount: Joi.number()
      .min(0)
      .max(10000)
      .optional()
      .messages({
        'number.base': 'Deposit amount must be a number',
        'number.min': 'Deposit amount cannot be negative',
        'number.max': 'Deposit amount cannot exceed 10,000'
      }),
    autoCallNext: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Auto call next must be true or false'
      }),
    sendNotifications: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Send notifications must be true or false'
      }),
    operatingHours: Joi.object()
      .pattern(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        Joi.object({
          open: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .optional()
            .messages({
              'string.pattern.base': 'Open time must be in HH:MM format'
            }),
          close: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .optional()
            .messages({
              'string.pattern.base': 'Close time must be in HH:MM format'
            }),
          isOpen: Joi.boolean()
            .required()
            .messages({
              'boolean.base': 'Is open must be true or false',
              'any.required': 'Is open status is required'
            })
        })
      )
      .optional(),
    breaks: Joi.array()
      .items(
        Joi.object({
          start: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .messages({
              'string.pattern.base': 'Break start time must be in HH:MM format',
              'any.required': 'Break start time is required'
            }),
          end: Joi.string()
            .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required()
            .messages({
              'string.pattern.base': 'Break end time must be in HH:MM format',
              'any.required': 'Break end time is required'
            }),
          description: Joi.string()
            .max(100)
            .required()
            .messages({
              'string.max': 'Break description cannot exceed 100 characters',
              'any.required': 'Break description is required'
            })
        })
      )
      .max(10)
      .optional()
      .messages({
        'array.max': 'Cannot have more than 10 breaks per day'
      })
  })
};
