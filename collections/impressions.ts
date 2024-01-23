import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'impressions',
  mode: 'multi',
  updatedAtField: false,
  dashboard: {
    icon: 'Click',
    fieldLayout: [
      ['visitor', 'time'],
      ['site', 'page', 'referrer'],
    ],
    overviewTable: {
      columns: ['page', 'site', 'visitor', 'time'],
      sort: { field: 'time', direction: 'desc' },
    },
  },
  fields: {
    visitor: {
      type: 'record',
      options: {
        required: true,
        collection: 'visitors',
        fields: {
          id: true,
          visitorId: true,
          country: true,
          city: true,
          os: true,
          userAgent: true,
        },
        description: 'The visitor.',
      },
      additional: {
        foreignKey: {
          table: 'visitors',
          action: ['ON UPDATE RESTRICT', 'ON DELETE CASCADE'],
        },
      },
    },
    site: {
      type: 'text',
      options: {
        required: true,
        description: 'The domain of the visited site.',
      },
      additional: {
        index: true,
        immutable: true,
      },
    },
    page: {
      type: 'text',
      options: {
        required: true,
        description: 'The pathname of the visited page.',
      },
      additional: {
        index: true,
        immutable: true,
      },
    },
    referrer: {
      type: 'text',
      options: {
        required: true,
        description:
          'The HTTP `referer` header, which is sent by a client (usually a web browser) when making a request to a web page.',
      },
    },
    time: {
      type: 'date-time',
      options: {
        required: true,
        description: 'The time of the visit.',
      },
      additional: {
        index: true,
        immutable: true,
      },
    },
  },
})
