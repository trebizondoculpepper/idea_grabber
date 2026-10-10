export const coinieLines = [
  "One more go! I've got a good feeling about this!",
  'Come on, one tiny coin and one BIG idea!',
  "Hey, hey! Let's spend a little more and dream a little bigger!",
  "Another go? This machine's full of possibilities!",
  "Just one more coin! Let's see what pops out!",
  "I'm back, baby! Fancy another fabulous idea?",
  'A little more pocket change, a whole lot more imagination!',
  "One more spin of the idea machine! Who's with me?",
  "C'mon! Let's give that grabber another go!",
  'Got room for one more wild idea? Pop me in!',
  "Let's make it weirder! One more coin oughta do it!",
  'Another coin, another glorious game idea!',
  'Oooh, I can feel a good one coming! One more go!',
  "Don't leave me hanging! Let's try another coin!",
  "I'm positively jingling with excitement! Shall we go again?",
  'Just a little more! That next ball looks promising!',
  'One small coin for you, one giant idea for game-kind!',
  "Round two? Round twenty? I'm ready for another go!",
  'Your next brilliant idea is only a coin away!',
  "Let's keep this colourful nonsense rolling! One more go!",
];

// A shuffled bag uses every line before repeating, with no repeat across bags.
export function createCoinieLines(random = Math.random) {
  let bag: string[] = [];
  let previous = '';
  return () => {
    if (!bag.length) {
      bag = [...coinieLines];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === previous)
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    previous = bag.pop()!;
    return previous;
  };
}
