const firstNames = [
  'Ava',
  'Noah',
  'Mia',
  'Ethan',
  'Sophia',
  'Liam',
  'Zoe',
  'Mason',
  'Olivia',
  'Lucas',
  'Emma',
  'Caleb'
];

const lastNames = [
  'Johnson',
  'Nguyen',
  'Patel',
  'Garcia',
  'Smith',
  'Brown',
  'Lee',
  'Martinez',
  'Davis',
  'Wilson',
  'Taylor',
  'Anderson'
];

const organizations = [
  'Computer Science Club',
  'Business Leaders Association',
  'Engineering Society',
  'Creative Writing Circle',
  'Campus Volunteer Network',
  'Student Government',
  'Pre-Med Society',
  'Music and Arts Collective'
];

const gradeLevels = ['freshman', 'sophomore', 'junior', 'senior'];

const eventTemplates = {
  social: [
    { name: 'Campus Mixer', description: 'A relaxed mixer for new and returning members to connect.' },
    { name: 'Game Night', description: 'An informal night of board games, snacks, and conversation.' },
    { name: 'Club Social', description: 'A casual social event with music and light refreshments.' }
  ],
  meeting: [
    { name: 'Weekly Planning Meeting', description: 'A focused planning session for upcoming club activities.' },
    { name: 'Executive Board Meeting', description: 'Leadership meeting to review timelines, tasks, and updates.' },
    { name: 'Member Check-In', description: 'A short meeting to gather feedback and coordinate next steps.' }
  ],
  professional: [
    { name: 'Resume Workshop', description: 'A hands-on session to improve resumes and LinkedIn profiles.' },
    { name: 'Career Panel', description: 'A panel discussion with professionals and alumni.' },
    { name: 'Networking Night', description: 'A professional networking event with guided introductions.' }
  ]
};

const rooms = [
  'SCI 204',
  'LIB 118',
  'ENG 310',
  'STU 105',
  'HUM 220',
  'BUS 142',
  'TECH 016'
];

const categories = ['social', 'meeting', 'professional'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (values) => values[randomInt(0, values.length - 1)];
const pad = (value) => String(value).padStart(2, '0');

const buildFutureDate = (maxDaysAhead = 90) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + randomInt(2, maxDaysAhead));
  return date.toISOString().slice(0, 10);
};

const buildTime = () => {
  const hour = randomInt(9, 19);
  const minute = pickRandom([0, 15, 30, 45]);
  return `${pad(hour)}:${pad(minute)}`;
};

const buildEmail = (firstName, lastName) => {
  const suffix = randomInt(100, 999);
  return `${firstName}.${lastName}${suffix}@students.edu`.toLowerCase();
};

const buildPhone = () => {
  const areaCode = pickRandom(['202', '303', '404', '512', '617', '704', '786']);
  const exchange = randomInt(200, 999);
  const lineNumber = randomInt(1000, 9999);
  return `${areaCode}${exchange}${lineNumber}`;
};

export const createRandomEvent = () => {
  const category = pickRandom(categories);
  const template = pickRandom(eventTemplates[category]);
  const duration = pickRandom([30, 45, 60, 75, 90, 120, 150, 180]);
  const eventCost = category === 'social' ? pickRandom([0, 5, 10, 12.5, 15]) : category === 'meeting' ? pickRandom([0, 3, 5, 7.5]) : pickRandom([10, 15, 20, 25, 35]);

  return {
    eventId: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    eventName: template.name,
    eventCategory: category,
    eventDuration: duration,
    eventDate: buildFutureDate(),
    eventTime: buildTime(),
    eventCost,
    openSeats: randomInt(15, 120),
    locationRoomNumber: pickRandom(rooms),
    eventDescription: template.description
  };
};

export const createRandomUser = () => {
  const firstName = pickRandom(firstNames);
  const lastName = pickRandom(lastNames);

  return {
    id: Number(`${Date.now()}${randomInt(10, 99)}`),
    firstName,
    lastName,
    email: buildEmail(firstName, lastName),
    phone: buildPhone(),
    organization: pickRandom(organizations),
    gradeLevel: pickRandom(gradeLevels)
  };
};
