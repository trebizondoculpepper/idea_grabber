/** Compose a square PNG with the actual scene and a readable speech bubble. */
export function drawShareImage(
  scene: HTMLCanvasElement,
  bubble: string,
  idea: string,
) {
  const card = document.createElement('canvas');
  card.width = card.height = 1080;
  const ctx = card.getContext('2d')!;
  ctx.fillStyle = '#171023';
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scene, 0, 180, 1080, 810);
  ctx.font = 'bold 44px system-ui, sans-serif';
  const lines: string[] = [];
  let line = '';
  for (const word of bubble.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > 950 && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) lines.push(line);
  // Up to five rack genres fit without clipping; scale long speech to fit the bubble.
  const fontSize = Math.min(44, 110 / Math.max(lines.length, 1));
  ctx.fillStyle = '#ffdf20';
  ctx.strokeStyle = '#20dccc';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(32, 20, 1016, 148, 24);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(180, 168);
  ctx.lineTo(215, 196);
  ctx.lineTo(235, 168);
  ctx.fill();
  ctx.fillStyle = '#171023';
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  lines.forEach((text, i) =>
    ctx.fillText(text, 60, 30 + fontSize + i * fontSize * 1.15),
  );
  ctx.fillStyle = '#ffdf20';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('IDEA GRABBER · idea-grabber.fly.dev', 32, 1024);
  ctx.fillStyle = '#fff9e4';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(idea, 32, 1059, 1016);
  return card;
}
