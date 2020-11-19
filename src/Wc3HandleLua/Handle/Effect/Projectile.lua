--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type EffectClass
local Effect = require('Handle.Effect') or error('')
---@type HandleSettings
local Settings = require('Settings') or error('')
---@type TimerClass
local Timer = require('Handle.Timer') or error('')

--=======
-- Class
--=======

local EffectProjectile = Class.new('EffectProjectile', Effect)
---@class EffectProjectile : Effect
local public = EffectProjectile.public
---@class EffectProjectileClass : EffectClass
local static = EffectProjectile.static
---@type EffectProjectileClass
local override = EffectProjectile.override
local private = {}

--=========
-- Static
--=========

---@param model string
---@param x number
---@param y number
---@param z number
---@param child EffectProjectile | nil
---@return EffectProjectile
function override.new(model, x, y, z, child)
    isTypeErr(model, 'string', 'model')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(z, 'number', 'z')
    if child then isTypeErr(child, EffectProjectile, 'child') end

    local instance = child or Class.allocate(EffectProjectile)
    instance = Effect.new(model, x, y, z, instance)

    private.newData(instance)

    return instance
end

---@return number
function static:getLoopPeriod()
    return private.period
end

--========
-- Public
--========

--- Recomends use after creation.
---@param x number
---@param y number
function public:setTarget(x, y)
    isTypeErr(self, EffectProjectile, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    local priv = private.data[self]

    priv.targ_x = x
    priv.targ_y = y

    private.updVel(self)
end

--- Recomends use after creation.
---@param vel number
function public:setVelocity(vel)
    isTypeErr(self, EffectProjectile, 'self')
    isTypeErr(vel, 'number', 'vel')
    local priv = private.data[self]

    priv.vel = vel

    private.updVel(self)
end

function public:setTrajectory()
    -- TODO
end

---@alias EffectProjectileCallback fun(proj:EffectProjectile)

---@param event string | "'FINISH'" | "'LOOP'"
---@param callback EffectProjectileCallback
---@return Action
function public:addLoopAction(event, callback)
    isTypeErr(self, EffectProjectile, 'self')
    isTypeErr(event, 'string', 'event')
    isTypeErr(callback, 'function', 'callback')
    return private.data[self].actions[event]:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, EffectProjectile, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    for event, list in pairs(priv.actions) do
        if list:remove(action) then
            return true
        end
    end
    return false
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

private.period = Settings.EffectProjectilePeriod

---@param self EffectProjectile
function private.newData(self)
    local priv = {
        targ_x = 0,
        targ_y = 0,

        vel = 0,
        vel_x = 0,
        vel_y = 0,

        actions = {
            FINISH = ActionList.new(self),
            LOOP = ActionList.new(self),
        },
    }
    private.data[self] = priv
end

---@param self EffectProjectile
function private.updVel(self)
    local priv = private.data[self]

    local dx = priv.targ_x - self:getX()
    local dy = priv.targ_y - self:getY()
    local r = (dx * dx + dy * dy) ^ 0.5

    self:setAngles(math.atan(dy, dx), 0, 0)

    priv.vel_x = private.period * priv.vel * dx / r
    priv.vel_y = private.period * priv.vel * dy / r
end

if IsGame() then
    Timer.new():start(private.period, true, function()
        local new_data = setmetatable({}, {__mode = 'k'})

        for self, priv in pairs(private.data) do
            local vel_x = priv.vel_x
            local vel_y = priv.vel_y

            local x = self:getX() + vel_x
            local y = self:getY() + vel_y

            local dx = priv.targ_x - x
            dx = dx >= 0 and dx or -dx
            local dy = priv.targ_y - y
            dy = dy >= 0 and dy or -dy

            local abs_vel_x = vel_x >= 0 and vel_x or -vel_x
            local abs_vel_y = vel_y >= 0 and vel_y or -vel_y

            if dx <= abs_vel_x and dy <= abs_vel_y then
                priv.actions.FINISH:run(self)
                self:destroy()
            else
                self:setPos(x, y, self:getZ())
                priv.actions.LOOP:run(self)

                new_data[self] = priv
            end
        end

        private.data = new_data
    end)
end

return static