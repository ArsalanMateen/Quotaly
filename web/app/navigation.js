export const navigation = [
  {
    id: 'overview',
    icon: 'grid',
    label: 'Overview',
    heading: 'Usage at a glance.',
    description: 'Keep an eye on what you consume and stay comfortably within your plan.',
  },
];

export const pageDetails = (page) => navigation.find((item) => item.id === page) || navigation[0];
