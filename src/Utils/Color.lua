--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type UtilsFunctions
local Functions = require('Functions') or error('')
local isTypeErr = Functions.isTypeErr or error('')

--=======
-- Class
--=======

local Color = Class.new('Color')
---@class Color
local public = Color.public
---@class ColorClass
local static = Color.static
---@type ColorClass
local override = Color.override
local private = {}

--========
-- Static
--========

---@param r number
---@param g number
---@param b number
---@param a number
---@param child Color | nil
---@return Color
function override.new(r, g, b, a, child)
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')
    isTypeErr(child, {Color, 'nil'}, 'child')

    local instance = Class.allocate(Color)
    instance.r = r < 0 and 0 or r > 1 and 1 or r
    instance.g = g < 0 and 0 or g > 1 and 1 or g
    instance.b = b < 0 and 0 or b > 1 and 1 or b
    instance.a = a < 0 and 0 or a > 1 and 1 or a

    return instance
end

---@param color Color
---@return Color
function override.copy(color)
    isTypeErr(color, Color, 'color')
    return static.new(color.r, color.g, color.b, color.a)
end

---@param color1 Color
---@param color2 Color
---@return boolean
function override.compare(color1, color2)
    isTypeErr(color1, Color, 'color1')
    isTypeErr(color2, Color, 'color2')

    return color1.r == color2.r and
           color1.g == color2.g and
           color1.b == color2.b and
           color1.a == color2.a
end

--========
-- Public
--========

---@type number
public.r = 1
---@type number
public.g = 1
---@type number
public.b = 1
---@type number
public.a = 1

---@param text string
---@return string
function public:colorText(text)
    local toHex = private.toHex

    local h_r = toHex(self.r)
    local h_g = toHex(self.g)
    local h_b = toHex(self.b)
    local h_a = toHex(self.a)

    return '|c'..h_r..h_g..h_b..h_a..text..'|r'
end

--=========
-- Private
--=========

--- [0, 1]
---@param val number
---@return string
function private.toHex(val)
    local i_val = math.floor(255 * val)
    return string.format('%02X', i_val)
end

return static