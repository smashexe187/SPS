"""Render the ShopGuide launch film.

  python render.py stills  OUTDIR t1 t2 ...      single frames at given seconds
  python render.py beats   OUTDIR [offset]       one frame per beat + contact sheet
  python render.py audio   OUT.wav               soundtrack (OfflineAudioContext)
  python render.py frames  OUTDIR first last     60 fps, 3 subframes per frame
  python render.py encode  FRAMESDIR WAV OUT.mp4 tmix motion blur + audio mux

Needs: pip install playwright imageio-ffmpeg (uses the installed Chrome).
"""
import base64
import os
import subprocess
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
URL = 'file:///' + os.path.join(HERE, 'shopguide-film.html').replace('\\', '/')
FPS, DUR, SUB = 60, 15.0, 3
BEAT = 0.5


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def page_session(p):
    browser = p.chromium.launch(channel='chrome')
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.on('console', lambda m: m.type in ('error', 'warning') and print('[page]', m.type, m.text))
    page.on('pageerror', lambda e: print('[pageerror]', e))
    page.goto(URL)
    page.wait_for_function('window.__ready === true', timeout=30000)
    return browser, page


def shot(page, t, path):
    page.evaluate(f'window.seek({t:.6f})')
    page.screenshot(path=path, type='png')


def main():
    mode = sys.argv[1]
    if mode == 'encode':
        frames, wav, mp4 = sys.argv[2:5]
        vf = 'tmix=frames=3:weights=1 1 1,select=eq(mod(n\\,3)\\,2),setpts=N/(60*TB)'
        cmd = [ffmpeg(), '-y', '-v', 'error', '-framerate', str(FPS * SUB), '-i', os.path.join(frames, 's%05d.png'),
               '-i', wav, '-vf', vf, '-r', str(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14',
               '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '256k', '-shortest', mp4]
        subprocess.run(cmd, check=True)
        print('wrote', mp4)
        return

    with sync_playwright() as p:
        browser, page = page_session(p)
        if mode == 'stills':
            out = sys.argv[2]; os.makedirs(out, exist_ok=True)
            for t in sys.argv[3:]:
                shot(page, float(t), os.path.join(out, f't{float(t):06.3f}.png'))
        elif mode == 'beats':
            out = sys.argv[2]; os.makedirs(out, exist_ok=True)
            off = float(sys.argv[3]) if len(sys.argv) > 3 else 0.2
            for b in range(30):
                shot(page, b * BEAT + off, os.path.join(out, f'b{b:02d}.png'))
            sheet = os.path.join(out, 'sheet.png')
            subprocess.run([ffmpeg(), '-y', '-v', 'error', '-i', os.path.join(out, 'b%02d.png'),
                            '-vf', 'scale=480:270,tile=5x6:padding=6:color=white', '-frames:v', '1', sheet], check=True)
            print('sheet', sheet)
        elif mode == 'audio':
            data = page.evaluate('window.renderAudio()')
            with open(sys.argv[2], 'wb') as f:
                f.write(base64.b64decode(data))
            print('wrote', sys.argv[2])
        elif mode == 'frames':
            out = sys.argv[2]; os.makedirs(out, exist_ok=True)
            first, last = int(sys.argv[3]), int(sys.argv[4])
            for f in range(first, last):
                for s in range(SUB):
                    # 180° shutter: three samples across the middle half of the frame
                    t = min(DUR - 1e-4, max(0.0, (f + (s - 1) * 0.25) / FPS))
                    shot(page, t, os.path.join(out, f's{f * SUB + s:05d}.png'))
                if f % 60 == 0:
                    print('frame', f, flush=True)
        browser.close()


if __name__ == '__main__':
    main()
