export const navigation = [
  {
    id: 'overview',
    icon: 'grid',
    label: 'Overview',
    heading: 'Usage at a glance.',
    description: 'Keep an eye on what you consume and stay comfortably within your plan.',
  },
  {
    id: 'activity',
    icon: 'pulse',
    label: 'Usage activity',
    heading: 'A clear record.',
    description: 'Every successful action, counted exactly once.',
  },
];

export const pageDetails = (page) => navigation.find((item) => item.id === page) || navigation[0];
