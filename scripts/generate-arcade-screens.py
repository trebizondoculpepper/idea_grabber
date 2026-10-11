"""Create second-stage and attract-mode screens from our original arcade artwork."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / 'public/assets/arcade'
GAMES = {
    'silver-axe': ('SILVER AXE', '#ffb52e', 'STAGE 2', ['AXE', 'ELF', 'ORC']),
    'lbert': ('L-BERT', '#ff38a8', 'LEVEL 2', ['LBT', 'HOP', 'POP']),
    'vlogger': ('VLOGGER', '#ff545e', 'VIRAL UPLOAD', ['PIX', 'VIR', 'LOL']),
    'invoicers': ('SPACE INVOICERS', '#56edb2', 'WAVE 2', ['VAT', 'TAX', 'PAY']),
    'snackman': ('SNACK-MAN', '#ffdf20', 'LEVEL 2', ['YUM', 'NOM', 'BUN']),
    'bonkey-kung': ('BONKEY KUNG', '#ff545e', 'ROUND 2', ['BNK', 'APE', 'BAN']),
    'hasteroids': ('HASTEROIDS', '#fff9e4', 'SECTOR 2', ['HST', 'ROK', 'ZIP']),
    'mortgage-kombat': ('MORTGAGE KOMBAT', '#39c3ff', 'ROUND 2', ['APR', 'FIX', 'LET']),
}

def text(y, content, color='#fff9e4', size=16):
    return f'<text x="128" y="{y}" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="{size}" fill="{color}">{content}</text>'

for game, (title, color, stage, initials) in GAMES.items():
    original = (ROOT / f'{game}-screen.svg').read_text()
    # New stages retain each game's recognisable sprites and change their playfield.
    body = original[original.index('>') + 1:original.rindex('</svg>')]
    body = re.sub(r'<text\b[^>]*>[^<]*(?:SCORE|STAGE)[^<]*</text>', '', body)
    if game == 'silver-axe':
        body = body.replace('translate(96 140)', 'translate(138 140)').replace('#ff545e', '#398aff')
        body += '<path d="M28 198l8-45 24 8 18 34-23-9-12 12z" fill="#69e649" stroke="#171023" stroke-width="4"/><circle cx="46" cy="164" r="4" fill="#ffdf20"/>'
    elif game == 'lbert':
        body = body.replace('#ff38a8', '#20dccc').replace('translate(128', 'translate(88')
    elif game == 'vlogger':
        body = body.replace('LIVE VIEWERS: 1,284', 'YOUTUBE VIEWS: 985K').replace('ON AIR', 'VIRAL!').replace('#20dccc', '#ffdf20')
    elif game == 'invoicers':
        body = body.replace('x="24" y="30"', 'x="16" y="42"').replace('x="116" y="30"', 'x="110" y="100"').replace('x="184" y="76"', 'x="184" y="112"')
        body += '<path d="M188 162v20M64 120v18" stroke="#ff545e" stroke-width="4"/>'
    elif game == 'snackman':
        body = body.replace('translate(-48 0)', 'translate(44 0)').replace('translate(-20 0)', 'translate(-70 0)').replace('#398aff', '#ae8dd9')
        body += '<circle cx="32" cy="210" r="9" fill="#ffdf20"/>'
    elif game == 'bonkey-kung':
        body = body.replace('translate(120 218)', 'translate(190 151)').replace('cx="130" cy="108"', 'cx="190" cy="115"').replace('cx="90" cy="164"', 'cx="65" cy="170"')
        body += '<ellipse cx="160" cy="223" rx="10" ry="8" fill="#8a6328" stroke="#ffdf20" stroke-width="2"/>'
    elif game == 'hasteroids':
        body = f'<g transform="rotate(42 128 128)">{body}</g><path d="M72 82l12-8M54 94l8-6" stroke="#fff9e4" stroke-width="3"/>'
    elif game == 'mortgage-kombat':
        body = body.replace('translate(76 160)', 'translate(102 160)').replace('translate(184 160)', 'translate(160 160)').replace('width="96"', 'width="40"')
        body += '<path d="M124 139l12-16-2 16 18 3-16 6 3 17-12-13-14 5 7-13-11-11z" fill="#fff9e4"/>'
    header = f'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">'
    hud = '<rect width="256" height="26" fill="#0b0618"/>' + text(18, stage + '  01280', color, 14)
    (ROOT / f'{game}-screen-2.svg').write_text(header + body + hud + '</svg>\n')
    # An attract screen with an actual miniature of this particular game.
    thumbnail = f'<svg x="82" y="59" width="92" height="92" viewBox="0 0 256 256">{original[original.index(">")+1:original.rindex("</svg>")]}</svg>'
    score = header + '<rect width="256" height="256" fill="#0b0618"/>'
    score += f'<rect x="6" y="6" width="244" height="244" rx="6" fill="none" stroke="{color}" stroke-width="3"/>'
    score += text(30, title, color, 18 if len(title) < 14 else 15) + text(49, 'TOP CREATORS' if game == 'vlogger' else 'HIGH SCORES', '#fff9e4', 13) + thumbnail
    for rank, name in enumerate(initials):
        score += text(174 + rank * 20, (f'{rank+1} {name} {985-rank*172}K VIEWS' if game == 'vlogger' else f'{rank+1}  {name}  {98500-rank*17250:06}'), color if rank == 0 else '#fff9e4', 16)
    score += text(239, 'INSERT COIN', '#ffdf20', 14) + '</svg>\n'
    (ROOT / f'{game}-scores.svg').write_text(score)
