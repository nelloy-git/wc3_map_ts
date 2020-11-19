--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

--=======
-- Class
--=======

local Handle = Class.new('Handle')
---@class Handle
local public = Handle.public
---@class HandleClass
local static = Handle.static
---@type HandleClass
local override = Handle.override
local private = {}

--=========
-- Static
--=========

--- Creates Handle instance and link it to the handle data.
---@param handle handle
---@param child Handle | nil
---@return Handle
function override.new(handle, destructor, child)
    if handle == nil then
        Log:err('Handle: variable \'handle\' can not be nil.', 2)
    end
    isTypeErr(destructor, 'function', 'destructor')
    if child then isTypeErr(child, Handle, 'child') end

    -- Errors
    if child and private.data[child] then
        Log:err('Handle: instance already has connected handle.', 2)
    end

    if private.data2handle[handle] then
        Log:err('Handle: handle data can have only one connected Handle instance. Old: '..tostring(private.data2handle[handle])..' New: '..tostring(child), 2)
    end

    local instance = child or Class.allocate(Handle)
    private.newData(instance, handle, destructor)

    return instance
end

--- Returns Handle instance linked to the handle data.
---@overload fun(id:number):Handle
---@param handle handle
---@return Handle
function static.getLinked(handle)
    if type(handle) == 'number' then
        return private.id2handle[handle]
    end
    return private.data2handle[handle]
end

--========
-- Public
--========

--- Returns handle data.
---@return handle
function public:getData()
    isTypeErr(self, Handle, 'self')
    return private.data[self] and private.data[self].handle or nil
end

--- Returns handle id.
---@return integer
function public:getId()
    isTypeErr(self, Handle, 'self')
    return private.data[self] and private.data[self].id or nil
end

--- Should be used carefully. Previous one will be destroyed.
function public:setHandle(handle)
    if handle == nil then
        Log:err('Handle: variable \'handle\' can not be nil.', 2)
    end
    if private.data2handle[handle] then
        Log:err('Handle: handle data can have only one connected Handle instance.'..
                'Old: '..tostring(private.data2handle[handle])..' New: '..tostring(self), 2)
    end

    local priv = private.data[self]
    priv.destructor(priv.handle)
    priv.handle = handle
    priv.id = GetHandleId(handle)
    private.data2handle[handle] = self
    private.id2handle[priv.id] = self
end

--- Destroy handle data.
function public:destroy()
    isTypeErr(self, Handle, 'self')
    local priv = private.data[self]

    private.data2handle[priv.handle] = nil
    private.id2handle[priv.id] = nil
    private.data[self] = nil

    priv.destructor(priv.handle)
    priv.handle = nil
    priv.destructor = nil
end

--=========
-- Private
--=========

private.data = {}
private.data2handle = setmetatable({}, {__mode = 'v'})
private.id2handle = setmetatable({}, {__mode = 'v'})

---@param self Handle
---@param handle handle
function private.newData(self, handle, destructor)
    local priv = {
        handle = handle,
        id = GetHandleId(handle),
        destructor = destructor
    }
    private.data[self] = priv
    private.data2handle[handle] = self
    private.id2handle[priv.id] = self
end

return static