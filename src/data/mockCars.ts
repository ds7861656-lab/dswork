// src/data/mockCars.ts

import { type Car } from '../types/car';

export const mockCars: Car[] = [
  {
    id: '1',
    name: '2021 GL8',
    brand: 'Buick',
    model: 'GL8',
    year: 2021,
    type: 'Van',
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 120,
    rating: 5.0,
    reviewCount: 48,
    images: [
      'https://gmauthority.com/blog/wp-content/uploads/2024/04/2024-Buick-GL8-ES-PHEV-Avenir-Leaks-Photos-China-Press-Photos-Exterior-001-side-front-three-quarters.jpg',
      'https://www.buick.com/content/dam/buick/na/us/english/index/enclave-2024/mov/01-images/2024-enclave-avenir-gaw-interior-features-lg.jpg',
      'https://di-uploads-pod2.dealerinspire.com/gmcwestmidland/uploads/2023/07/2024-GMC-Yukon-Interior-Space-1.jpg'
    ],
    features: [
      'Leather seats',
      'Panoramic sunroof',
      'Apple CarPlay',
      'Rearview camera',
      'Heated seats',
      'Premium sound system'
    ],
    location: 'Beijing, China',
    availability: true,
    description: 'Perfect for family trips with spacious interior and premium comfort. The GL8 offers luxury van experience with modern amenities.',
    specifications: {
      mileage: '10.5 L/100km',
      engineSize: '2.0L Turbo',
      luggage: 5,
      doors: 4
    },
    insurance: {
      basic: 15,
      premium: 30
    },
    hostName: 'Beijing Luxury Rentals',
    hostImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup'
  },
  {
    id: '2',
    name: 'Tesla Model Y',
    brand: 'Tesla',
    model: 'Model Y',
    year: 2023,
    type: 'Electric',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    pricePerDay: 150,
    rating: 4.9,
    reviewCount: 127,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/5/5e/2023_Tesla_Model_Y_Long_Range_All-Wheel_Drive_in_Pearl_White_Multi-Coat%2C_front_right%2C_2024-09-25.jpg',
      'https://www.tesla.com/ownersmanual/images/GUID-56562137-5FD5-4F9C-B1A1-D58C44631FC2-online-en-US.png',
      'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Interior-Hero-Desktop-LHD.jpg'
    ],
    features: [
      'Autopilot',
      'Glass roof',
      'Premium audio',
      'Wireless charging',
      'Heated seats',
      'Full Self-Driving capable'
    ],
    location: 'Shanghai, China',
    availability: true,
    description: 'Experience the future of driving with Tesla\'s most popular electric SUV. Zero emissions, incredible performance, and cutting-edge technology.',
    specifications: {
      mileage: '455 km range',
      engineSize: 'Dual Motor',
      luggage: 4,
      doors: 5
    },
    insurance: {
      basic: 20,
      premium: 40
    },
    hostName: 'Shanghai EV Rentals',
    hostImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
  },
  {
    id: '3',
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    type: 'Luxury',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    pricePerDay: 180,
    rating: 4.8,
    reviewCount: 89,
    images: [
      'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/152681/x5-exterior-right-front-three-quarter-6.jpeg',
      'https://www.bmwusa.com/content/dam/bmw/common/vehicles/2023/x5-range/x5-suv/interior/bmw-x5-suv-interior.jpg',
      'https://www.bmwblog.com/wp-content/uploads/2023/02/2023-BMW-X5-Interior-01.jpg'
    ],
    features: [
      'All-wheel drive',
      'Leather interior',
      'Navigation system',
      'Parking assist',
      'Heated steering wheel',
      'Premium package'
    ],
    location: 'Hangzhou, China',
    availability: true,
    description: 'Luxury meets performance in this premium SUV. Perfect for business travel or special occasions with ultimate comfort and style.',
    specifications: {
      mileage: '8.5 L/100km',
      engineSize: '3.0L Hybrid',
      luggage: 4,
      doors: 5
    },
    insurance: {
      basic: 25,
      premium: 50
    },
    hostName: 'Hangzhou Premium Cars',
    hostImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    cancellationPolicy: 'Free cancellation up to 72 hours before pickup'
  },
  {
    id: '4',
    name: 'Citroën C5 Aircross',
    brand: 'Citroën',
    model: 'C5 Aircross',
    year: 2023,
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 95,
    rating: 4.7,
    reviewCount: 63,
    images: [
      'https://citroen-magnusmotors.com/wp-content/uploads/2024/04/image-4.png',
      'https://www.citroen.co.uk/content/dam/citroen/master/b2c/models/c5-aircross/2022/gallery/interior/c5-aircross-interior-dashboard-v2.jpg',
      'https://www.motoringresearch.com/wp-content/uploads/2022/03/Citroen-C5-Aircross-interior.jpg'
    ],
    features: [
      'Panoramic sunroof',
      'Advanced comfort seats',
      'ConnectedCAM',
      'Grip Control',
      'Blind spot monitoring',
      'Lane departure warning'
    ],
    location: 'Guangzhou, China',
    availability: true,
    description: 'Enjoy ultimate comfort with Citroën\'s Advanced Comfort® seats and smooth suspension. Ideal for long road trips and family adventures.',
    specifications: {
      mileage: '6.8 L/100km',
      engineSize: '1.6L Turbo',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 12,
      premium: 25
    },
    hostName: 'Guangzhou Car Hub',
    hostImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup'
  },
  {
    id: '5',
    name: 'Mercedes-Benz E-Class',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    type: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 160,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/Mercedes-Benz_W214_1X7A1841.jpg',
      'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my23/e-class/sedan/all-vehicles/2023-E-CLASS-SEDAN-GALLERY-003-WR-DR.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/c/c4/2013_Mercedes-Benz_E_250_%28W_212%29_sedan_%282015-07-14%29.jpg'
    ],
    features: [
      'MBUX infotainment',
      'Burmester sound system',
      'Air suspension',
      'Massage seats',
      '360-degree camera',
      'Wireless charging'
    ],
    location: 'Shenzhen, China',
    availability: true,
    description: 'Experience German engineering at its finest. The E-Class delivers sophistication, comfort, and advanced technology for discerning travelers.',
    specifications: {
      mileage: '7.2 L/100km',
      engineSize: '2.0L Turbo',
      luggage: 3,
      doors: 4
    },
    insurance: {
      basic: 22,
      premium: 45
    },
    hostName: 'Shenzhen Luxury Fleet',
    hostImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup'
  },
  {
    id: '6',
    name: 'Toyota Camry',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'Sedan',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    pricePerDay: 85,
    rating: 4.6,
    reviewCount: 156,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/a/ab/2024_Toyota_Camry_HEV_Premium_Luxury_%28Cockpit%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/bc/%28USA-Massachusetts%29_Private_Toyota_Camry_NJ-Z22UKZ_rear_2024-06-06.jpg'
    ],
    features: [
      'Hybrid engine',
      'Toyota Safety Sense',
      'Apple CarPlay',
      'Adaptive cruise control',
      'LED headlights',
      'Keyless entry'
    ],
    location: 'Chengdu, China',
    availability: true,
    description: 'Reliable, efficient, and comfortable. The Camry Hybrid offers excellent fuel economy and a smooth, quiet ride for everyday travel.',
    specifications: {
      mileage: '4.1 L/100km',
      engineSize: '2.5L Hybrid',
      luggage: 3,
      doors: 4
    },
    insurance: {
      basic: 10,
      premium: 20
    },
    hostName: 'Chengdu Auto Rentals',
    hostImage: 'https://randomuser.me/api/portraits/women/6.jpg',
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
  },
  {
    id: '7',
    name: 'Audi Q7',
    brand: 'Audi',
    model: 'Q7',
    year: 2023,
    type: 'SUV',
    seats: 7,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 170,
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/8/8b/2017_Audi_Q7_S_Line_Quattro_3.0_Front.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Audi_Q7_offroad_style_S_line_3.0_TDI_quattro_tiptronic_Phantomschwarz_Interieur.JPG/1920px-Audi_Q7_offroad_style_S_line_3.0_TDI_quattro_tiptronic_Phantomschwarz_Interieur.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Audi_Q7_V12_-_Flickr_-_Alexandre_Pr%C3%A9vot_%286%29.jpg/1920px-Audi_Q7_V12_-_Flickr_-_Alexandre_Pr%C3%A9vot_%286%29.jpg'
    ],
    features: [
      'Quattro AWD',
      'Virtual cockpit',
      'Bang & Olufsen sound',
      'Three-row seating',
      'Adaptive air suspension',
      'Matrix LED headlights'
    ],
    location: 'Xi\'an, China',
    availability: true,
    description: 'Spacious luxury SUV perfect for large families or groups. Combines premium comfort with cutting-edge technology and impressive performance.',
    specifications: {
      mileage: '9.1 L/100km',
      engineSize: '3.0L V6',
      luggage: 4,
      doors: 5
    },
    insurance: {
      basic: 23,
      premium: 46
    },
    hostName: 'Xi\'an Premium Rentals',
    hostImage: 'https://randomuser.me/api/portraits/men/7.jpg',
    cancellationPolicy: 'Free cancellation up to 72 hours before pickup'
  },
  {
    id: '8',
    name: 'Honda CR-V',
    brand: 'Honda',
    model: 'CR-V',
    year: 2023,
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    pricePerDay: 100,
    rating: 4.7,
    reviewCount: 203,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg/1920px-Honda_CR-V_e-HEV_Elegance_AWD_%28VI%29_%E2%80%93_f_14072024.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/MG_8810_%2852795202017%29.jpg/3840px-MG_8810_%2852795202017%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/2017_Honda_CR-V_SE_i-VETEC_Automatic_2.0_facelift_Front.jpg'
    ],
    features: [
      'Honda Sensing',
      'Hands-free liftgate',
      'Wireless phone charger',
      'Dual-zone climate',
      'Hill start assist',
      'Remote start'
    ],
    location: 'Nanjing, China',
    availability: true,
    description: 'One of the most popular SUVs combines reliability, efficiency, and practicality. Perfect for urban driving and weekend getaways.',
    specifications: {
      mileage: '5.7 L/100km',
      engineSize: '2.0L Hybrid',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 11,
      premium: 22
    },
    hostName: 'Nanjing Car Share',
    hostImage: 'https://randomuser.me/api/portraits/women/8.jpg',
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
  },
  {
    id: '9',
    name: 'Porsche Cayenne',
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2023,
    type: 'Luxury',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 250,
    rating: 5.0,
    reviewCount: 67,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/f/fb/Porsche_Cayenne_%28III%2C_Facelift%29_%E2%80%93_f_01012025.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/f/f3/Porsche_Cayenne_3.2_V6_-_Flickr_-_The_Car_Spy_%2810%29.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/4/47/2015_Porsche_Cayenne_V6_Diesel_Triptonic_S_3.0_Rear.jpg'
    ],
    features: [
      'Sport Chrono package',
      'Air suspension',
      'Bose surround sound',
      'Panoramic roof',
      'Sport exhaust',
      'Lane keeping assist'
    ],
    location: 'Suzhou, China',
    availability: true,
    description: 'Experience the thrill of a sports car in SUV form. The Cayenne delivers exhilarating performance without compromising on luxury or practicality.',
    specifications: {
      mileage: '11.2 L/100km',
      engineSize: '3.0L V6',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 35,
      premium: 70
    },
    hostName: 'Suzhou Exotic Rentals',
    hostImage: 'https://randomuser.me/api/portraits/men/9.jpg',
    cancellationPolicy: 'Free cancellation up to 7 days before pickup'
  },
  {
    id: '10',
    name: 'Volkswagen ID.4',
    brand: 'Volkswagen',
    model: 'ID.4',
    year: 2023,
    type: 'Electric',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    pricePerDay: 110,
    rating: 4.6,
    reviewCount: 88,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/0/02/2020_Volkswagen_ID.4_Pro_%28Netherlands%29_front_view.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/VW_ID4_Family_Innen.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Volkswagen_ID.5_Leonberg_2022_1X7A0500.jpg'
    ],
    features: [
      'ID.Light light bar',
      'Augmented reality HUD',
      'Travel Assist',
      'Wireless CarPlay',
      'Heat pump',
      'Fast charging capable'
    ],
    location: 'Tianjin, China',
    availability: true,
    description: 'Volkswagen\'s first all-electric SUV offers a spacious interior, intuitive tech, and impressive range. Perfect for eco-conscious travelers.',
    specifications: {
      mileage: '425 km range',
      engineSize: 'Electric Motor',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 14,
      premium: 28
    },
    hostName: 'Tianjin Green Drive',
    hostImage: 'https://randomuser.me/api/portraits/women/10.jpg',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup'
  },
  {
    id: '11',
    name: 'Lexus RX 450h',
    brand: 'Lexus',
    model: 'RX 450h',
    year: 2023,
    type: 'Luxury',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    pricePerDay: 165,
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/a/af/Lexus_RX_500h_F_SPORT%2B_%28V%29_%E2%80%93_f_14072024.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/8/81/Lexus_RX_300_cabin.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/6b/Lexus-RX400H.jpg'
    ],
    features: [
      'Mark Levinson audio',
      'Lexus Safety System+',
      'Panoramic view monitor',
      'Heated/ventilated seats',
      'Power liftgate',
      'Wireless charging'
    ],
    location: 'Wuhan, China',
    availability: true,
    description: 'Japanese luxury at its finest. The RX 450h combines refined comfort, hybrid efficiency, and legendary Lexus reliability.',
    specifications: {
      mileage: '6.3 L/100km',
      engineSize: '2.5L Hybrid',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 21,
      premium: 42
    },
    hostName: 'Wuhan Luxury Cars',
    hostImage: 'https://randomuser.me/api/portraits/men/11.jpg',
    cancellationPolicy: 'Free cancellation up to 48 hours before pickup'
  },
  {
    id: '12',
    name: 'Mazda CX-5',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2023,
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    pricePerDay: 88,
    rating: 4.7,
    reviewCount: 176,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/2024_Mazda_CX-5_2.5_S_Select_in_Platinum_Quartz_Metallic%2C_front_right.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/22/2012_Mazda_CX-5_%28KE%29_Grand_Touring_wagon_%282012-10-26%29_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/58/2020-2021_Mazda_CX-5_XD_AWD.jpg'
    ],
    features: [
      'i-Activsense safety',
      'Apple CarPlay',
      'Bose audio',
      'Smart brake support',
      'Blind spot monitoring',
      'Adaptive headlights'
    ],
    location: 'Qingdao, China',
    availability: true,
    description: 'Stylish, fun-to-drive SUV with upscale interior quality. The CX-5 offers excellent value and engaging driving dynamics.',
    specifications: {
      mileage: '7.8 L/100km',
      engineSize: '2.5L',
      luggage: 3,
      doors: 5
    },
    insurance: {
      basic: 10,
      premium: 20
    },
    hostName: 'Qingdao Auto Club',
    hostImage: 'https://randomuser.me/api/portraits/women/12.jpg',
    cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
  }
];

// Helper function to get random cars
export const getRandomCars = (count: number): Car[] => {
  const shuffled = [...mockCars].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to filter cars
export const filterCars = (cars: Car[], filters: any): Car[] => {
  return cars.filter(car => {
    if (filters.type && filters.type.length > 0 && !filters.type.includes(car.type)) {
      return false;
    }
    if (filters.transmission && filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) {
      return false;
    }
    if (filters.seats && filters.seats.length > 0 && !filters.seats.includes(car.seats)) {
      return false;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (car.pricePerDay < min || car.pricePerDay > max) {
        return false;
      }
    }
    if (filters.rating && car.rating < filters.rating) {
      return false;
    }
    return true;
  });
};

// Helper function to sort cars
export const sortCars = (cars: Car[], sortBy: string): Car[] => {
  const sorted = [...cars];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case 'price-desc':
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};
