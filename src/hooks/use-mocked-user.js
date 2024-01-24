import { _mock } from 'src/_mock';
import { decryptToken } from 'src/utils/common';
import { constants } from 'src/utils/constant';

export function useMockedUser() {

  const stringifiedUser = localStorage.getItem(constants.keyUserData);
  const userData = JSON.parse(decryptToken(stringifiedUser));

  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: userData.name,
    email: userData.email,
    photoURL: _mock.image.avatar(24),
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
