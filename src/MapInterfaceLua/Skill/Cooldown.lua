--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExtCharges = Wc3AbilityExt.Charges or error('')
---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local SimpleFrame = Wc3FrameExt.SimpleFrame or error('')
local SimpleFramePublic = Class.getPublic(SimpleFrame) or error('')
local SimpleText = Wc3FrameExt.SimpleText or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local InterfaceSkillCooldown = Class.new('InterfaceSkillCooldown', SimpleFrame)
---@class InterfaceSkillCooldown : FrameExtSimpleFrame
local public = InterfaceSkillCooldown.public
---@class InterfaceSkillCooldownClass : FrameExtSimpleFrameClass
local static = InterfaceSkillCooldown.static
---@type InterfaceSkillCooldownClass
local override = InterfaceSkillCooldown.override
local private = {}

--=========
-- Static
--=========

---@param child InterfaceSkillCooldown | nil
---@return InterfaceSkillCooldown
function override.new(child)
    isTypeErr(child, {'nil', InterfaceSkillCooldown}, 'child')

    local instance = child or Class.allocate(InterfaceSkillCooldown)
    instance = SimpleFrame.new(instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, InterfaceSkillCooldown, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    local priv = private.data[self]

    priv.width = width
    priv.height = height

    priv.text:setSize(width, height)
    priv.text:setFont('fonts\\nim_____.ttf', 0.35 * height)
end

---@return number
function public:getWidth()
    isTypeErr(self, InterfaceSkillCooldown, 'self')
    return private.data[self].width
end

---@return number
function public:getHeight()
    isTypeErr(self, InterfaceSkillCooldown, 'self')
    return private.data[self].height
end

---@param charges AbilityExtCharges
function public:setCharges(charges)
    isTypeErr(self, InterfaceSkillCooldown, 'self')
    isTypeErr(charges, {'nil', AbilityExtCharges}, 'charges')
    local priv = private.data[self]

    local prev = priv.charges
    if prev then
        private.charges2frame[prev] = nil
        prev:removeAction(priv.changed_action)
        prev:removeAction(priv.loop_action)
    end

    priv.charges = charges
    if not charges then
        self:setVisible(false)
        return
    end
    self:setVisible(true)

    private.charges2frame[charges] = self
    priv.changed_action = charges:addChargesChangedAction(private.changedCallback)
    priv.loop_action = charges:addCooldownAction(private.cooldownLoop)

    private.changedCallback(charges)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.charges2frame = setmetatable({}, {__mode = 'kv'})

---@param self InterfaceSkillCooldown
function private.newData(self)
    local priv = {
        width = SimpleFramePublic.getWidth(self),
        height = SimpleFramePublic.getHeight(self),

        text = SimpleText.new(),

        charges = nil,
        changed_action = nil,
        loop_action = nil,
    }
    private.data[self] = priv

    priv.text:setParent(self)
    priv.text:setPos(0, 0)
    priv.text:setFont('fonts\\nim_____.ttf', 0.5 * self:getHeight())

    self:setTexture('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
end

---@param charges AbilityExtCharges
function private.changedCallback(charges)
    ---@type InterfaceSkillCooldown
    local self = private.charges2frame[charges]
    local priv = private.data[self]

    if charges:get() < 1 then
        self:setAlpha(0.85)
        priv.text:setAlpha(0.85)
    else
        self:setAlpha(0.25)
        priv.text:setAlpha(0.25)
    end
end

---@param charges AbilityExtCharges
function private.cooldownLoop(charges)
    ---@type InterfaceSkillCooldown
    local self = private.charges2frame[charges]
    local priv = private.data[self]

    local cur = charges:getTimeLeft()
    local full = charges:getCooldown()
    local perc = cur / full

    SimpleFramePublic.setSize(self, perc * priv.width, priv.height)

    cur = math.floor(cur/0.1)
    local s_cur = tostring(cur)
    local len = s_cur:len()
    if len == 1 then
        s_cur = '0'..s_cur
        len = len + 1
    end
    priv.text:setText(s_cur:sub(1, len - 1)..'.'..s_cur:sub(len))
end

return static