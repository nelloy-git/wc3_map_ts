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

local FdfSimpleLayer = Class.new('FdfSimpleLayer', FdfData)
---@class FdfSimpleLayer : FdfData
local public = FdfSimpleLayer.public
---@class FdfSimpleLayerClass : FdfDataClass
local static = FdfSimpleLayer.static
---@type FdfSimpleLayerClass
local override = FdfSimpleLayer.override
local private = {}

--=========
-- Static
--=========

---@param layer_name string | "'ARTWORK'" | "'BACKGROUND'"
---@param child FdfSimpleLayer | nil
---@return FdfSimpleLayer
function override.new(layer_name, child)
    isTypeErr(layer_name, 'string', 'layer_name')
    if child then isTypeErr(child, FdfSimpleLayer, 'child') end

    if not (layer_name == 'ARTWORK' or layer_name == 'BACKGROUND') then
        Log:err('Wrong \'layer_name\'. ARTWORK and BACKGROUND are available only.', 2)
    end

    local instance = child or Class.allocate(FdfSimpleLayer)
    instance = FdfData.new(tostring(instance), 'Layer', true, nil, instance)
    private.newData(instance, layer_name)

    return instance
end

--========
-- Public
--========

---@return string
function public:getName()
    isTypeErr(self, FdfSimpleLayer, 'self')
    return private.data[self].layer_name
end

---@param fdf_frame FdfData | nil
function public:setInheritance(fdf_frame)
    isTypeErr(self, FdfSimpleLayer, 'self')
    Log:err(tostring(FdfSimpleLayer)..' can not inherit.')
end

---@return string
function public:serialize()
    isTypeErr(self, FdfSimpleLayer, 'self')
    local priv = private.data[self]

    local res = string.format("Layer \"%s\" {", priv.layer_name)
    for param, value in pairs(self:getAllParameters()) do
        res = res..'    '..param..' '..value..',\n'
    end
    for _, subframe in pairs(self:getAllSubframes()) do
        res = res..'\n    '..subframe:serialize():gsub('\n', '\n    ')..'\n'
    end
    return res.."}"
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

function private.newData(self, layer_name)
    local priv = {
        layer_name = layer_name
    }
    private.data[self] = priv
end

return static