import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'visitors',
  mode: 'multi',
  updatedAtField: false,
  dashboard: {
    icon: 'UserCircle',
    fieldLayout: [['visitorId', 'os'], ['country', 'city'], 'userAgent'],
  },
  search: {
    default: [
      'visitorId',
      { field: 'country', reserve: 32 },
      { field: 'city', reserve: 32 },
      { field: 'os', reserve: 7 },
      'userAgent',
    ],
  },
  fields: {
    visitorId: {
      type: 'text',
      options: {
        required: true,
        label: 'Visitor ID',
        description: 'The unique identifier of the visitor (hash generated from IP address and user agent).',
      },
      additional: {
        unique: 'allLanguages',
        immutable: true,
      },
    },
    country: {
      type: 'text',
      options: {
        description: 'The country of the visitor.',
      },
      additional: {
        immutable: true,
      },
    },
    city: {
      type: 'text',
      options: {
        description: 'The city of the visitor.',
      },
      additional: {
        immutable: true,
      },
    },
    os: {
      type: 'select',
      options: {
        choices: {
          Windows: 'Windows',
          macOS: 'macOS',
          Linux: 'Linux',
          Android: 'Android',
          iOS: 'iOS',
          Unknown: 'Unknown',
        },
        required: true,
        label: 'Operating system',
        description: 'The operating system name (Windows, macOS, Linux, Android, iOS, or Unknown).',
      },
      additional: {
        immutable: true,
      },
    },
    userAgent: {
      type: 'text',
      options: {
        required: true,
        description:
          "Information about the user agent (web browser) used to make the request, including the browser's name, version, and the operating system it is running on.",
      },
      additional: {
        immutable: true,
      },
    },
  },
})
