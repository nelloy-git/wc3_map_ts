--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Trigger = Class.new('Trigger', Handle, ActionList)
---@class Trigger : Handle, ActionList
---@field add fun(self:Trigger, callback:Callback):Action
---@field remove fun(self:Trigger, action:Action):boolean
---@field get fun(self:Trigger, pos:number):Action | nil
---@field count fun(self:Trigger):number
---@field clear fun(self:Trigger)
---@field run fun(self:Trigger)
local public = Trigger.public
---@class TriggerClass : HandleClass, ActionListClass
local static = Trigger.static
---@type TriggerClass
local override = Trigger.override
local private = {}

--========
-- Static
--========

---@param child Trigger | nil
---@return Trigger
function override.new(child)
    if child then isTypeErr(child, Trigger, 'child') end

    local instance = child or Class.allocate(Trigger)
    instance = ActionList.new(nil, instance)
    instance = Handle.new(CreateTrigger(), DestroyTrigger, instance)
    TriggerAddAction(instance:getData(), private.runEventActions)

    return instance
end

--========
-- Public
--========

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

function private.runEventActions()
    local self = static.getLinked(GetTriggeringTrigger())
    self:run()
end

return static