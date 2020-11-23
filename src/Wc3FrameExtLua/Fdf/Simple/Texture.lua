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

local FdfSimpleTexture = Class.new('FdfSimpleTexture', FdfData)
---@class FdfSimpleTexture : FdfData
local public = FdfSimpleTexture.public
---@class FdfSimpleTextureClass : FdfDataClass
local static = FdfSimpleTexture.static
---@type FdfSimpleTextureClass
local override = FdfSimpleTexture.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfSimpleTexture | nil
---@return FdfSimpleTexture
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfSimpleTexture, 'child') end

    local instance = child or Class.allocate(FdfSimpleTexture)
    instance = FdfData.new(name, 'Texture', true, nil, instance)

    return instance
end

--========
-- Public
--========

---@param path string
function public:setFile(path)
    isTypeErr(self, FdfSimpleTexture, 'self')
    isTypeErr(path, 'string', 'path')

    self:setParameter('File', '\"'..path..'\"')
end

function public:addSubframe()
    isTypeErr(self, FdfSimpleTexture, 'self')
    
    Log:err(tostring(FdfSimpleTexture)..' can not have subframes')
end

---@return string
function public:serialize()
    isTypeErr(self, FdfSimpleTexture, 'self')

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