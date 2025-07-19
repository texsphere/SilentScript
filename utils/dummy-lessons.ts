export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface LessonCategory {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Using placeholder video URLs, but more realistic thumbnails
export const dummyLessons: LessonCategory[] = [
  {
    id: 'greetings',
    title: 'Common Greetings',
    lessons: [
      { id: 'namaste', title: 'नमस्ते (Namaste)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/Lsmv5LwWf2g/hqdefault.jpg' },
      { id: 'dhanyabad', title: 'धन्यवाद (Thank You)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/q-s4c-a-tXk/hqdefault.jpg' },
      { id: 'bida', title: 'बिदा (Goodbye)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/5-5o-3J5y5w/hqdefault.jpg' },
      { id: 'how_are_you', title: 'सन्चै हुनुहुन्छ? (How are you?)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ],
  },
  {
    id: 'alphabet',
    title: 'Nepali Alphabet',
    lessons: [
      { id: 'ka', title: 'क (Ka)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/Qy_9i3Gv4m8/hqdefault.jpg' },
      { id: 'kha', title: 'ख (Kha)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/f2282vGIB9k/hqdefault.jpg' },
      { id: 'ga', title: 'ग (Ga)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/3y7_1wVq-gU/hqdefault.jpg' },
      { id: 'gha', title: 'घ (Gha)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    lessons: [
      { id: 'one', title: '१ (Ek)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/u1P_v_pW-bA/hqdefault.jpg' },
      { id: 'two', title: '२ (Dui)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/hB-yvI-k_ok/hqdefault.jpg' },
      { id: 'three', title: '३ (Teen)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/B0V23c2tZgA/hqdefault.jpg' },
      { id: 'four', title: '४ (Char)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'five', title: '५ (Paanch)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ],
  },
  {
    id: 'family',
    title: 'Family Members',
    lessons: [
      { id: 'father', title: 'बुवा (Father)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'mother', title: 'आमा (Mother)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'brother', title: 'भाइ (Brother)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'sister', title: 'बहिनी (Sister)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ]
  },
  {
    id: 'days',
    title: 'Days of the Week',
    lessons: [
      { id: 'sunday', title: 'आइतबार (Sunday)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'monday', title: 'सोमबार (Monday)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
      { id: 'tuesday', title: 'मंगलबार (Tuesday)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ]
  },
  {
    id: 'food',
    title: 'Food & Dining',
    lessons: [
        { id: 'food', title: 'खाना (Food)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
        { id: 'water', title: 'पानी (Water)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
        { id: 'eat', title: 'खानु (To Eat)', videoUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', thumbnailUrl: 'https://i.ytimg.com/vi/a_n456cM_fg/0.jpg' },
    ]
  }
]; 