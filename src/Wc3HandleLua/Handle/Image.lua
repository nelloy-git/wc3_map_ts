--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Image = Class.new('Image', Handle)
---@class Image : Handle
local public = Image.public
---@class ImageClass : HandleClass
local static = Image.static
---@type ImageClass
local override = Image.override
local private = {}

--=========
-- Static
--=========

---@param file string
---@param size_x number
---@param size_y number
---@param size_z number
---@param child Image | nil
---@return Image
function override.new(file, size_x, size_y, size_z, child)
    isTypeErr(file, 'string', 'file')
    isTypeErr(size_x, 'number', 'size_x')
    isTypeErr(size_y, 'number', 'size_y')
    isTypeErr(size_z, 'number', 'size_z')
    if child then isTypeErr(child, Image, 'child') end

    local handle = CreateImage(file,
                               size_x, size_y, size_z,
                               0, 0, -5000,
                               size_x / 2, size_y / 2, size_z / 2, 4)

    local instance = child or Class.allocate(Image)
    instance = Handle.new(handle, DestroyImage, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param x number
---@param y number
---@param z number | nil
---@overload fun(self:Image, target:Unit, z:number)
function public:setPos(x, y, z)
    SetImagePosition(self:getData(), x, y, z or 0)
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, Image, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    SetImageColor(self:getData(),
                  math.floor(255 * color.r),
                  math.floor(255 * color.g),
                  math.floor(255 * color.b),
                  math.floor(255 * color.a))
end

---@return Color
function public:getColor()
    isTypeErr(self, Image, 'self')
    return Color.copy(private.data[self].color)
end

---@param flag boolean
function public:renderAlways(flag)
    isTypeErr(self, Image, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    SetImageRenderAlways(self:getData(), flag)
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, Image, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    ShowImage(self:getData(), flag)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Image
function private.newData(self)
    local priv = {
        color = Color.new(1, 1, 1, 1)
    }
    private.data[self] = priv
end

return static