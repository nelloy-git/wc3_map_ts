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

local ImageArc = Class.new('ImageArc')
---@class ImageArc
local public = ImageArc.public
---@class ImageArcClass
local static = ImageArc.static
---@type ImageArcClass
local override = ImageArc.override
local private = {}

--=========
-- Static
--=========

---@param max_p_count number
---@param p_size number | nil
---@param step number | nil
---@param child ImageArc | nil
---@return ImageArc
function override.new(max_p_count, p_size, step, child)
    isTypeErr(max_p_count, 'number', 'max_p_count')
    if p_size then isTypeErr(p_size, 'number', 'p_size') end
    if step then isTypeErr(step, 'number', 'step') end
    if child then isTypeErr(child, ImageArc, 'child') end

    local instance = child or Class.allocate(ImageArc)
    private.newData(instance, max_p_count, p_size, step)

    return instance
end

--========
-- Public
--========

---@param x0 number
---@param y0 number
---@param range number
---@param start_angle number
---@param end_angle number
function public:setPosPolar(x0, y0, range, start_angle, end_angle)
    isTypeErr(self, ImageArc, 'self')
    isTypeErr(x0, 'number', 'x0')
    isTypeErr(y0, 'number', 'y0')
    isTypeErr(range, 'number', 'range')
    isTypeErr(start_angle, 'number', 'start_angle')
    isTypeErr(end_angle, 'number', 'end_angle')
    local priv = private.data[self]
    
    if not priv.is_visible then
        return
    end

    local length = range * (end_angle - start_angle)
    local need = math.floor(length / priv.step) + 1
    if need > #priv.pixels then
        Log:wrn('ImageLine: not enought pixels to fill.')
    end

    local used = math.min(need, #priv.pixels)
    local a0 = start_angle
    local step_a = (end_angle - start_angle) / used
    for i = 1, used do
        local pixel = priv.pixels[i]
        pixel:setPos(x0 + range * math.cos(a0),
                     y0 + range * math.sin(a0))
        pixel:setVisible(true)

        a0 = a0 + step_a
    end

    for i = used, #priv.pixels do
        priv.pixels[i]:setVisible(false)
    end
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, ImageArc, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    for i = 1, #priv.pixels do
        priv.pixels[i]:setColor(color)
    end
end

---@return Color
function public:getColor()
    isTypeErr(self, ImageArc, 'self')
    return Color.copy(private.data[self].color)
end

---@param flag boolean
function public:renderAlways(flag)
    isTypeErr(self, ImageArc, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]

    priv.render_always = flag
    for i = 1, #priv.pixels do
        priv.pixels[i]:renderAlways(flag)
    end
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, ImageArc, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]

    priv.is_visible = flag
    for i = 1, #priv.pixels do
        priv.pixels[i]:setVisible(flag)
    end
end

function public:destroy()
    isTypeErr(self, ImageArc, 'self')
    local priv = private.data[self]

    for i = 1, #priv.pixels do
        priv.pixels[i]:destroy()
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self ImageArc
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