--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfDataClass
local FdfData = require('FdfData') or error('')

--=======
-- Class
--=======

local FdfText = Class.new('FdfText', FdfData)
---@class FdfText : FdfData
local public = FdfText.public
---@class FdfTextClass : FdfDataClass
local static = FdfText.static
---@type FdfTextClass
local override = FdfText.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfText | nil
---@return FdfText
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfText, 'child') end

    local instance = child or Class.allocate(FdfText)
    instance = FdfData.new(name, 'TEXT', false, nil, instance)

    return instance
end

--========
-- Public
--========

---@param width number
function public:setWidth(width)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(width, 'number', 'width')

    local str_width = tostring(width)
    self:setParameter('Width', str_width)
end

---@param height number
function public:setHeight(height)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(height, 'number', 'height')

    local str_height = tostring(height)
    self:setParameter('Height', str_height)
end

--- Look-Up FileNames in some String table (for example gameinterface)
---@param flag boolean
function public:setDecorateFileNames(flag)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    if flag then
        self:setParameter('DecorateFileNames')
    else
        self:removeParameter('DecorateFileNames')
    end
end

---@param text string
function public:setText(text)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(text, 'string', 'text')

    self:setParameter('Text', '\"'..text..'\"')
end

---@param path string
---@param size number
function public:setFont(path, size)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(path, 'string', 'path')
    isTypeErr(size, 'number', 'size')

    self:setParameter('FrameFont', string.format('\"%s\", %f, \"\"',
                                                 path, size))
end

---@param horz string | "'JUSTIFYCENTER'" | "'JUSTIFYLEFT'" | "'JUSTIFYRIGHT'"
---@param vert string | "'JUSTIFYMIDDLE'" | "'JUSTIFYTOP'" | "'JUSTIFYBOTTOM'"
function public:setJustification(horz, vert)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(horz, 'string', 'horz')
    isTypeErr(vert, 'string', 'vert')

    self:setParameter('FontJustificationH', horz)
    self:setParameter('FontJustificationV', vert)
end

---@param x number
---@param y number
function public:setJustificationOffset(x, y)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')

    self:setParameter('FontJustificationOffset', tostring(x)..' '..tostring(y))
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setColor(r, g, b, a)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('FontColor', string.format('%f %f %f %f',
                                                 r, g, b, a))
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setHighlightColor(r, g, b, a)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('FontHighlightColor', string.format('%f %f %f %f',
                                                 r, g, b, a))
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setDisabledColor(r, g, b, a)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('FontDisabledColor', string.format('%f %f %f %f',
                                                 r, g, b, a))
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setShadowColor(r, g, b, a)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('FontShadowColor', string.format('%f %f %f %f',
                                                 r, g, b, a))
end

---@param x number
---@param y number
function public:setShadowOffset(x, y)
    isTypeErr(self, FdfText, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')

    self:setParameter('FontShadowOffset', tostring(x)..' '..tostring(y))
end

--=========
-- Private
--=========

return static