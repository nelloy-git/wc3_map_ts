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

local FdfSimpleStatusBar = Class.new('FdfSimpleStatusBar', FdfData)
---@class FdfSimpleStatusBar : FdfData
local public = FdfSimpleStatusBar.public
---@class FdfSimpleStatusBarClass : FdfDataClass
local static = FdfSimpleStatusBar.static
---@type FdfSimpleStatusBarClass
local override = FdfSimpleStatusBar.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfSimpleStatusBar | nil
---@return FdfSimpleStatusBar
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfSimpleStatusBar, 'child') end

    local instance = child or Class.allocate(FdfSimpleStatusBar)
    instance = FdfData.new(name, 'SIMPLESTATUSBAR', true, nil, instance)

    return instance
end

--========
-- Public
--========

---@param width number
function public:setWidth(width)
    isTypeErr(self, FdfSimpleStatusBar, 'self')
    isTypeErr(width, 'number', 'width')

    local str_width = tostring(width)
    self:setParameter('Width', str_width)
end

---@param height number
function public:setHeight(height)
    isTypeErr(self, FdfSimpleStatusBar, 'self')
    isTypeErr(height, 'number', 'height')

    local str_height = tostring(height)
    self:setParameter('Height', str_height)
end

---@param tex_file string
function public:setBarTexture(tex_file)
    isTypeErr(self, FdfSimpleStatusBar, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')

    self:setParameter('BarTexture', '\"'..tex_file..'\"')
end

--- Look-Up FileNames in some String table (for example gameinterface)
---@param flag boolean
function public:setDecorateFileNames(flag)
    isTypeErr(self, FdfSimpleStatusBar, 'self')
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