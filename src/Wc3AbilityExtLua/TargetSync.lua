--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local Handle = Wc3Handle.Handle or error('')
---@type Wc3Input
local Wc3Input = LibManager.getDepency('Wc3Input') or error('')
local DataSync = Wc3Input.DataSync or error('')
local DataSyncPublic = Class.getPublic(DataSync) or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isType = Wc3Utils.isType or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local splitStr = Wc3Utils.splitStr or error('')

---@type AbilityExtPointClass
local AbilityExtPoint = require('Point') or error('')

--=======
-- Class
--=======

local AbilityExtTargetSync = Class.new('AbilityExtTargetSync', DataSync)
---@class AbilityExtTargetSync : InputDataSync
local public = AbilityExtTargetSync.public
---@class AbilityExtTargetSyncClass : InputDataSyncClass
local static = AbilityExtTargetSync.static
---@type AbilityExtTargetSyncClass
local override = AbilityExtTargetSync.override
local private = {}

--=========
-- Static
--=========

---@param child AbilityExtTargetSync | nil
---@return AbilityExtTargetSync
function override.new(child)
    isTypeErr(child, {AbilityExtTargetSync, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtTargetSync)
    instance = DataSync.new(instance)
    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param abil_id number
---@param targets table<integer, Handle | AbilityExtPoint>
function public:send(abil_id, targets)
    isTypeErr(self, AbilityExtTargetSync, 'self')
    isTypeErr(abil_id, 'number', 'abil_id')
    isTypeErr(targets, 'table', 'targets')
    for i = 1, #targets do
        isTypeErr(targets[i], {Handle, AbilityExtPoint}, 'targets['..tostring(i)..']')
    end

    local sep = private.data_sep
    local msg = tostring(abil_id)
    for i = 1, #targets do
        if isType(targets[i], Handle) then
            msg = msg..sep..tostring(targets[i]:getId())
        elseif isType(targets[i], AbilityExtPoint) then
            msg = msg..sep..targets[i]:tostring()
        end
    end

    DataSyncPublic.send(self, msg)
end

---@alias AbilityExtTargetSyncCallback fun(sync:AbilityExtTargetSync, abil_id:number, targets:table<integer, Handle | AbilityExtPoint>, source:player)

---@param callback AbilityExtTargetSyncCallback
---@return Action
function public:addAction(callback)
    isTypeErr(self, AbilityExtTargetSync, 'self')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, AbilityExtTargetSync, 'self')
    isTypeErr(action, Action, 'action')
    return private.data[self].actions:remove(action)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.data_sep = ':'

function private.newData(self)
    local priv = {
        actions = ActionList.new()
    }
    private.data[self] = priv

    DataSyncPublic.addAction(self, private.originCallback)
end

---@param msg string
function private.parse(msg)
    local vals = splitStr(msg, private.data_sep)

    local abil_id = tonumber(vals[1])
    local target = {}
    for i = 2, #vals do
        local cur = AbilityExtPoint.new(vals[i])
        if not cur then
            cur = Handle.getLinked(tonumber(vals[i]))
        end
        table.insert(target, cur)
    end

    return abil_id, target
end

---@param self AbilityExtTargetSync
---@param msg string
---@param source player
function private.originCallback(self, msg, source)
    local priv = private.data[self]

    local abil_id, targets = private.parse(msg)
    priv.actions:run(self, abil_id, targets, source)
end

return static