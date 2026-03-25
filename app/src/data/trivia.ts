export interface TriviaQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export const triviaQuestions: TriviaQuestion[] = [
  {
    question: 'Which artist has the most Grammy Awards of all time?',
    options: ['Quincy Jones', 'Beyonce', 'Georg Solti', 'Stevie Wonder'],
    correctIndex: 1,
  },
  {
    question: 'What was the first music video played on MTV?',
    options: ['"Bohemian Rhapsody"', '"Video Killed the Radio Star"', '"Thriller"', '"Money for Nothing"'],
    correctIndex: 1,
  },
  {
    question: 'Which band holds the record for the longest concert ever?',
    options: ['Grateful Dead', 'Phish', 'The Flaming Lips', 'Foo Fighters'],
    correctIndex: 2,
  },
  {
    question: 'What year was "Bohemian Rhapsody" by Queen released?',
    options: ['1973', '1975', '1977', '1979'],
    correctIndex: 1,
  },
  {
    question: 'Who wrote the song "Purple Rain"?',
    options: ['Jimi Hendrix', 'Prince', 'Stevie Wonder', 'Michael Jackson'],
    correctIndex: 1,
  },
  {
    question: 'Which album is the best-selling of all time?',
    options: ['Back in Black', 'The Dark Side of the Moon', 'Thriller', 'Abbey Road'],
    correctIndex: 2,
  },
  {
    question: 'What instrument does Yo-Yo Ma famously play?',
    options: ['Violin', 'Piano', 'Cello', 'Flute'],
    correctIndex: 2,
  },
  {
    question: 'Which country is the band ABBA from?',
    options: ['Norway', 'Denmark', 'Finland', 'Sweden'],
    correctIndex: 3,
  },
  {
    question: 'What is the name of Elvis Presley\'s famous estate?',
    options: ['Neverland', 'Graceland', 'Heartbreak Hotel', 'Paisley Park'],
    correctIndex: 1,
  },
  {
    question: 'Which Beatles album features a zebra crossing on its cover?',
    options: ['Let It Be', 'Revolver', 'Abbey Road', 'Sgt. Pepper\'s'],
    correctIndex: 2,
  },
  {
    question: 'What genre of music originated in Jamaica in the late 1960s?',
    options: ['Calypso', 'Reggae', 'Ska', 'Dancehall'],
    correctIndex: 1,
  },
  {
    question: 'Who is known as the "Queen of Soul"?',
    options: ['Diana Ross', 'Tina Turner', 'Aretha Franklin', 'Whitney Houston'],
    correctIndex: 2,
  },
  {
    question: 'Which rapper\'s real name is Marshall Mathers?',
    options: ['Jay-Z', 'Eminem', 'Kanye West', '50 Cent'],
    correctIndex: 1,
  },
  {
    question: 'What was Nirvana\'s breakthrough album called?',
    options: ['In Utero', 'Bleach', 'Nevermind', 'Unplugged in New York'],
    correctIndex: 2,
  },
  {
    question: 'How many members were in the Spice Girls?',
    options: ['4', '5', '6', '3'],
    correctIndex: 1,
  },
  {
    question: 'Which classical composer became deaf later in life?',
    options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'],
    correctIndex: 2,
  },
  {
    question: 'What song holds the record for most weeks at #1 on the Billboard Hot 100?',
    options: ['"Despacito"', '"Old Town Road"', '"One Sweet Day"', '"Blinding Lights"'],
    correctIndex: 1,
  },
  {
    question: 'Which festival took place in 1969 and became a symbol of counterculture?',
    options: ['Coachella', 'Woodstock', 'Glastonbury', 'Monterey Pop'],
    correctIndex: 1,
  },
  {
    question: 'Who sang "Like a Virgin" in 1984?',
    options: ['Cyndi Lauper', 'Janet Jackson', 'Madonna', 'Whitney Houston'],
    correctIndex: 2,
  },
  {
    question: 'What does DJ stand for?',
    options: ['Dance Jammer', 'Digital Jukebox', 'Disc Jockey', 'Dynamic Jazz'],
    correctIndex: 2,
  },
  {
    question: 'Which artist released the album "21" in 2011?',
    options: ['Taylor Swift', 'Adele', 'Lady Gaga', 'Rihanna'],
    correctIndex: 1,
  },
  {
    question: 'What was Michael Jackson\'s signature dance move?',
    options: ['The Robot', 'The Moonwalk', 'The Worm', 'The Running Man'],
    correctIndex: 1,
  },
  {
    question: 'Which band recorded "Hotel California"?',
    options: ['Fleetwood Mac', 'The Eagles', 'The Doors', 'Led Zeppelin'],
    correctIndex: 1,
  },
  {
    question: 'What is the highest-selling single of all time worldwide?',
    options: ['"Candle in the Wind"', '"White Christmas"', '"Bohemian Rhapsody"', '"I Will Always Love You"'],
    correctIndex: 1,
  },
  {
    question: 'Which artist\'s real name is Stefani Joanne Angelina Germanotta?',
    options: ['Lana Del Rey', 'Halsey', 'Lady Gaga', 'Lorde'],
    correctIndex: 2,
  },
  {
    question: 'In what decade did hip-hop music originate?',
    options: ['1960s', '1970s', '1980s', '1990s'],
    correctIndex: 1,
  },
  {
    question: 'Which Pink Floyd album features a prism on its cover?',
    options: ['The Wall', 'Wish You Were Here', 'The Dark Side of the Moon', 'Animals'],
    correctIndex: 2,
  },
  {
    question: 'What nationality is the singer Shakira?',
    options: ['Mexican', 'Spanish', 'Colombian', 'Brazilian'],
    correctIndex: 2,
  },
  {
    question: 'Which instrument has 88 keys?',
    options: ['Organ', 'Piano', 'Harpsichord', 'Accordion'],
    correctIndex: 1,
  },
  {
    question: 'Who performed the Super Bowl halftime show in 2023?',
    options: ['Shakira', 'Rihanna', 'Beyonce', 'Taylor Swift'],
    correctIndex: 1,
  },
  {
    question: 'What was the name of the Notorious B.I.G.\'s debut album?',
    options: ['Life After Death', 'Ready to Die', 'Born Again', 'Duets'],
    correctIndex: 1,
  },
  {
    question: 'Which rock band had members named Mick and Keith?',
    options: ['The Who', 'The Rolling Stones', 'Led Zeppelin', 'The Kinks'],
    correctIndex: 1,
  },
  {
    question: 'What is Billie Eilish\'s brother and collaborator\'s name?',
    options: ['Finneas', 'Felix', 'Francis', 'Franklin'],
    correctIndex: 0,
  },
  {
    question: 'Which music streaming service launched in Sweden in 2008?',
    options: ['Apple Music', 'Tidal', 'Spotify', 'Deezer'],
    correctIndex: 2,
  },
  {
    question: 'What genre is Louis Armstrong most associated with?',
    options: ['Blues', 'Jazz', 'R&B', 'Gospel'],
    correctIndex: 1,
  },
  {
    question: 'Which band wrote "Smells Like Teen Spirit"?',
    options: ['Pearl Jam', 'Soundgarden', 'Nirvana', 'Alice in Chains'],
    correctIndex: 2,
  },
  {
    question: 'How many strings does a standard guitar have?',
    options: ['4', '5', '6', '8'],
    correctIndex: 2,
  },
  {
    question: 'What musical term means to gradually get louder?',
    options: ['Decrescendo', 'Forte', 'Crescendo', 'Pianissimo'],
    correctIndex: 2,
  },
  {
    question: 'Which artist painted the "Sgt. Pepper\'s" album cover for The Beatles?',
    options: ['Andy Warhol', 'Peter Blake', 'Roy Lichtenstein', 'David Hockney'],
    correctIndex: 1,
  },
  {
    question: 'What year did Spotify launch in the United States?',
    options: ['2009', '2011', '2013', '2015'],
    correctIndex: 1,
  },
  {
    question: 'Which artist released "Lemonade" as a visual album?',
    options: ['Rihanna', 'Beyonce', 'Solange', 'SZA'],
    correctIndex: 1,
  },
  {
    question: 'What was the original name of the band Green Day?',
    options: ['Sweet Children', 'Blue Monday', 'Bitter End', 'Flower Power'],
    correctIndex: 0,
  },
];
