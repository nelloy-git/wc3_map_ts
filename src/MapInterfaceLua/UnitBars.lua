--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type BuffLib
local BuffLib = require(LibList.BuffLib) or error('')
local getShield = BuffLib.getShield or error('')
local getMaxShield = BuffLib.getMaxShield or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local NormalImage = FrameLib.Normal.Image or error('')
local NormalImagePublic = Class.getPublic(NormalImage) or error('')

---@type InterfaceAutoBarClass
local AutoBar = require('Interface.Utils.AutoBar') or error('')

--=======
-- Class
--=======

local InterfaceUnitBars = Class.new('InterfaceUnitBars', NormalImage)
---@class InterfaceUnitBars : FrameNormalImage
local public = InterfaceUnitBars.public
---@class InterfaceUnitBarsClass : FrameNormalImageClass
local static = InterfaceUnitBars.static
---@type InterfaceUnitBarsClass
local override = InterfaceUnitBars.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceUnitBars
function override.new()
    local instance = Class.allocate(InterfaceUnitBars)
    instance = NormalImage.new(nil, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    NormalImagePublic.setSize(self, width, height)
    local priv = private.data[self]

    local h = height / 3
    priv.sh_bar:setPos(0, 0)
    priv.sh_bar:setSize(width, h)
    priv.sh_bar:setFont('fonts\\nim_____.ttf', 0.8 * h)

    priv.hp_bar:setPos(0, h)
    priv.hp_bar:setSize(width, h)
    priv.hp_bar:setFont('fonts\\nim_____.ttf', 0.8 * h)

    priv.mp_bar:setPos(0, h)
    priv.mp_bar:setSize(width, h)
    priv.mp_bar:setFont('fonts\\nim_____.ttf', 0.8 * h)
end

---@param target Unit | nil
function public:setTarget(target)
    private.data[self].target = target
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceUnitBars
function private.newData(self)
    local priv = {
        target = nil,

        sh_bar = AutoBar.new(),
        hp_bar = AutoBar.new(),
        mp_bar = AutoBar.new(),
    }
    private.data[self] = priv
    self:setAlpha(0)

    priv.sh_bar:setParent(self)
    priv.sh_bar:setBackground('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
    priv.sh_bar:setBar('Replaceabletextures\\Teamcolor\\Teamcolor02.blp')
    priv.sh_bar:setBorder('UI\\Feedback\\XPBar\\human-xpbar-border.blp')
    priv.sh_bar:setPrecision(0)
    priv.sh_bar:setUpdateCurFunc(function()
        return priv.target and getShield(priv.target) or 0
    end)
    priv.sh_bar:setUpdateMaxFunc(function()
        return priv.target and getMaxShield(priv.target) or 0
    end)

    priv.hp_bar:setParent(priv.sh_bar)
    priv.hp_bar:setBackground('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
    priv.hp_bar:setBar('Replaceabletextures\\Teamcolor\\Teamcolor00.blp')
    priv.hp_bar:setBorder('UI\\Feedback\\XPBar\\human-xpbar-border.blp')
    priv.hp_bar:setPrecision(0)
    priv.hp_bar:setUpdateCurFunc(function()
        return priv.target and priv.target:getLife() or 0
    end)
    priv.hp_bar:setUpdateMaxFunc(function()
        return priv.target and priv.target:getMaxLife() or 0
    end)

    priv.mp_bar:setParent(priv.hp_bar)
    priv.mp_bar:setBackground('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
    priv.mp_bar:setBar('Replaceabletextures\\Teamcolor\\Teamcolor01.blp')
    priv.mp_bar:setBorder('UI\\Feedback\\XPBar\\human-xpbar-border.blp')
    priv.mp_bar:setPrecision(0)
    priv.mp_bar:setUpdateCurFunc(function()
        return priv.target and priv.target:getMana() or 0
    end)
    priv.mp_bar:setUpdateMaxFunc(function()
        return priv.target and priv.target:getMaxMana() or 0
    end)

    self:setSize(self:getWidth(), self:getHeight())
end

return static