--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExt = Wc3AbilityExt.AbilityExt or error('')
---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local GlueTextButton = Wc3FrameExt.GlueTextButton or error('')
local GlueTextButtonPublic = Class.getPublic(GlueTextButton) or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type InterfaceSkillButtonFdf
local Fdf = require('Skill.ButtonFdf') or error('')
---@type InterfaceSkillChargesClass
local SkillCharges = require('Skill.Charges') or error('')
---@type InterfaceSkillCooldownClass
local SkillCooldown = require('Skill.Cooldown') or error('')

--=======
-- Class
--=======

local InterfaceSkillButton = Class.new('InterfaceSkillButton', GlueTextButton)
---@class InterfaceSkillButton : FrameExtGlueTextButton
local public = InterfaceSkillButton.public
---@class InterfaceSkillButtonClass : FrameExtGlueTextButtonClass
local static = InterfaceSkillButton.static
---@type InterfaceSkillButtonClass
local override = InterfaceSkillButton.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceSkillButton
function override.new(child)
    isTypeErr(child, {'nil', InterfaceSkillButton}, 'child')

    local instance = child or Class.allocate(InterfaceSkillButton)
    instance = GlueTextButton.new(Fdf, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, InterfaceSkillButton, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    local priv = private.data[self]

    GlueTextButtonPublic.setSize(self, width, height)

    priv.charges:setSize(width / 3, height / 4)
    priv.charges:setPos(0, 3 * height / 4)

    priv.cooldown:setSize(width, height)
end

---@param abil AbilityExt
function public:setAbility(abil)
    isTypeErr(self, InterfaceSkillButton, 'self')
    isTypeErr(abil, AbilityExt, 'abil')
    local priv = private.data[self]

    priv.abil = abil
    if abil then
        priv.charges:setCharges(abil:getCharges())
        priv.cooldown:setCharges(abil:getCharges())

        self:setVisible(true)
        self:setNormalTexture(abil:getType():getData():getIcon(abil))
    else
        priv.charges:setCharges(nil)
        priv.cooldown:setCharges(nil)

        self:setVisible(false)
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceSkillButton
function private.newData(self)
    local priv = {
        abil = nil,

        charges = SkillCharges.new(),
        cooldown = SkillCooldown.new(),
    }
    private.data[self] = priv

    priv.charges:setParent(self)
    priv.charges:setLevel(self:getLevel() + 1)

    priv.cooldown:setParent(self)
    priv.cooldown:setPos(0, 0)

    self:setSize(self:getWidth(), self:getHeight())
    self:addAction('CLICK', private.startTargeting)
end

---@param self InterfaceSkillButton
---@param event string
---@param pl player
function private.startTargeting(self, event, pl)
    if pl ~= GetLocalPlayer() or event ~= 'CLICK' then
        return
    end

    ---@type AbilityExt
    local abil = private.data[self].abil
    if not abil then return end

    if abil:isTargeting() then
        abil:targetingFinish()
    else
        abil:targetingStart()
    end
end

return static