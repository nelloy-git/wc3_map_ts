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

local FdfSimpleFrame = Class.new('FdfSimpleFrame', FdfData)
---@class FdfSimpleFrame : FdfData
local public = FdfSimpleFrame.public
---@class FdfSimpleFrameClass : FdfDataClass
local static = FdfSimpleFrame.static
---@type FdfSimpleFrameClass
local override = FdfSimpleFrame.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfSimpleFrame | nil
---@return FdfSimpleFrame
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfSimpleFrame, 'child') end

    local instance = child or Class.allocate(FdfSimpleFrame)
    instance = FdfData.new(name, 'SIMPLEFRAME', true, nil, instance)

    return instance
end

--========
-- Public
--========

---@param width number
function public:setWidth(width)
    isTypeErr(self, FdfSimpleFrame, 'self')
    isTypeErr(width, 'number', 'width')

    local str_width = tostring(width)
    self:setParameter('Width', str_width)
end

---@param height number
function public:setHeight(height)
    isTypeErr(self, FdfSimpleFrame, 'self')
    isTypeErr(height, 'number', 'height')

    local str_height = tostring(height)
    self:setParameter('Height', str_height)
end

---@param flag boolean
function public:setAllPoints(flag)
    isTypeErr(self, FdfSimpleFrame, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    if flag then
        self:setParameter('SetAllPoints')
    else
        self:removeParameter('SetAllPoints')
    end
end

--- Look-Up FileNames in some String table (for example gameinterface)
---@param flag boolean
function public:setDecorateFileNames(flag)
    isTypeErr(self, FdfSimpleFrame, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    if flag then
        self:setParameter('DecorateFileNames')
    else
        self:removeParameter('DecorateFileNames')
    end
end

--=========
-- Private
--=========

return static