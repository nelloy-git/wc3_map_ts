--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')

---@type ActionClass
local Action = require('Action') or error('')
---@type UtilsFunctions
local Functions = require('Functions') or error('')
local isTypeErr = Functions.isTypeErr or error('')

--=======
-- Class
--=======

local ActionList = Class.new('ActionList')
---@class ActionList : Handle
local public = ActionList.public
---@class ActionListClass : HandleClass
local static = ActionList.static
---@type ActionListClass
local override = ActionList.override
local private = {}

--========
-- Static
--========

---@param owner any
---@param child ActionList | nil
---@return ActionList
function override.new(owner, child)
    if child then isTypeErr(child, ActionList, 'child') end

    local instance = child or Class.allocate(ActionList)
    private.newData(instance, owner)

    return instance
end

--========
-- Public
--========

---@param callback Callback
---@return Action
function public:add(callback)
    isTypeErr(callback, 'function', 'callback')
    local priv = private.data[self]

    local action = Action.new(callback, priv.owner)
    table.insert(priv.actions, action)

    return action
end

---@param action Action
---@return boolean
function public:remove(action)
    isTypeErr(action, Action, 'action')

    local priv = private.data[self]
    if action:getOwner() ~= priv.owner then return false end

    for i = 1, #priv.actions do
        if priv.actions[i] == action then
            table.remove(priv.actions, i)
            return true
        end
    end

    return false
end

---@param pos number
---@return Action | nil
function public:get(pos)
    return private.data[self].actions[pos]
end

---@return number
function public:count()
    return #private.data[self].actions
end

--- Remove all actions from list.
function public:clear()
    private.data[self].actions = {}
end

--- Run all actions.
---@return table<Action, any>
function public:run(...)
    local priv = private.data[self]

    local res = {}
    for i = 1, #priv.actions do
        res[priv.actions[i]] = priv.actions[i]:run(...)
    end

    return res
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self ActionList
---@param owner any
function private.newData(self, owner)
    local priv = {
        owner = owner,
        actions = {}
    }
    private.data[self] = priv
end

return static