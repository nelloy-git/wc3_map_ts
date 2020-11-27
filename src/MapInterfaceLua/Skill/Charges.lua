--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExtCharges = Wc3AbilityExt.Charges or error('')
---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local FdfBackdrop = Wc3FrameExt.FdfBackdrop or error('')
local Backdrop = Wc3FrameExt.Backdrop or error('')
local BackdropPublic = Class.getPublic(Backdrop) or error('')
local SimpleText = Wc3FrameExt.SimpleText or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

--=======
-- Class
--=======

local InterfaceSkillCharges = Class.new('InterfaceSkillCharges', Backdrop)
---@class InterfaceSkillCharges : FrameExtBackdrop
local public = InterfaceSkillCharges.public
---@class InterfaceSkillChargesClass : FrameExtBackdropClass
local static = InterfaceSkillCharges.static
---@type InterfaceSkillChargesClass
local override = InterfaceSkillCharges.override
local private = {}

--=========
-- Static
--=========

---@param child InterfaceSkillCharges | nil
---@return InterfaceSkillCharges
function override.new(child)
    isTypeErr(child, {'nil', InterfaceSkillCharges}, 'child')

    local instance = child or Class.allocate(InterfaceSkillCharges)
    instance = Backdrop.new(private.fdf, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, InterfaceSkillCharges, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    local priv = private.data[self]

    BackdropPublic.setSize(self, width, height)

    priv.text:setSize(width, height)
    priv.text:setFont('fonts\\nim_____.ttf', 0.8 * height)
end

---@param charges AbilityExtCharges | nil
function public:setCharges(charges)
    isTypeErr(self, InterfaceSkillCharges, 'self')
    isTypeErr(charges, {'nil', AbilityExtCharges}, 'charges')
    local priv = private.data[self]

    local prev = priv.charges
    if prev then
        private.charges2frame[prev] = nil
        prev:removeAction(priv.changed_action)
    end

    priv.charges = charges
    if charges then
        private.charges2frame[charges] = self
        priv.changed_action = charges:addChargesChangedAction(private.changedCallback)
        private.changedCallback(charges)
    else
        self:setVisible(false)
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.charges2frame = setmetatable({}, {__mode = 'kv'})

---@param self InterfaceSkillCharges
function private.newData(self)
    local priv = {
        charges = nil,
        changed_action = nil,

        text = SimpleText.new(),
    }
    private.data[self] = priv

    priv.text:setParent(self)

    self:setSize(self:getWidth(), self:getHeight())
end

---@param charges AbilityExtCharges
function private.changedCallback(charges)
    local self = private.charges2frame[charges]
    local max = charges:getMax()

    if max <= 1 then
        self:setVisible(false)
    else
        self:setVisible(true)

        local left = charges:get()
        local s_left = tostring(left - left % 1)
        private.data[self].charges_text:setText(s_left)
    end
end

private.fdf = FdfBackdrop.new('InterfaceSkillCharges')
private.fdf:setWidth(0.01)
private.fdf:setHeight(0.01)
--private.fdf:setBackgroundTileMode(true)
--private.fdf:setBackgroundTileSize(0.2)
private.fdf:setBackground('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
private.fdf:setBlendAll(true)
private.fdf:setInsets(0.005, 0.005, 0.005, 0.005)
private.fdf:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf:setCornerSize(0.0125)
private.fdf:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

return static