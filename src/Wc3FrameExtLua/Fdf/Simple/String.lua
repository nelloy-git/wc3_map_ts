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

local FdfSimpleString = Class.new('FdfSimpleString', FdfData)
---@class FdfSimpleString : FdfData
local public = FdfSimpleString.public
---@class FdfSimpleStringClass : FdfDataClass
local static = FdfSimpleString.static
---@type FdfSimpleStringClass
local override = FdfSimpleString.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfSimpleString | nil
---@return FdfSimpleString
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfSimpleString, 'child') end

    local instance = child or Class.allocate(FdfSimpleString)
    instance = FdfData.new(name, 'String', true, nil, instance)

    return instance
end

--========
-- Public
--========

---@param path string
---@param size number
function public:setFont(path, size)
    isTypeErr(self, FdfSimpleString, 'self')
    isTypeErr(path, 'string', 'path')
    isTypeErr(size, 'number', 'size')

    self:setParameter('Font', '\"'..path..'\", '..tostring(size))
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setColor(r, g, b, a)
    isTypeErr(self, FdfSimpleString, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    self:setParameter('FontColor', tostring(r)..' '
                                 ..tostring(g)..' '
                                 ..tostring(b)..' '
                                 ..tostring(a))
end

---@param text string
function public:setText(text)
    isTypeErr(self, FdfSimpleString, 'self')
    isTypeErr(text, 'string', 'text')

    self:setParameter('Text', '\"'..text..'\"')
end

function public:addSubframe()
    isTypeErr(self, FdfSimpleString, 'self')

    Log:err(tostring(FdfSimpleString)..' can not have subframes')
end

---@return string
function public:serialize()
    isTypeErr(self, FdfSimpleString, 'self')

    local res = string.format("%s \"%s\" {\n", self:getBaseType(), self:getName())
    for param, value in pairs(self:getAllParameters()) do
        res = res..'    '..param..' '..value..',\n'
    end
    return res.."}"
end

--=========
-- Private
--=========

return static