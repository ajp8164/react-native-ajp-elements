import Share, { type ShareOptions } from 'react-native-share';

import { Platform } from 'react-native';

type ShareSheetOptions = {
  title?: string;
  message?: string;
  subject?: string;
  email?: string;
  url?: string;
};

/**
 * Opens the device share sheet with the specified information. A device generated url can be
 * used to send an image generated on the device.
 * @param opts - options
 *   title - share sheet title
 *   message - message content
 *   subject - subject field for an email
 *   email - email address
 *   url - a reference to additional content; e.g. an image
 */
const openShareSheet = (
  opts: ShareSheetOptions = {
    title: '',
    message: '',
    subject: '',
    email: '',
    url: '',
  },
) => {
  const options: ShareOptions = <ShareOptions>Platform.select({
    ios: {
      failOnCancel: false,
      activityItemSources: [
        {
          placeholderItem: {
            type: 'text',
            content: opts.title,
          },
          item: {
            default: {
              type: 'text',
              content: opts.message,
              subject: opts.subject,
              email: opts.email,
            },
          },
          linkMetadata: {
            title: opts.title,
          },
        },
        opts.url?.length
          ? {
              placeholderItem: {
                type: 'url',
                content: opts.url,
              },
              item: {
                default: {
                  type: 'url',
                  content: opts.url,
                },
              },
              linkMetadata: {
                title: opts.title,
                originalUrl: opts.url,
                url: opts.url,
              },
            }
          : {},
      ],
    },
    default: {
      type: 'text',
      title: opts.title,
      subject: opts.subject,
      message: `${opts.title} ${opts.message}`,
      url: opts.url,
      failOnCancel: false,
    },
  });

  Share.open(options);
};

export { openShareSheet, type ShareSheetOptions };
