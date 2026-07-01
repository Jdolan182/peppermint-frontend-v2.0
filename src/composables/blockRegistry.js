export const PAGE_BLOCKS = [
  {
    type: 'hero',
    label: 'Hero',
    defaultData: {
      heading: '',
      subheading: '',
      body: '',
      image: null,
      cta_primary_label: '',
      cta_primary_url: '',
      cta_secondary_label: '',
      cta_secondary_url: '',
    },
    fields: [
      { key: 'heading',             label: 'Heading',          type: 'text' },
      { key: 'subheading',          label: 'Subheading',       type: 'text' },
      { key: 'body',                label: 'Body',             type: 'richtext' },
      { key: 'image',               label: 'Image',            type: 'image' },
      { key: 'cta_primary_label',   label: 'Primary button',   type: 'text' },
      { key: 'cta_primary_url',     label: 'Primary URL',      type: 'url' },
      { key: 'cta_secondary_label', label: 'Secondary button', type: 'text' },
      { key: 'cta_secondary_url',   label: 'Secondary URL',    type: 'url' },
    ],
  },
  {
    type: 'features',
    label: 'Features',
    defaultData: {
      heading: '',
      subheading: '',
      items: [],
    },
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'text' },
      {
        key: 'items', label: 'Features', type: 'items',
        subFields: [
          { key: 'title',       label: 'Title',       type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'icon',        label: 'Icon (emoji or text)', type: 'text' },
        ],
      },
    ],
  },
  {
    type: 'cta',
    label: 'CTA',
    defaultData: {
      heading: '',
      body: '',
      cta_label: '',
      cta_url: '',
      style: 'dark',
    },
    fields: [
      { key: 'heading',   label: 'Heading',   type: 'text' },
      { key: 'body',      label: 'Body',      type: 'richtext' },
      { key: 'cta_label', label: 'Button',    type: 'text' },
      { key: 'cta_url',   label: 'URL',       type: 'url' },
      { key: 'style',     label: 'Style',     type: 'select', options: ['dark', 'light'] },
    ],
  },
  {
    type: 'bento',
    label: 'Bento Grid',
    defaultData: {
      heading: '',
      items: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items', label: 'Cards', type: 'items',
        subFields: [
          { key: 'title',       label: 'Title',       type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'image',       label: 'Image',       type: 'image' },
          { key: 'size',        label: 'Size',        type: 'select', options: ['normal', 'wide', 'tall'] },
        ],
      },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing',
    defaultData: {
      heading: '',
      plans: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'plans', label: 'Plans', type: 'items',
        subFields: [
          { key: 'name',     label: 'Plan name', type: 'text' },
          { key: 'price',    label: 'Price',     type: 'text' },
          { key: 'period',   label: 'Period',    type: 'text' },
          { key: 'features', label: 'Features (one per line)', type: 'textarea' },
          { key: 'cta',      label: 'Button label', type: 'text' },
          { key: 'cta_url',  label: 'Button URL', type: 'url' },
        ],
      },
    ],
  },
  {
    type: 'page-header',
    label: 'Page Header',
    defaultData: {
      heading: '',
      subheading: '',
    },
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'text' },
    ],
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    defaultData: {
      heading: '',
      subheading: '',
      placeholder: 'Enter your email',
      button_label: 'Subscribe',
    },
    fields: [
      { key: 'heading',      label: 'Heading',          type: 'text' },
      { key: 'subheading',   label: 'Subheading',       type: 'text' },
      { key: 'placeholder',  label: 'Input placeholder', type: 'text' },
      { key: 'button_label', label: 'Button label',      type: 'text' },
    ],
  },
  {
    type: 'stats',
    label: 'Stats',
    defaultData: { items: [] },
    fields: [
      {
        key: 'items', label: 'Stats', type: 'items',
        subFields: [
          { key: 'value',       label: 'Value',       type: 'text' },
          { key: 'label',       label: 'Label',       type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
        ],
      },
    ],
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    defaultData: {
      heading: '',
      items: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items', label: 'Testimonials', type: 'items',
        subFields: [
          { key: 'quote',  label: 'Quote',  type: 'textarea' },
          { key: 'author', label: 'Author', type: 'text' },
          { key: 'role',   label: 'Role',   type: 'text' },
          { key: 'image',  label: 'Photo',  type: 'image' },
        ],
      },
    ],
  },
  {
    type: 'contact',
    label: 'Contact',
    defaultData: {
      heading: '',
      subheading: '',
      email: '',
    },
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'text' },
      { key: 'email',      label: 'Email',      type: 'text' },
    ],
  },
  {
    type: 'team',
    label: 'Team',
    defaultData: {
      heading: '',
      subheading: '',
      members: [],
    },
    fields: [
      { key: 'heading',    label: 'Heading',    type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'text' },
      {
        key: 'members', label: 'Members', type: 'items',
        subFields: [
          { key: 'name',  label: 'Name',  type: 'text' },
          { key: 'role',  label: 'Role',  type: 'text' },
          { key: 'bio',   label: 'Bio',   type: 'textarea' },
          { key: 'image', label: 'Photo', type: 'image' },
        ],
      },
    ],
  },
  {
    type: 'content',
    label: 'Content',
    defaultData: { body: '' },
    fields: [
      { key: 'body', label: 'Content', type: 'richtext' },
    ],
  },
  {
    type: 'logo-cloud',
    label: 'Logo Cloud',
    defaultData: {
      heading: '',
      logos: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'logos', label: 'Logos', type: 'items',
        subFields: [
          { key: 'name',  label: 'Name',  type: 'text' },
          { key: 'image', label: 'Image', type: 'image' },
        ],
      },
    ],
  },
  {
    type: 'faq',
    label: 'FAQs',
    defaultData: {
      heading: '',
      items: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items', label: 'Questions', type: 'items',
        subFields: [
          { key: 'question', label: 'Question', type: 'text' },
          { key: 'answer',   label: 'Answer',   type: 'textarea' },
        ],
      },
    ],
  },
]

export const FOOTER_BLOCKS = [
  {
    type: 'footer-brand',
    label: 'Brand',
    defaultData: {
      logo_image: null,
      tagline: '',
      copyright: '',
    },
    fields: [
      { key: 'logo_image', label: 'Logo',      type: 'image' },
      { key: 'tagline',    label: 'Tagline',   type: 'text' },
      { key: 'copyright',  label: 'Copyright', type: 'text' },
    ],
  },
  {
    type: 'footer-links',
    label: 'Links column',
    defaultData: {
      heading: '',
      links: [],
    },
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'links', label: 'Links', type: 'items',
        subFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'url',   label: 'URL',   type: 'url' },
        ],
      },
    ],
  },
  {
    type: 'footer-social',
    label: 'Social links',
    defaultData: { items: [] },
    fields: [
      {
        key: 'items', label: 'Links', type: 'items',
        subFields: [
          { key: 'platform', label: 'Platform', type: 'text' },
          { key: 'url',      label: 'URL',      type: 'url' },
        ],
      },
    ],
  },
  {
    type: 'footer-newsletter',
    label: 'Newsletter',
    defaultData: {
      heading: '',
      placeholder: 'Enter your email',
      button_label: 'Subscribe',
    },
    fields: [
      { key: 'heading',      label: 'Heading',          type: 'text' },
      { key: 'placeholder',  label: 'Input placeholder', type: 'text' },
      { key: 'button_label', label: 'Button label',      type: 'text' },
    ],
  },
  {
    type: 'footer-text',
    label: 'Text',
    defaultData: { body: '' },
    fields: [
      { key: 'body', label: 'Text', type: 'richtext' },
    ],
  },
]

export function getPageBlock(type) {
  return PAGE_BLOCKS.find(b => b.type === type)
}

export function getFooterBlock(type) {
  return FOOTER_BLOCKS.find(b => b.type === type)
}
