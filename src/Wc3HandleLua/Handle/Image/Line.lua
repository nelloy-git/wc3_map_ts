--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type ImagePixelClass
local Pixel = require('Handle.Image.Pixel') or error('')
---@type HandleSettings
local Settings = require('Settings') or error('')

--=======
-- Class
--=======

local ImageLine = Class.new('ImageLine')
---@class ImageLine
local public = ImageLine.public
---@class ImageLineClass
local static = ImageLine.static
---@type ImageLineClass
local override = ImageLine.override
local private = {}

--=========
-- Static
--=========

---@param max_p_count number
---@param p_size number | nil
---@param step number | nil
---@param child ImageLine | nil
---@return ImageLine
function override.new(max_p_count, p_size, step, child)
    isTypeErr(max_p_count, 'number', 'max_p_count')
    if p_size then isTypeErr(p_size, 'number', 'p_size') end
    if step then isTypeErr(step, 'number', 'step') end
    if child then isTypeErr(child, ImageLine, 'child') end

    local instance = child or Class.allocate(ImageLine)
    private.newData(instance, max_p_count, p_size, step)

    return instance
end

--========
-- Public
--========

---@param sx number
---@param sy number
---@param ex number
---@param ey number
function public:setPos(sx, sy, ex, ey)
    isTypeErr(self, ImageLine, 'self')
    isTypeErr(sx, 'number', 'sx')
    isTypeErr(sy, 'number', 'sy')
    isTypeErr(ex, 'number', 'ex')
    isTypeErr(ey, 'number', 'ey')

    local length = ((ex - sx)^2 + (ey - sy)^2)^0.5
    local angle = math.atan(ey - sy, ex - sx)
    self:setPosPolar(sx, sy, length, angle)
end

---@param x0 number
---@param y0 number
---@param length number
---@param angle number
function public:setPosPolar(x0, y0, length, angle)
    isTypeErr(self, ImageLine, 'self')
    isTypeErr(x0, 'number', 'x0')
    isTypeErr(y0, 'number', 'y0')
    isTypeErr(length, 'number', 'length')
    isTypeErr(angle, 'number', 'angle')
    local priv = private.data[self]

    if not priv.is_visible then
        return
    end

    local need = math.floor(length / priv.step) + 1
    if need > #priv.pixels then
        Log:wrn('ImageLine: not enought pixels to fill.')
    end

    local step_x = priv.step * math.cos(angle)
    local step_y = priv.step * math.sin(angle)

    local used = math.min(#priv.pixels, need)
    for i = 1, used do
        local pixel = priv.pixels[i]
        pixel:setPos(x0, y0)
        pixel:setVisible(true)

        x0 = x0 + step_x
        y0 = y0 + step_y
    end

    for i = used, #priv.pixels do
        priv.pixels[i]:setVisible(false)
    end
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, ImageLine, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    for i = 1, #priv.pixels do
        priv.pixels[i]:setColor(color)
    end
end

---@return Color
function public:getColor()
    isTypeErr(self, ImageLine, 'self')
    return Color.copy(private.data[self].color)
end

---@param flag boolean
function public:renderAlways(flag)
    isTypeErr(self, ImageLine, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]

    priv.render_always = flag
    for i = 1, #priv.pixels do
        priv.pixels[i]:renderAlways(flag)
    end
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, ImageLine, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]

    priv.is_visible = flag
    for i = 1, #priv.pixels do
        priv.pixels[i]:setVisible(flag)
    end
end

function public:destroy()
    isTypeErr(self, ImageLine, 'self')
    local priv = private.data[self]

    for i = 1, #priv.pixels do
        priv.pixels[i]:destroy()
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self ImageLine
---@param max_p_count number
---@param p_size number
---@param step number
function private.newData(self, max_p_count, p_size, step)
    local priv = {
        color = Color.new(1, 1, 1, 1),
        render_always = true,
        is_visible = false,

        step = step or Settings.ImagePixelDefaultSize / 2,
        pixels = {}
    }
    private.data[self] = priv

    for i = 1, max_p_count do
        local pixel = Pixel.new(p_size)
        pixel:setColor(priv.color)
        pixel:renderAlways(priv.render_always)
        pixel:setVisible(priv.is_visible)

        table.insert(priv.pixels, pixel)
    end
end

return static