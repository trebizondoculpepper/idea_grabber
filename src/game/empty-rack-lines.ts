const games = [
  'Minecraft',
  'Tetris',
  'Doom',
  'Stardew Valley',
  'Balatro',
  'Portal',
  'Half-Life',
  'The Sims',
  'Animal Crossing',
  'Vampire Survivors',
  'Hades',
  'Pong',
];

export const emptyRackLines = [
  'All the games have already been done. Even the ones nobody wanted.',
  'Games are so original. Especially the sequels to the remakes.',
  "We've hit a wall. Can we put a crafting system on it?",
  'We need the next new {game}. Preferably by Friday.',
  'What if we made {game}, but called it something else?',
  "I've got nothing. Does nothing count as a genre?",
  'My last original idea turned out to be a tutorial.',
  'The rack is empty. So is our development roadmap.',
  'Maybe the real game was the pitch deck we made along the way.',
  'Could we remaster an idea we never actually had?',
  "I'm having a creative block. It has a season pass.",
  'We need a breakthrough. Or a really convincing trailer.',
  'What if we made {game}, but the player has a job?',
  'Every good idea is taken. The bad ones have publishers.',
  'How many genres can you invent before lunch? Asking for an investor.',
  'We could always announce {game} 2 and work backwards.',
  'I had an idea, but someone released it in 1987.',
  'Our unique selling point is currently a blank space.',
  "Let's brainstorm. So far it's mostly drizzle.",
  'Even my imagination is asking for a refund.',
  "We could make {game}, but smaller. Much smaller. We've got no budget.",
  'The next big thing is apparently another tiny thing with a battle pass.',
  'Maybe inspiration is still downloading.',
  "I've tried thinking outside the box. There's nothing out there either.",
  'We have enough ideas for a loading screen.',
  'Can we call this creative drought a live-service experience?',
  'Surely nobody has made {game} with fishing yet. Oh. They have.',
  'We need one original idea. The marketing department needs twelve.',
];

/** Use every complaint before repeating; game names are filled when spoken. */
export function createEmptyRackLines(random = Math.random) {
  let bag: string[] = [];
  let previous = '';
  return () => {
    if (!bag.length) {
      bag = [...emptyRackLines];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === previous)
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    previous = bag.pop()!;
    return previous.replace(
      '{game}',
      games[Math.floor(random() * games.length)],
    );
  };
}
