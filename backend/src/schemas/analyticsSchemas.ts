import Joi from 'joi';

export const analyticsSchemas = {
  dashboardQuery: Joi.object({
    period: Joi.string()
      .valid('1d', '7d', '30d', '90d', '1y')
      .default('7d')
      .messages({
        'any.only': 'Period must be one of: 1d, 7d, 30d, 90d, 1y'
      }),
    timezone: Joi.string()
      .optional()
      .messages({
        'string.base': 'Timezone must be a string'
      })
  }),

  revenueQuery: Joi.object({
    period: Joi.string()
      .valid('1d', '7d', '30d', '90d', '1y')
      .default('30d')
      .messages({
        'any.only': 'Period must be one of: 1d, 7d, 30d, 90d, 1y'
      }),
    groupBy: Joi.string()
      .valid('day', 'week', 'month')
      .default('day')
      .messages({
        'any.only': 'Group by must be one of: day, week, month'
      }),
    includeProjections: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Include projections must be true or false'
      })
  }),

  customerQuery: Joi.object({
    period: Joi.string()
      .valid('1d', '7d', '30d', '90d', '1y')
      .default('30d')
      .messages({
        'any.only': 'Period must be one of: 1d, 7d, 30d, 90d, 1y'
      }),
    segment: Joi.string()
      .valid('new', 'returning', 'all')
      .default('all')
      .messages({
        'any.only': 'Segment must be one of: new, returning, all'
      }),
    includeDetails: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Include details must be true or false'
      })
  }),

  performanceQuery: Joi.object({
    period: Joi.string()
      .valid('1d', '7d', '30d', '90d')
      .default('7d')
      .messages({
        'any.only': 'Period must be one of: 1d, 7d, 30d, 90d'
      }),
    metrics: Joi.array()
      .items(
        Joi.string().valid(
          'wait_time',
          'service_time',
          'throughput',
          'efficiency',
          'capacity',
          'satisfaction'
        )
      )
      .default(['wait_time', 'service_time', 'throughput'])
      .messages({
        'array.base': 'Metrics must be an array',
        'any.only': 'Invalid metric type'
      }),
    queueId: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'Queue ID must be a valid UUID'
      })
  }),

  exportRequest: Joi.object({
    format: Joi.string()
      .valid('csv', 'pdf', 'excel', 'json')
      .default('csv')
      .messages({
        'any.only': 'Format must be one of: csv, pdf, excel, json'
      }),
    period: Joi.string()
      .valid('1d', '7d', '30d', '90d', '1y')
      .default('30d')
      .messages({
        'any.only': 'Period must be one of: 1d, 7d, 30d, 90d, 1y'
      }),
    metrics: Joi.array()
      .items(
        Joi.string().valid(
          'overview',
          'revenue',
          'customers',
          'performance',
          'queues',
          'services',
          'staff',
          'reviews'
        )
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Metrics must be an array',
        'array.min': 'At least one metric must be selected',
        'any.required': 'Metrics are required',
        'any.only': 'Invalid metric type'
      }),
    includeCharts: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Include charts must be true or false'
      }),
    email: Joi.string()
      .email()
      .optional()
      .messages({
        'string.email': 'Please provide a valid email address'
      })
  }),

  customReport: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Report name must be at least 3 characters',
        'string.max': 'Report name cannot exceed 100 characters',
        'any.required': 'Report name is required'
      }),
    description: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    metrics: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid(
              'total_customers',
              'avg_wait_time',
              'revenue',
              'satisfaction',
              'no_show_rate',
              'peak_hours',
              'queue_utilization',
              'service_performance'
            )
            .required(),
          aggregation: Joi.string()
            .valid('sum', 'avg', 'count', 'min', 'max')
            .default('sum'),
          filters: Joi.object().optional()
        })
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Metrics must be an array',
        'array.min': 'At least one metric must be selected',
        'any.required': 'Metrics are required'
      }),
    schedule: Joi.object({
      frequency: Joi.string()
        .valid('daily', 'weekly', 'monthly')
        .required(),
      time: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required()
        .messages({
          'string.pattern.base': 'Time must be in HH:MM format'
        }),
      timezone: Joi.string()
        .optional(),
      recipients: Joi.array()
        .items(Joi.string().email())
        .min(1)
        .required()
        .messages({
          'array.min': 'At least one recipient email is required'
        })
    }).optional(),
    isActive: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'Is active must be true or false'
      })
  }),

  alertRule: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Alert name must be at least 3 characters',
        'string.max': 'Alert name cannot exceed 100 characters',
        'any.required': 'Alert name is required'
      }),
    metric: Joi.string()
      .valid(
        'wait_time',
        'queue_size',
        'no_show_rate',
        'satisfaction',
        'revenue',
        'capacity'
      )
      .required()
      .messages({
        'any.only': 'Invalid metric type',
        'any.required': 'Metric is required'
      }),
    condition: Joi.string()
      .valid('greater_than', 'less_than', 'equals', 'not_equals')
      .required()
      .messages({
        'any.only': 'Condition must be one of: greater_than, less_than, equals, not_equals',
        'any.required': 'Condition is required'
      }),
    threshold: Joi.number()
      .required()
      .messages({
        'number.base': 'Threshold must be a number',
        'any.required': 'Threshold is required'
      }),
    duration: Joi.number()
      .integer()
      .min(1)
      .max(1440)
      .default(5)
      .messages({
        'number.base': 'Duration must be a number',
        'number.integer': 'Duration must be a whole number',
        'number.min': 'Duration must be at least 1 minute',
        'number.max': 'Duration cannot exceed 1440 minutes (24 hours)'
      }),
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(false),
      push: Joi.boolean().default(true),
      webhook: Joi.string().uri().optional()
    }).required(),
    isActive: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'Is active must be true or false'
      })
  }),

  dateRange: Joi.object({
    startDate: Joi.date()
      .iso()
      .required()
      .messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format',
        'any.required': 'Start date is required'
      }),
    endDate: Joi.date()
      .iso()
      .min(Joi.ref('startDate'))
      .required()
      .messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format',
        'date.min': 'End date must be after start date',
        'any.required': 'End date is required'
      })
  }),

  comparison: Joi.object({
    current: Joi.object({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
    }).required(),
    previous: Joi.object({
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
    }).required(),
    metrics: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one metric must be selected for comparison'
      })
  })
};
