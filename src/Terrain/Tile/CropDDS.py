from PIL import Image, ImageChops
from wand import image
import os

def crop(mode, tileset, tile):
    dir = '.\\' + mode + '\\' + tileset + '\\' + tile + '\\'
    atlas_name = tileset + '_' + tile + ('_diffuse.dds' if mode == 'HD' else '.dds')

    IN_W = 256 if mode == 'HD' else 64
    IN_H = 256 if mode == 'HD' else 64
    OUT_W = 128
    OUT_H = 128

    atlas = Image.open(dir + atlas_name)

    max_x = int(atlas.size[0] / IN_W)
    max_y = int(atlas.size[1] / IN_H)

    background = atlas.crop((0, 0, IN_W, IN_H))
    croped_back = background.resize((OUT_W - 1, OUT_H - 1))
    alpha = Image.new('RGBA', croped_back.size, (255, 255, 255, 0))
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

            path = dir + '%02dx%02d.tga' % (x, y)
            im.save(path)

            dds = image.Image(filename=path)
            dds.compression = 'dxt5'
            dds.save(filename=dir + '%02dx%02d.dds' % (x, y))

            os.remove(path)
    print(dir)

if __name__ == '__main__':
    all_dirs = [x[0] for x in os.walk('.')]
    for dir in all_dirs:
        p = dir.split('\\')
        if (len(p) < 4):
            continue

        mode = p[1]
        tileset = p[2]
        tile = p[3]

        if (mode is None or tileset is None or tile is None):
            continue

        crop(mode, tileset, tile)