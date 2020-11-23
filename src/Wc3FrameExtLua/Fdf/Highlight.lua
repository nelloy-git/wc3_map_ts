--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type FdfDataClass
local FdfData = require('FdfData') or error('')

--=======
-- Class
--=======

local FdfHighlight = Class.new('FdfHighlight', FdfData)
---@class FdfHighlight : FdfData
local public = FdfHighlight.public
---@class FdfHighlightClass : FdfDataClass
local static = FdfHighlight.static
---@type FdfHighlightClass
local override = FdfHighlight.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfHighlight | nil
---@return FdfHighlight
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfHighlight, 'child') end

    local instance = child or Class.allocate(FdfHighlight)
    instance = FdfData.new(name, 'HIGHLIGHT', false, nil, instance)

    return instance
end

--========
-- Public
--========

---@param width number
function public:setWidth(width)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(width, 'number', 'width')

    local str_width = tostring(width)
    self:setParameter('Width', str_width)
end

---@param height number
function public:setHeight(height)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(height, 'number', 'height')

    local str_height = tostring(height)
    self:setParameter('Height', str_height)
end

--- Look-Up FileNames in some String table (for example gameinterface)
---@param flag boolean
function public:setDecorateFileNames(flag)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    if flag then
        self:setParameter('DecorateFileNames')
    else
        self:removeParameter('DecorateFileNames')
    end
end

---@param h_type string | "'FILETEXTURE'" | "'SHADE'"
function public:setHighlightType(h_type)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(h_type, 'string', 'h_type')

    self:setParameter('HighlightType', '\"'..h_type..'\"')
end

---@param path string
function public:setAlphaFile(path)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(path, 'string', 'path')

    self:setParameter('HighlightAlphaFile', '\"'..path..'\"')
end

---@param mode string | "'ADD'" | "'BLEND'"
function public:setAlphaMode(mode)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(mode, 'string', 'mode')

    self:setParameter('HighlightAlphaMode', '\"'..mode..'\"')
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setColor(r, g, b, a)
    isTypeErr(self, FdfHighlight, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('HighlightColor', string.format('%f %f %f %f', r, g, b, a))
end

--=========
-- Private
--=========

return static