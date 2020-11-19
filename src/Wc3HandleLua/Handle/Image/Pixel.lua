-- https://xgm.guru/p/wc3/250655

--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local ImportFile = Wc3Utils.ImportFile or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type ImageClass
local Image = require('Handle.Image') or error('')
---@type HandleSettings
local Settings = require('Settings') or error('')

--=======
-- Class
--=======

local ImagePixel = Class.new('ImagePixel', Image)
---@class ImagePixel : Image
local public = ImagePixel.public
---@class ImagePixelClass : ImageClass
local static = ImagePixel.static
---@type ImagePixelClass
local override = ImagePixel.override
local private = {}

--=========
-- Static
--=========

---@param size number | nil
---@param child ImagePixel | nil
---@return ImagePixel
function override.new(size, child)
    if size then isTypeErr(size, 'number', 'size') end
    if child then isTypeErr(child, ImagePixel, 'child') end
    size = size or Settings.ImagePixelDefaultSize

    local instance = child or Class.allocate(ImagePixel)
    instance = Image.new(private.pixel_texture,
                         size, size, size,
                         instance)

    return instance
end

--========
-- Public
--========

--=========
-- Private
--=========

local dst
local sep
if not IsGame() then
    sep = package.config:sub(1,1)
    local this_file_path = debug.getinfo(1, "S").source:sub(2)
    local this_dir_path = this_file_path:sub(1, this_file_path:match('^.*()'..sep))

    local src = this_dir_path..'Pixel'..sep..'pixel.dds'
    dst = 'war3mapImported'..sep..'Wc3Handle'..sep..'Pixel'..sep..'pixel.dds'
    ImportFile.load(src, dst)
end
private.pixel_texture = Macro(dst:gsub(sep, '\\'))

return static