from PIL import Image, ImageChops
from wand import image
import os

SD_IN_W = 64
SD_IN_H = 64
HD_IN_W = 256
HD_IN_H = 256

SD_OUT_W = 128
SD_OUT_H = 128
HD_OUT_W = 256
HD_OUT_H = 256

TILE_TS_HEADER = '''
import { getFileDir, Import } from "../../../../../Utils"

const __dir__ = Macro(getFileDir())
const dst = Macro(__dir__.substr((<string>GetSrc()).length)) + '/'
const src = Macro(__dir__ + '/')

export let Tile: string[] = []'''

SET_TS_HEADER = ''''''

def crop(mode, tileset, tile):
    dir = '.\\' + mode + '\\' + tileset + '\\' + tile + '\\'
    os.makedirs(dir, exist_ok=True)

    atlas_name = tileset + '_' + tile + ('_diffuse.dds' if mode == 'HD' else '.dds')

    IN_W = HD_IN_W if mode == 'HD' else SD_IN_W
    IN_H = HD_IN_H if mode == 'HD' else SD_IN_H
    OUT_W = HD_OUT_W if mode == 'HD' else SD_OUT_W
    OUT_H = HD_OUT_H if mode == 'HD' else SD_OUT_H

    atlas = Image.open('./Original/' + atlas_name)
    ts_file_context = TILE_TS_HEADER

    max_x = int(atlas.size[0] / IN_W)
    max_y = int(atlas.size[1] / IN_H)

    background = atlas.crop((0, 0, IN_W, IN_H))
    croped_back = background.resize((OUT_W - 2, OUT_H - 2))
    alpha = Image.new('RGBA', croped_back.size, (255, 255, 255, 1))
    croped_back = ImageChops.multiply(croped_back, alpha)

    for x in range(max_x):
        for y in range(max_y):
            croped = atlas.crop((x * IN_W, y * IN_H, (x + 1) * IN_W, (y + 1) * IN_H))
            alpha = Image.new('RGBA', croped.size, (255, 255, 255, 254))
            croped = ImageChops.multiply(croped, alpha)

            back = Image.new('RGBA', (OUT_W, OUT_H), 0)
            back.paste(croped_back, (1, 1))

            front = Image.new('RGBA', (OUT_W, OUT_H), 0)
            front.paste(croped.resize((int(OUT_W / 2), int(OUT_H / 2))), (int(OUT_W / 4), int(OUT_H / 4)))

            im = Image.alpha_composite(back, front)

            name = '%02dx%02d' % (x, y)
            path = dir + name + '.tga'

            im.save(path)

            dds = image.Image(filename=path)
            dds.compression = 'dxt5'
            dds.save(filename=dir + name + '.dds')
            ts_file_context += '\nTile.push((new Import(src + \'' + name + '.dds\', dst + \'' + name + '.dds\')).dst)'

            os.remove(path)

    ts_file = open(dir + 'index.ts', 'w')
    ts_file.write(ts_file_context)
    ts_file.close()
    print(dir)

if __name__ == '__main__':
    all_files = os.listdir('./Original')
    for path in all_files:
        if (not path.endswith('.dds')):
            continue

        p = (path[0: -4]).split('\\')
        name = p[len(p) - 1]

        parts = name.split('_')
        mode = 'HD' if len(parts) > 2 and parts[2] == 'diffuse' else 'SD'
        tileset = parts[0]
        tile = parts[1]

        crop(mode, tileset, tile)

    sd_ctx = ''
    hd_ctx = ''

    for dir in os.walk('.'):
        root = dir[0]
        parts = root.split('\\')

        if (len(parts) == 3):
            ts_ctx = SET_TS_HEADER
            for sub in dir[1]:
                ts_ctx += '\nexport { Tile as ' + sub + ' } from \'./' + sub + '\''

            f = open(root + '\\index.ts', 'w')
            f.write(ts_ctx)
            f.close()

            if (parts[1] == 'SD'):
                sd_ctx += '\nexport * as ' + parts[2] + ' from \'./' + parts[2] + '\''

            if (parts[1] == 'HD'):
                hd_ctx += '\nexport * as ' + parts[2] + ' from \'./' + parts[2] + '\''

    f = open('.\\SD\\index.ts', 'w')
    f.write(sd_ctx)
    f.close()
    
    f = open('.\\HD\\index.ts', 'w')
    f.write(hd_ctx)
    f.close()