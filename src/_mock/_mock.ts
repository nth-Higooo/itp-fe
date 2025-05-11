import { fSub } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _fileNames,
  _postTitles,
  _firstNames,
  _eventNames,
  _courseNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
  _countryNames,
} from './assets';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: any) => _id[index],
  time: (index: any) => fSub({ days: index, hours: index }),
  boolean: (index: any) => _booleans[index],
  role: (index: any) => _roles[index],
  // Text
  courseNames: (index: any) => _courseNames[index],
  fileNames: (index: any) => _fileNames[index],
  eventNames: (index: any) => _eventNames[index],
  taskNames: (index: any) => _taskNames[index],
  postTitle: (index: any) => _postTitles[index],
  jobTitle: (index: any) => _jobTitles[index],
  tourName: (index: any) => _tourNames[index],
  productName: (index: any) => _productNames[index],
  sentence: (index: any) => _sentences[index],
  description: (index: any) => _descriptions[index],
  // Contact
  email: (index: any) => _emails[index],
  phoneNumber: (index: any) => _phoneNumbers[index],
  fullAddress: (index: any) => _fullAddress[index],
  // Name
  firstName: (index: any) => _firstNames[index],
  lastName: (index: any) => _lastNames[index],
  fullName: (index: any) => _fullNames[index],
  companyNames: (index: any) => _companyNames[index],
  countryNames: (index: any) => _countryNames[index],
  // Number
  number: {
    percent: (index: any) => _percents[index],
    rating: (index: any) => _ratings[index],
    age: (index: any) => _ages[index],
    price: (index: any) => _prices[index],
    nativeS: (index: any) => _nativeS[index],
    nativeM: (index: any) => _nativeM[index],
    nativeL: (index: any) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/cover/cover-${index + 1}.webp`,
    avatar: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-${index + 1}.webp`,
    travel: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/travel/travel-${index + 1}.webp`,
    course: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/course/course-${index + 1}.webp`,
    company: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/company/company-${index + 1}.webp`,
    product: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/m-product/product-${index + 1}.webp`,
    portrait: (index: number) =>
      `${CONFIG.assetsDir}/assets/images/mock/portrait/portrait-${index + 1}.webp`,
  },
};
