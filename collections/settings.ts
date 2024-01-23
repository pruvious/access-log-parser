import { defineCollection } from '#pruvious'
import fs from 'fs'

export default defineCollection({
  name: 'settings',
  mode: 'single',
  fields: {
    geoipDb: {
      type: 'file',
      options: {
        required: true,
        label: 'GeoLite2-City.mmdb',
        description: 'You can get the free database from Maxmind (https://www.maxmind.com/en/geolite2/signup).',
        allowedTypes: ['.mmdb'],
      },
    },
    accessLogPaths: {
      type: 'repeater',
      options: {
        subfields: {
          path: {
            type: 'text',
            options: {
              required: true,
              placeholder: 'e.g., /var/log/nginx/access.log',
            },
            additional: {
              validators: [
                ({ value }) => {
                  if (!fs.existsSync(value)) {
                    throw new Error('File does not exist')
                  }
                },
              ],
            },
          },
          site: {
            type: 'text',
            options: {
              required: true,
              placeholder: 'e.g., pruvious.com',
            },
          },
        },
        fieldLayout: [['path | 48rem', 'site']],
        addLabel: 'Add path',
        description: 'The paths to the nginx access logs.',
      },
    },
  },
})
