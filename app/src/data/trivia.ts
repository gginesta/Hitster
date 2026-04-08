export type TriviaCategory = 'general' | 'lyrics' | 'first' | 'true_false' | 'decades' | 'instruments' | 'origins';

export interface TriviaQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  category?: TriviaCategory;
}

export const triviaQuestions: TriviaQuestion[] = [
  // --- Original questions ---
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

  // --- Expanded questions ---
  {
    question: 'What is the best-selling album by a female artist?',
    options: ['Whitney Houston - The Bodyguard', 'Adele - 21', 'Shania Twain - Come On Over', 'Alanis Morissette - Jagged Little Pill'],
    correctIndex: 2,
  },
  {
    question: 'Which band\'s drummer is named Lars Ulrich?',
    options: ['Iron Maiden', 'Metallica', 'Megadeth', 'Slayer'],
    correctIndex: 1,
  },
  {
    question: 'What city is Motown Records originally from?',
    options: ['Chicago', 'New York', 'Detroit', 'Memphis'],
    correctIndex: 2,
  },
  {
    question: 'Who sang "Respect" in 1967?',
    options: ['Otis Redding', 'Aretha Franklin', 'Etta James', 'Nina Simone'],
    correctIndex: 1,
  },
  {
    question: 'What was the first album to sell 1 million copies on CD?',
    options: ['Thriller', 'Brothers in Arms', 'Born in the U.S.A.', 'Like a Virgin'],
    correctIndex: 1,
  },
  {
    question: 'Which artist is known as "The Boss"?',
    options: ['Bob Dylan', 'Bruce Springsteen', 'Tom Petty', 'John Mellencamp'],
    correctIndex: 1,
  },
  {
    question: 'What country did the band U2 come from?',
    options: ['England', 'Scotland', 'Ireland', 'Wales'],
    correctIndex: 2,
  },
  {
    question: 'Which song starts with "Is this the real life?"',
    options: ['Stairway to Heaven', 'Bohemian Rhapsody', 'Comfortably Numb', 'Imagine'],
    correctIndex: 1,
  },
  {
    question: 'How many octaves does a standard piano span?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
  },
  {
    question: 'Who composed the "Four Seasons"?',
    options: ['Bach', 'Vivaldi', 'Mozart', 'Handel'],
    correctIndex: 1,
  },
  {
    question: 'Which rapper released "The Marshall Mathers LP"?',
    options: ['50 Cent', 'Dr. Dre', 'Eminem', 'Snoop Dogg'],
    correctIndex: 2,
  },
  {
    question: 'What is the name of Radiohead\'s 1997 landmark album?',
    options: ['The Bends', 'OK Computer', 'Kid A', 'Amnesiac'],
    correctIndex: 1,
  },
  {
    question: 'Which pop star is from Barbados?',
    options: ['Beyonce', 'Nicki Minaj', 'Rihanna', 'Cardi B'],
    correctIndex: 2,
  },
  {
    question: 'What band featured Freddie Mercury as lead singer?',
    options: ['Genesis', 'Queen', 'Def Leppard', 'Kiss'],
    correctIndex: 1,
  },
  {
    question: 'What is the tempo marking for very slow music?',
    options: ['Allegro', 'Adagio', 'Presto', 'Moderato'],
    correctIndex: 1,
  },
  {
    question: 'Which festival is held annually in the Nevada desert?',
    options: ['Coachella', 'Lollapalooza', 'Burning Man', 'Bonnaroo'],
    correctIndex: 2,
  },
  {
    question: 'Who released the album "Purple Rain" in 1984?',
    options: ['David Bowie', 'Prince', 'Stevie Wonder', 'George Michael'],
    correctIndex: 1,
  },
  {
    question: 'What was Whitney Houston\'s biggest hit?',
    options: ['"I Wanna Dance with Somebody"', '"Greatest Love of All"', '"I Will Always Love You"', '"How Will I Know"'],
    correctIndex: 2,
  },
  {
    question: 'Which band performed "Wonderwall"?',
    options: ['Blur', 'Oasis', 'Radiohead', 'Pulp'],
    correctIndex: 1,
  },
  {
    question: 'What year did The Beatles break up?',
    options: ['1968', '1969', '1970', '1971'],
    correctIndex: 2,
  },
  {
    question: 'Which singer is known as the "Material Girl"?',
    options: ['Cyndi Lauper', 'Madonna', 'Cher', 'Debbie Harry'],
    correctIndex: 1,
  },
  {
    question: 'What was the first country to host the Eurovision Song Contest?',
    options: ['France', 'Switzerland', 'Italy', 'Sweden'],
    correctIndex: 1,
  },
  {
    question: 'Which instrument is Charlie Parker famous for playing?',
    options: ['Trumpet', 'Saxophone', 'Clarinet', 'Trombone'],
    correctIndex: 1,
  },
  {
    question: 'What band released "Back in Black" in 1980?',
    options: ['AC/DC', 'Black Sabbath', 'Deep Purple', 'Motorhead'],
    correctIndex: 0,
  },
  {
    question: 'Who is the best-selling solo artist of all time?',
    options: ['Michael Jackson', 'Elvis Presley', 'Elton John', 'Madonna'],
    correctIndex: 1,
  },
  {
    question: 'What does BPM stand for in music?',
    options: ['Bass Per Measure', 'Beats Per Minute', 'Bars Per Movement', 'Bass Per Minute'],
    correctIndex: 1,
  },
  {
    question: 'Which Spice Girl was known as "Scary Spice"?',
    options: ['Victoria Beckham', 'Melanie C', 'Mel B', 'Emma Bunton'],
    correctIndex: 2,
  },
  {
    question: 'What genre is Daft Punk primarily known for?',
    options: ['House', 'Electronic/Dance', 'Techno', 'Drum and Bass'],
    correctIndex: 1,
  },
  {
    question: 'Which female artist released "Bad Guy" in 2019?',
    options: ['Ariana Grande', 'Billie Eilish', 'Lizzo', 'Dua Lipa'],
    correctIndex: 1,
  },
  {
    question: 'What was the name of Bob Marley\'s backing band?',
    options: ['The Skatalites', 'The Wailers', 'Third World', 'Toots and the Maytals'],
    correctIndex: 1,
  },
  {
    question: 'Which artist had a hit with "Shape of You" in 2017?',
    options: ['Justin Bieber', 'Ed Sheeran', 'Sam Smith', 'Shawn Mendes'],
    correctIndex: 1,
  },
  {
    question: 'What is the name of Kanye West\'s debut album?',
    options: ['Graduation', 'Late Registration', 'The College Dropout', '808s & Heartbreak'],
    correctIndex: 2,
  },
  {
    question: 'Which instrument does a concertmaster play in an orchestra?',
    options: ['Cello', 'Viola', 'Violin', 'Flute'],
    correctIndex: 2,
  },
  {
    question: 'Who wrote "Imagine"?',
    options: ['Paul McCartney', 'John Lennon', 'George Harrison', 'Bob Dylan'],
    correctIndex: 1,
  },
  {
    question: 'What was David Bowie\'s alter ego called?',
    options: ['Aladdin Sane', 'Ziggy Stardust', 'The Thin White Duke', 'Major Tom'],
    correctIndex: 1,
  },
  {
    question: 'Which country did K-pop originate from?',
    options: ['Japan', 'China', 'South Korea', 'Thailand'],
    correctIndex: 2,
  },
  {
    question: 'Who sang "Hallelujah" originally?',
    options: ['Jeff Buckley', 'Leonard Cohen', 'Bob Dylan', 'Rufus Wainwright'],
    correctIndex: 1,
  },
  {
    question: 'What does the Italian musical term "forte" mean?',
    options: ['Slow', 'Loud', 'Soft', 'Fast'],
    correctIndex: 1,
  },
  {
    question: 'Which member of Destiny\'s Child went on to the biggest solo career?',
    options: ['Kelly Rowland', 'Beyonce', 'Michelle Williams', 'LeToya Luckett'],
    correctIndex: 1,
  },
  {
    question: 'What year was the electric guitar invented?',
    options: ['1921', '1931', '1941', '1951'],
    correctIndex: 1,
  },
  {
    question: 'Which artist released "Blonde" in 2016?',
    options: ['Kendrick Lamar', 'Frank Ocean', 'Childish Gambino', 'The Weeknd'],
    correctIndex: 1,
  },
  {
    question: 'What city is the Country Music Hall of Fame in?',
    options: ['Memphis', 'Austin', 'Nashville', 'Atlanta'],
    correctIndex: 2,
  },
  {
    question: 'Which band released "Rumours" in 1977?',
    options: ['Fleetwood Mac', 'The Eagles', 'Steely Dan', 'Heart'],
    correctIndex: 0,
  },
  {
    question: 'Who is the lead singer of Coldplay?',
    options: ['Thom Yorke', 'Chris Martin', 'Brandon Flowers', 'Matt Bellamy'],
    correctIndex: 1,
  },
  {
    question: 'What was the first rap song to reach #1 on the Billboard Hot 100?',
    options: ['"Rapper\'s Delight"', '"Walk This Way"', '"Rapture"', '"Ice Ice Baby"'],
    correctIndex: 2,
  },
  {
    question: 'Which composer wrote "The Magic Flute"?',
    options: ['Beethoven', 'Mozart', 'Wagner', 'Verdi'],
    correctIndex: 1,
  },
  {
    question: 'What does "a cappella" mean?',
    options: ['With piano only', 'Without instruments', 'Very fast', 'In a church'],
    correctIndex: 1,
  },
  {
    question: 'Who had a hit with "Uptown Funk" in 2014?',
    options: ['Pharrell Williams', 'Mark Ronson ft. Bruno Mars', 'Justin Timberlake', 'Jason Derulo'],
    correctIndex: 1,
  },
  {
    question: 'Which legendary guitarist was left-handed?',
    options: ['Eric Clapton', 'Jimmy Page', 'Jimi Hendrix', 'Carlos Santana'],
    correctIndex: 2,
  },
  {
    question: 'What is Taylor Swift\'s first album called?',
    options: ['Fearless', 'Speak Now', 'Taylor Swift', 'Red'],
    correctIndex: 2,
  },
  {
    question: 'Which city is associated with grunge music?',
    options: ['Portland', 'Seattle', 'San Francisco', 'Los Angeles'],
    correctIndex: 1,
  },
  {
    question: 'Who composed the music for "The Lion King" (1994)?',
    options: ['Hans Zimmer', 'John Williams', 'Elton John', 'Alan Menken'],
    correctIndex: 2,
  },
  {
    question: 'What was Elvis Presley\'s first #1 hit?',
    options: ['"Jailhouse Rock"', '"Heartbreak Hotel"', '"Hound Dog"', '"Love Me Tender"'],
    correctIndex: 1,
  },
  {
    question: 'Which band features brothers Noel and Liam Gallagher?',
    options: ['Blur', 'The Verve', 'Oasis', 'Arctic Monkeys'],
    correctIndex: 2,
  },
  {
    question: 'What is the lowest-pitched brass instrument in a standard orchestra?',
    options: ['French Horn', 'Trombone', 'Trumpet', 'Tuba'],
    correctIndex: 3,
  },
  {
    question: 'Which rapper is known as "Slim Shady"?',
    options: ['Lil Wayne', 'Eminem', 'Dr. Dre', 'Snoop Dogg'],
    correctIndex: 1,
  },
  {
    question: 'What year was the Walkman portable cassette player released?',
    options: ['1975', '1979', '1983', '1985'],
    correctIndex: 1,
  },
  {
    question: 'Which band sang "Mr. Brightside"?',
    options: ['The Killers', 'Franz Ferdinand', 'Interpol', 'The Strokes'],
    correctIndex: 0,
  },
  {
    question: 'Who is the lead vocalist of Maroon 5?',
    options: ['Adam Levine', 'Patrick Stump', 'Brendon Urie', 'Tyler Joseph'],
    correctIndex: 0,
  },
  {
    question: 'What musical key has no sharps or flats?',
    options: ['G major', 'D major', 'C major', 'F major'],
    correctIndex: 2,
  },
  {
    question: 'Which band released "Wish You Were Here" in 1975?',
    options: ['Led Zeppelin', 'Pink Floyd', 'The Who', 'Yes'],
    correctIndex: 1,
  },
  {
    question: 'Who sang "Rolling in the Deep"?',
    options: ['Amy Winehouse', 'Adele', 'Florence Welch', 'Duffy'],
    correctIndex: 1,
  },
  {
    question: 'What country does BTS come from?',
    options: ['Japan', 'South Korea', 'China', 'Taiwan'],
    correctIndex: 1,
  },
  {
    question: 'Which instrument is Ravi Shankar famous for?',
    options: ['Tabla', 'Sitar', 'Sarod', 'Veena'],
    correctIndex: 1,
  },
  {
    question: 'What does "vinyl" refer to in music?',
    options: ['A type of guitar', 'A record format', 'A music genre', 'A concert venue'],
    correctIndex: 1,
  },
  {
    question: 'Which artist released "Lemonade" and "Renaissance"?',
    options: ['Rihanna', 'Taylor Swift', 'Beyonce', 'Adele'],
    correctIndex: 2,
  },
  {
    question: 'What is the name of the famous opera house in Sydney?',
    options: ['Royal Opera House', 'La Scala', 'Sydney Opera House', 'Metropolitan Opera'],
    correctIndex: 2,
  },
  {
    question: 'Which band performed "Livin\' on a Prayer"?',
    options: ['Def Leppard', 'Bon Jovi', 'Guns N\' Roses', 'Whitesnake'],
    correctIndex: 1,
  },
  {
    question: 'Who produced Michael Jackson\'s "Thriller" album?',
    options: ['Dr. Dre', 'Phil Collins', 'Rick Rubin', 'Quincy Jones'],
    correctIndex: 3,
  },
  {
    question: 'What type of music uses a turntable as an instrument?',
    options: ['Jazz', 'Classical', 'Hip-hop/DJ', 'Country'],
    correctIndex: 2,
  },
  {
    question: 'Which singer\'s real name is Robyn Fenty?',
    options: ['Lady Gaga', 'Rihanna', 'Nicki Minaj', 'Cardi B'],
    correctIndex: 1,
  },
  {
    question: 'What band was Kurt Cobain the frontman of?',
    options: ['Pearl Jam', 'Soundgarden', 'Nirvana', 'Stone Temple Pilots'],
    correctIndex: 2,
  },
  {
    question: 'Which classical period came first?',
    options: ['Romantic', 'Classical', 'Baroque', 'Modern'],
    correctIndex: 2,
  },
  {
    question: 'Who released "To Pimp a Butterfly" in 2015?',
    options: ['J. Cole', 'Drake', 'Kendrick Lamar', 'Kanye West'],
    correctIndex: 2,
  },
  {
    question: 'What is a group of four musicians called?',
    options: ['Trio', 'Quartet', 'Quintet', 'Ensemble'],
    correctIndex: 1,
  },
  {
    question: 'Which 80s band sang "Take On Me"?',
    options: ['Duran Duran', 'Depeche Mode', 'a-ha', 'Tears for Fears'],
    correctIndex: 2,
  },
  {
    question: 'Who wrote "Fur Elise"?',
    options: ['Mozart', 'Chopin', 'Beethoven', 'Liszt'],
    correctIndex: 2,
  },
  {
    question: 'What was Amy Winehouse\'s most famous album?',
    options: ['Frank', 'Back to Black', 'Lioness', 'At the BBC'],
    correctIndex: 1,
  },
  {
    question: 'Which instrument family does the xylophone belong to?',
    options: ['Strings', 'Brass', 'Woodwind', 'Percussion'],
    correctIndex: 3,
  },
  {
    question: 'Who sang "Bohemian Rhapsody"?',
    options: ['David Bowie', 'Freddie Mercury / Queen', 'Elton John', 'Mick Jagger'],
    correctIndex: 1,
  },
  {
    question: 'What year did the iPod first come out?',
    options: ['1999', '2001', '2003', '2005'],
    correctIndex: 1,
  },
  {
    question: 'Which festival is held in Indio, California?',
    options: ['Bonnaroo', 'Lollapalooza', 'Coachella', 'Austin City Limits'],
    correctIndex: 2,
  },
  {
    question: 'What genre is associated with New Orleans?',
    options: ['Country', 'Jazz', 'Grunge', 'Punk'],
    correctIndex: 1,
  },
  {
    question: 'Who is Drake\'s musical mentor?',
    options: ['Jay-Z', 'Kanye West', 'Lil Wayne', 'Diddy'],
    correctIndex: 2,
  },
  {
    question: 'What instrument does Kenny G play?',
    options: ['Trumpet', 'Clarinet', 'Saxophone', 'Flute'],
    correctIndex: 2,
  },
  {
    question: 'Which rock band was originally called "Smile"?',
    options: ['Led Zeppelin', 'Queen', 'Aerosmith', 'The Police'],
    correctIndex: 1,
  },
  {
    question: 'Who had a hit with "Jolene" in 1973?',
    options: ['Loretta Lynn', 'Dolly Parton', 'Tammy Wynette', 'Patsy Cline'],
    correctIndex: 1,
  },
  {
    question: 'What is the Italian word for "soft" in music?',
    options: ['Forte', 'Allegro', 'Piano', 'Vivace'],
    correctIndex: 2,
  },
  {
    question: 'Which band released "OK Computer" and "In Rainbows"?',
    options: ['Muse', 'Radiohead', 'Coldplay', 'Arcade Fire'],
    correctIndex: 1,
  },
  {
    question: 'Who sang "Tiny Dancer"?',
    options: ['Billy Joel', 'Elton John', 'Rod Stewart', 'Phil Collins'],
    correctIndex: 1,
  },
  {
    question: 'What is Auto-Tune primarily used for?',
    options: ['Adjusting tempo', 'Pitch correction', 'Adding reverb', 'Mixing tracks'],
    correctIndex: 1,
  },
  {
    question: 'Which rapper released "Illmatic" in 1994?',
    options: ['Nas', 'Tupac', 'Biggie', 'Wu-Tang Clan'],
    correctIndex: 0,
  },
  {
    question: 'What band features The Edge on guitar?',
    options: ['Coldplay', 'The Cure', 'U2', 'REM'],
    correctIndex: 2,
  },
  {
    question: 'Which pop star had "The Eras Tour"?',
    options: ['Beyonce', 'Taylor Swift', 'Adele', 'Lady Gaga'],
    correctIndex: 1,
  },
  {
    question: 'What is a capriccio in music?',
    options: ['A slow ballad', 'A lively, free-form piece', 'A type of drum', 'A singing technique'],
    correctIndex: 1,
  },
  {
    question: 'Which band sang "Creep" in 1993?',
    options: ['Radiohead', 'Stone Temple Pilots', 'TLC', 'Blind Melon'],
    correctIndex: 0,
  },
  {
    question: 'What style of music did Bob Marley popularize worldwide?',
    options: ['Ska', 'Calypso', 'Reggae', 'Soca'],
    correctIndex: 2,
  },
  {
    question: 'Who composed "Swan Lake"?',
    options: ['Stravinsky', 'Prokofiev', 'Tchaikovsky', 'Rachmaninoff'],
    correctIndex: 2,
  },
  {
    question: 'What was the first album ever released on CD?',
    options: ['The Visitors - ABBA', '52nd Street - Billy Joel', 'Thriller - Michael Jackson', 'Born in the U.S.A.'],
    correctIndex: 1,
  },
  {
    question: 'Which country is flamenco music from?',
    options: ['Portugal', 'Mexico', 'Italy', 'Spain'],
    correctIndex: 3,
  },
  {
    question: 'Who sang "No Woman, No Cry"?',
    options: ['Jimmy Cliff', 'Bob Marley', 'Peter Tosh', 'Burning Spear'],
    correctIndex: 1,
  },
  {
    question: 'What year was Live Aid held?',
    options: ['1983', '1985', '1987', '1989'],
    correctIndex: 1,
  },
  {
    question: 'Which artist released "After Hours" in 2020?',
    options: ['Post Malone', 'The Weeknd', 'Dua Lipa', 'Bad Bunny'],
    correctIndex: 1,
  },
  {
    question: 'What instrument does a timpanist play?',
    options: ['Cymbals', 'Snare drum', 'Kettledrums', 'Bass drum'],
    correctIndex: 2,
  },
  {
    question: 'Which band had a hit with "Clocks" in 2002?',
    options: ['Keane', 'Coldplay', 'Snow Patrol', 'Travis'],
    correctIndex: 1,
  },
  {
    question: 'Who is known as "The Godfather of Soul"?',
    options: ['Ray Charles', 'James Brown', 'Marvin Gaye', 'Sam Cooke'],
    correctIndex: 1,
  },
  {
    question: 'What is the standard tuning of a ukulele?',
    options: ['EADG', 'GCEA', 'DGBE', 'AECG'],
    correctIndex: 1,
  },
  {
    question: 'Which duo released "Daft Punk Is Playing at My House"?',
    options: ['Daft Punk', 'LCD Soundsystem', 'Justice', 'Chromeo'],
    correctIndex: 1,
  },
  {
    question: 'What genre did The Ramones help pioneer?',
    options: ['Heavy Metal', 'Punk Rock', 'New Wave', 'Grunge'],
    correctIndex: 1,
  },
  {
    question: 'Which singer performed "Wrecking Ball" in 2013?',
    options: ['Katy Perry', 'Miley Cyrus', 'Selena Gomez', 'Demi Lovato'],
    correctIndex: 1,
  },
  {
    question: 'What was the best-selling album of the 2000s decade?',
    options: ['Back to Black', 'The Eminem Show', '21', 'Hybrid Theory'],
    correctIndex: 2,
  },

  // --- LYRICS: "Finish the lyric" / "Which song?" ---
  {
    question: 'Finish the lyric: "Is this the real life? Is this just..."',
    options: ['a dream?', 'fantasy?', 'an illusion?', 'insanity?'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Which song starts with: "Hello, it\'s me"?',
    options: ['"Hello" - Lionel Richie', '"Hello" - Adele', '"Hey Jude" - The Beatles', '"Hey Ya!" - OutKast'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Finish the lyric: "Just a small town girl, livin\' in a..."',
    options: ['big city world', 'lonely world', 'crazy world', 'material world'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: '"We will, we will..." what comes next?',
    options: ['Win!', 'Rock you!', 'Fight!', 'Shine!'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Which song contains: "Ground control to Major Tom"?',
    options: ['"Rocket Man"', '"Starman"', '"Space Oddity"', '"Life on Mars?"'],
    correctIndex: 2,
    category: 'lyrics',
  },
  {
    question: 'Finish the lyric: "I got my mind set on you, I got my mind..."',
    options: ['set on you', 'made up too', 'open wide', 'blown away'],
    correctIndex: 0,
    category: 'lyrics',
  },
  {
    question: '"Tonight we are young, so let\'s set the world on..." what?',
    options: ['Ice', 'Fire', 'Edge', 'Repeat'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Which song has the lyric: "I\'m a creep, I\'m a weirdo"?',
    options: ['"Loser" - Beck', '"Creep" - Radiohead', '"Freak on a Leash" - Korn', '"Paranoid Android" - Radiohead'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Finish the lyric: "I will always..."',
    options: ['be there', 'remember you', 'love you', 'need you'],
    correctIndex: 2,
    category: 'lyrics',
  },
  {
    question: '"Mama, just killed a man..." is from which song?',
    options: ['"Stairway to Heaven"', '"Hotel California"', '"Bohemian Rhapsody"', '"Free Bird"'],
    correctIndex: 2,
    category: 'lyrics',
  },
  {
    question: 'Which song starts with: "I see a red door and I want it painted..."?',
    options: ['"Black" - Pearl Jam', '"Back in Black" - AC/DC', '"Paint It Black" - Rolling Stones', '"Blackbird" - Beatles'],
    correctIndex: 2,
    category: 'lyrics',
  },
  {
    question: 'Finish the lyric: "Every breath you take, every move you..."',
    options: ['break', 'fake', 'make', 'shake'],
    correctIndex: 2,
    category: 'lyrics',
  },
  {
    question: '"I\'m walking on sunshine" — who sang it?',
    options: ['Cyndi Lauper', 'Katrina and the Waves', 'Belinda Carlisle', 'The Bangles'],
    correctIndex: 1,
    category: 'lyrics',
  },
  {
    question: 'Finish the lyric: "Don\'t stop believin\', hold on to that..."',
    options: ['dream', 'feeling', 'moment', 'love'],
    correctIndex: 1,
    category: 'lyrics',
  },

  // --- WHICH CAME FIRST? ---
  {
    question: 'Which was released first?',
    options: ['"Thriller" (1982)', '"Purple Rain" (1984)', '"Born in the U.S.A." (1984)', '"Like a Virgin" (1984)'],
    correctIndex: 0,
    category: 'first',
  },
  {
    question: 'Which band formed first?',
    options: ['Nirvana (1987)', 'Pearl Jam (1990)', 'Radiohead (1985)', 'Green Day (1987)'],
    correctIndex: 2,
    category: 'first',
  },
  {
    question: 'Which technology came first?',
    options: ['Compact Disc (1982)', 'MP3 format (1993)', 'Napster (1999)', 'iTunes Store (2003)'],
    correctIndex: 0,
    category: 'first',
  },
  {
    question: 'Which of these songs was released first?',
    options: ['"Smells Like Teen Spirit" (1991)', '"Wonderwall" (1995)', '"Losing My Religion" (1991)', '"Creep" (1992)'],
    correctIndex: 0,
    category: 'first',
  },
  {
    question: 'Which festival started first?',
    options: ['Glastonbury (1970)', 'Coachella (1999)', 'Lollapalooza (1991)', 'Bonnaroo (2002)'],
    correctIndex: 0,
    category: 'first',
  },
  {
    question: 'Which debut album came first?',
    options: ['The College Dropout (2004)', 'Back to Black (2006)', 'Born This Way (2011)', 'Channel Orange (2012)'],
    correctIndex: 0,
    category: 'first',
  },
  {
    question: 'Which music event happened first?',
    options: ['Woodstock (1969)', 'Live Aid (1985)', 'MTV launch (1981)', 'First Grammy Awards (1959)'],
    correctIndex: 3,
    category: 'first',
  },
  {
    question: 'Which streaming service launched first?',
    options: ['Spotify (2008)', 'Apple Music (2015)', 'Tidal (2014)', 'Pandora (2005)'],
    correctIndex: 3,
    category: 'first',
  },

  // --- TRUE OR FALSE (as 4-option) ---
  {
    question: '"Stairway to Heaven" was never released as a single. True or false?',
    options: ['True — it was never a single', 'False — it was a huge single', 'True — but only in the UK', 'False — it was a B-side'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'Mozart was buried in a mass grave. True or false?',
    options: ['True', 'False — he had a grand funeral', 'False — he was cremated', 'True — but only temporarily'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'The longest song to reach #1 on Billboard was over 8 minutes. True or false?',
    options: ['True — "American Pie"', 'True — "Bohemian Rhapsody"', 'False — no #1 was over 6 min', 'True — "Hey Jude"'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'Jimi Hendrix, Janis Joplin, and Jim Morrison all died at age 27. True or false?',
    options: ['True', 'False — only Hendrix was 27', 'False — Morrison was 28', 'True — but only two of them'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'Beethoven dedicated his 3rd Symphony to Napoleon. True or false?',
    options: ['True — and later removed the dedication', 'False — it was for a king', 'False — it had no dedication', 'True — it was never changed'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'The saxophone is classified as a brass instrument. True or false?',
    options: ['True — it\'s made of brass', 'False — it\'s a woodwind', 'True — brass family', 'False — it\'s a hybrid'],
    correctIndex: 1,
    category: 'true_false',
  },
  {
    question: '"Happy Birthday" was under copyright until 2015. True or false?',
    options: ['True', 'False — it was always public domain', 'False — copyright ended in 1990', 'True — but only in Europe'],
    correctIndex: 0,
    category: 'true_false',
  },
  {
    question: 'Vinyl records spin at 33 or 45 RPM. True or false?',
    options: ['True — those are the standard speeds', 'False — they spin at 78 RPM only', 'False — all records are 33 RPM', 'True — but also 78 RPM for early records'],
    correctIndex: 3,
    category: 'true_false',
  },

  // --- NAME THE DECADE ---
  {
    question: 'In which decade did disco music peak?',
    options: ['1960s', '1970s', '1980s', '1990s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'When did electronic dance music (EDM) go mainstream?',
    options: ['1990s', '2000s', '2010s', '1980s'],
    correctIndex: 2,
    category: 'decades',
  },
  {
    question: 'In which decade was Auto-Tune first used in a hit song?',
    options: ['1980s', '1990s', '2000s', '2010s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'When did the "British Invasion" of American pop charts happen?',
    options: ['1950s', '1960s', '1970s', '1980s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'In which decade did MTV launch?',
    options: ['1970s', '1980s', '1990s', '2000s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'When did grunge music dominate the charts?',
    options: ['1980s', 'Early 1990s', 'Late 1990s', '2000s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'In which decade did Motown Records have its greatest success?',
    options: ['1950s', '1960s', '1970s', '1980s'],
    correctIndex: 1,
    category: 'decades',
  },
  {
    question: 'When was the golden age of jazz?',
    options: ['1900s-1910s', '1920s-1930s', '1940s-1960s', '1970s-1980s'],
    correctIndex: 2,
    category: 'decades',
  },

  // --- INSTRUMENTS ---
  {
    question: 'How many strings does a standard bass guitar have?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    category: 'instruments',
  },
  {
    question: 'Which of these is NOT a percussion instrument?',
    options: ['Marimba', 'Timpani', 'Oboe', 'Triangle'],
    correctIndex: 2,
    category: 'instruments',
  },
  {
    question: 'What is the smallest instrument in the string family?',
    options: ['Viola', 'Violin', 'Cello', 'Ukulele'],
    correctIndex: 1,
    category: 'instruments',
  },
  {
    question: 'A Hammond B3 is a type of what instrument?',
    options: ['Guitar', 'Organ', 'Synthesizer', 'Piano'],
    correctIndex: 1,
    category: 'instruments',
  },
  {
    question: 'How many valves does a standard trumpet have?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    category: 'instruments',
  },
  {
    question: 'What instrument is a "Rhodes"?',
    options: ['Electric piano', 'Electric guitar', 'Drum machine', 'Synthesizer'],
    correctIndex: 0,
    category: 'instruments',
  },
  {
    question: 'Which of these is a double-reed instrument?',
    options: ['Clarinet', 'Flute', 'Oboe', 'Saxophone'],
    correctIndex: 2,
    category: 'instruments',
  },
  {
    question: 'A "hi-hat" is part of what instrument?',
    options: ['Guitar', 'Piano', 'Drum kit', 'Organ'],
    correctIndex: 2,
    category: 'instruments',
  },

  // --- ORIGINS & GEOGRAPHY ---
  {
    question: 'Where did bossa nova music originate?',
    options: ['Cuba', 'Argentina', 'Brazil', 'Portugal'],
    correctIndex: 2,
    category: 'origins',
  },
  {
    question: 'Which city is considered the birthplace of jazz?',
    options: ['Chicago', 'Memphis', 'New York', 'New Orleans'],
    correctIndex: 3,
    category: 'origins',
  },
  {
    question: 'Tango music originated in which country?',
    options: ['Spain', 'Brazil', 'Argentina', 'Mexico'],
    correctIndex: 2,
    category: 'origins',
  },
  {
    question: 'Where did techno music originate?',
    options: ['Berlin, Germany', 'Detroit, USA', 'London, UK', 'Ibiza, Spain'],
    correctIndex: 1,
    category: 'origins',
  },
  {
    question: 'Which country is the didgeridoo from?',
    options: ['New Zealand', 'South Africa', 'Australia', 'Papua New Guinea'],
    correctIndex: 2,
    category: 'origins',
  },
  {
    question: 'Where did the blues originate?',
    options: ['Chicago', 'Mississippi Delta', 'Memphis', 'Nashville'],
    correctIndex: 1,
    category: 'origins',
  },
  {
    question: 'Afrobeats music is primarily from which region?',
    options: ['South Africa', 'West Africa (Nigeria/Ghana)', 'East Africa', 'Caribbean'],
    correctIndex: 1,
    category: 'origins',
  },
  {
    question: 'Where was the accordion invented?',
    options: ['Italy', 'France', 'Austria', 'Germany'],
    correctIndex: 2,
    category: 'origins',
  },
];
