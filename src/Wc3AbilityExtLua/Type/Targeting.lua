--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type AbilityExtClass
local AbilityExt = require('AbilityExt') or error('')

--=======
-- Class
--=======

local AbilityExtTypeTargeting = Class.new('AbilityExtTypeTargeting')
---@class AbilityExtTypeTargeting
local public = AbilityExtTypeTargeting.public
---@class AbilityExtTypeTargetingClass
local static = AbilityExtTypeTargeting.static
---@type AbilityExtTypeTargetingClass
local override = AbilityExtTypeTargeting.override
local private = {}

--========
-- Static
--========

---@param child AbilityExtTypeTargeting | nil
---@return AbilityExtTypeTargeting
function override.new(child)
    isTypeErr(child, {AbilityExtTypeTargeting, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtTypeTargeting)
    return instance
end

function override.cancelCurrent()
    if private.cur then
        private.cur:cancel()
    end
end

--========
-- Public
--========

---@param abil AbilityExt
---@param callback fun(abil:AbilityExt, target:any)
function public:start(abil, callback)
    isTypeErr(self, AbilityExtTypeTargeting, 'self')
    isTypeErr(abil, AbilityExt, 'abil')
    isTypeErr(callback, 'function', 'callback')

    static.cancelCurrent()

    private.cur = self
    private.abil = abil
    private.finish_action = Action.new(callback)
end

---@return boolean
function public:cancel()
    isTypeErr(self, AbilityExtTypeTargeting, 'self')

    if self ~= private.cur then
        Log:wrn(tostring(AbilityExtTypeTargeting)..': can not cancel inactive targeting. Use static function instead.')
        return false
    end

    private.cur = nil
    private.abil = nil
    private.finish_action = nil

    return true
end

---@param target any
---@return boolean
function public:finish(target)
    isTypeErr(self, AbilityExtTypeTargeting, 'self')

    if self ~= private.cur then
        Log:wrn(tostring(AbilityExtTypeTargeting)..': can not finish inactive targeting.')
        return false
    end

    local abil = private.abil
    local action = private.finish_action

    private.cur = nil
    private.abil = nil
    private.finish_action = nil

    action:run(abil, target)

    return true
end

--=========
-- Private
--=========

private.cur = nil
private.abil = nil
private.finish_action = nil

return static