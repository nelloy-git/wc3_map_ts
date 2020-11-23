--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfFileClass
local FdfFile = require('Fdf.File') or error('')
---@type FrameExtSettings
local Settings = require('Settings') or error('')

--=======
-- Class
--=======

local FdfData = Class.new('FdfData')
---@class FdfData
local public = FdfData.public
---@class FdfDataClass
local static = FdfData.static
---@type FdfDataClass
local override = FdfData.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param base_type string
---@param is_simple boolean
---@param file FdfFile | nil
---@param child FdfData | nil
---@return FdfData
function override.new(name, base_type, is_simple, file, child)
    isTypeErr(name, 'string', 'name')
    isTypeErr(base_type, 'string', 'base_type')
    isTypeErr(is_simple, 'boolean', 'is_simple')
    if file then isTypeErr(file, FdfFile, 'file') else file = private.default_file end
    if child then isTypeErr(child, FdfData, 'child') end

    if private.name[name] then
        Log:err('Frame with the same name already exists.', 2)
    end

    local instance = child or Class.allocate(FdfData)
    private.newData(instance, name, base_type, is_simple, file)

    return instance
end

--========
-- Public
--========

---@return string
function public:getName()
    isTypeErr(self, FdfData, 'self')
    return private.data[self].name
end

---@return string
function public:getBaseType()
    isTypeErr(self, FdfData, 'self')
    return private.data[self].base_type
end

---@return boolean
function public:isSimple()
    isTypeErr(self, FdfData, 'self')
    return private.data[self].is_simple
end

---@param base_type string
function public:setBaseType(base_type)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(base_type, 'string', 'base_type')
    private.data[self].base_type = base_type
end

---@param other_fdf FdfData | nil
function public:setInheritance(other_fdf)
    isTypeErr(self, FdfData, 'self')
    if other_fdf then isTypeErr(other_fdf, FdfData, 'other_fdf') end

    if other_fdf and self:getBaseType() ~= other_fdf:getBaseType() then
        Log:err(tostring(FdfData)..': can not inherit from different base type.', 2)
    end
    private.data[self].inheritance = other_fdf
end

---@return FdfFile | nil
function public:getInheritance()
    isTypeErr(self, FdfData, 'self')
    return private.data[self].inheritance
end

---@return table
function public:getAllParameters()
    isTypeErr(self, FdfData, 'self')
    local priv = private.data[self]

    local copy = {}
    for param, val in pairs(priv.params) do
        copy[param] = val
    end

    return copy
end

---@param parameter string
---@param value string | nil
function public:setParameter(parameter, value)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(parameter, 'string', parameter)
    if value then isTypeErr(value, 'string', value) end

    local priv = private.data[self]
    if value == nil then value = private.empty_param_value end
    priv.params[parameter] = value
end

---@return string
function public:getParameter(parameter)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(parameter, 'string', parameter)
    return private.data[self].params[parameter]
end

---@param parameter string
function public:removeParameter(parameter)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(parameter, 'string', parameter)

    private.data[self].params[parameter] = nil
end

---@param subframe FdfData
function public:addSubframe(subframe)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(subframe, FdfData, 'subframe')
    local priv = private.data[self]

    if priv.is_simple ~= subframe:isSimple() then
        Log:err(tostring(FdfData)..': simple and normal frames can not be combined.', 2)
    end

    priv.subframes[subframe:getName()] = subframe
    private.data[self].fdf_file:remove(subframe)
end

---@param name string
---@return FdfData | nil
function public:getSubframe(name)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(name, 'string', 'name')
    local priv = private.data[self]
    return priv.subframes[name]
end

---@param name string
---@return FdfData | nil
function public:removeSubframe(name)
    isTypeErr(self, FdfData, 'self')
    isTypeErr(name, 'string', 'name')
    local priv = private.data[self]

    local subframe = priv.subframes[name]
    priv.subframes[name] = nil
    if subframe then
        private.data[self].fdf_file:add(subframe)
    end
    return subframe
end

---@return table
function public:getAllSubframes()
    isTypeErr(self, FdfData, 'self')
    local priv = private.data[self]
    local copy = {}
    for name, subframe in pairs(priv.subframes) do
        copy[name] = subframe
    end

    return copy
end

--- Do nothing in runtime.
---@return string
function public:serialize()
    isTypeErr(self, FdfData, 'self')
    local priv = private.data[self]

    local res = string.format('Frame \"%s\" \"%s\"', priv.base_type, priv.name)
    if priv.inheritance then res = res..' INHERITS '..priv.inheritance:getName() end
    res = res..' {\n'
    for param, value in pairs(priv.params) do
        res = res..'    '..param
        if value ~= private.empty_param_value then res = res..' '..value end
        res = res..',\n'
    end
    for _, subframe in pairs(priv.subframes) do
        res = res..'\n    '..subframe:serialize():gsub('\n', '\n    ')..'\n'
    end
    return res.."}"
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.name = setmetatable({}, {__mode = 'k'})

private.empty_param_value = 'NULL'
private.default_file = Settings.FdfFileDefault or error('')

---@param self FdfData
---@param name string
---@param is_simple boolean
---@return FdfDataPrivate
function private.newData(self, name, base_type, is_simple, file)
    ---@class FdfDataPrivate
    local priv = {
        is_simple = is_simple,
        base_type = base_type,
        name = name,

        inheritance = nil,
        params = {},
        subframes = {},

        fdf_file = file
    }
    private.data[self] = priv
    private.name[name] = self

    file:add(self)
end

return static