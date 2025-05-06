const keys = '0123456789';

export function idGenerator(role, idLength = 12) {
  let id = '';
  if (role === 'student') {
    id += 'STU';
  } else if (role === 'teacher') {
    id += 'TCH';
  } else if (role === 'organization') {
    id += 'ORG';
  } else {
    return 'Invalid Role';
  }

  for (let i = 0; i < idLength; i++) {
    id += keys.charAt(Math.floor(Math.random() * keys.length));
  }
  return id;
}