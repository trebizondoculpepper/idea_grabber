"""Rebuild the selected browser clips from the credited sources; requires ffmpeg."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "assets/audio/sources"
DESTINATION = ROOT / "public/audio/sfx"
DESTINATION.mkdir(parents=True, exist_ok=True)

# cue, source pack, original filename, start seconds, duration, pitch/speed multiplier
clips = [
    ("coin", "kenney-casino-audio", "Audio/chips-collide-1.ogg", 0, 0.4, 1.2),
    ("grip", "kenney-interface-sounds", "Audio/switch_002.ogg", 0, 0.3, 1),
    ("release", "kenney-interface-sounds", "Audio/switch_003.ogg", 0, 0.3, 1),
    ("drop", "kenney-impact-sounds", "Audio/impactWood_light_000.ogg", 0, 0.4, 0.85),
    ("rack-1", "kenney-casino-audio", "Audio/chip-lay-1.ogg", 0, 0.35, 1),
    ("rack-2", "kenney-casino-audio", "Audio/chip-lay-2.ogg", 0, 0.35, 1),
    ("plop", "kenney-impact-sounds", "Audio/impactGeneric_light_000.ogg", 0, 0.4, 0.7),
    ("step-1", "kenney-impact-sounds", "Audio/footstep_wood_000.ogg", 0, 0.3, 1.3),
    ("step-2", "kenney-impact-sounds", "Audio/footstep_wood_001.ogg", 0, 0.3, 1.3),
    ("click", "kenney-interface-sounds", "Audio/click_001.ogg", 0, 0.25, 1),
    ("jump", "kenney-interface-sounds", "Audio/select_004.ogg", 0, 0.4, 1.2),
    ("puff", "kenney-interface-sounds", "Audio/scratch_001.ogg", 0, 0.25, 0.9),
    ("eject", "kenney-interface-sounds", "Audio/scroll_001.ogg", 0, 0.4, 0.75),
    ("motor", "kenney-sci-fi-sounds", "Audio/engineCircular_000.ogg", 1, 2, 1),
    ("hum", "kenney-sci-fi-sounds", "Audio/spaceEngineLow_000.ogg", 1, 2, 1),
    ("rolling", "juandresound-marble-roll", "marble-roll-preview.mp3", 5, 2, 0.9),
]
for voice, starts, speed in [
    ("coinie", [0.3, 0.8, 1.35, 2.2], 1.35),
    ("bulbee", [4.6, 5.3, 6, 7], 0.85),
]:
    for i, start in enumerate(starts, 1):
        clips.append((f"{voice}-{i}", "tcarisland-talking-synthesizer",
                      "talkingsynth.wav", start, 0.19, speed))

manifest = []
for cue, pack, filename, start, duration, speed in clips:
    source = SOURCES / pack / filename
    metadata = json.loads((SOURCES / pack / "SOURCE.json").read_text())
    length = duration / speed
    filters = (f"aresample=44100,asetrate={round(44100 * speed)},aresample=44100,"
               f"afade=t=in:d=0.008,afade=t=out:st={max(0, length - 0.025)}:d=0.025")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start),
                    "-t", str(duration), "-i", str(source), "-af", filters,
                    "-ac", "1", "-ar", "44100", "-b:a", "96k",
                    str(DESTINATION / f"{cue}.mp3")], check=True)
    manifest.append({"file": f"{cue}.mp3", "source_pack": pack,
                     "original_file": filename, "creator": metadata["author"],
                     "source": metadata["source"], "license": metadata["license"],
                     "edits": {"start_seconds": start, "duration_seconds": duration,
                               "pitch_and_speed": speed, "filters": filters,
                               "encoding": "mono 44.1 kHz MP3, 96 kbps"}})

(DESTINATION / "sources.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(f"Prepared {len(manifest)} sound clips in {DESTINATION}")
