--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExt = Wc3AbilityExt.AbilityExt or error('')
---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local FdfBackdrop = Wc3FrameExt.FdfBackdrop or error('')
local Backdrop = Wc3FrameExt.Backdrop or error('')
local BackdropPublic = Class.getPublic(Backdrop) or error('')
local SimpleText = Wc3FrameExt.SimpleText or error('')
---@type Wc3Input
local Wc3Input = LibManager.getDepency('Wc3Input')
local Keyboard = Wc3Input.Keyboard or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

--=======
-- Class
--=======

local InterfaceSkillHotkey = Class.new('InterfaceSkillHotkey', Backdrop)
---@class InterfaceSkillHotkey : FrameExtBackdrop
local public = InterfaceSkillHotkey.public
---@class InterfaceSkillHotkeyClass : FrameExtBackdropClass
local static = InterfaceSkillHotkey.static
---@type InterfaceSkillHotkeyClass
local override = InterfaceSkillHotkey.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceSkillHotkey
function override.new(child)
    isTypeErr(child, {'nil', InterfaceSkillHotkey}, 'child')

    local instance = child or Class.allocate(InterfaceSkillHotkey)
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
    isTypeErr(self, InterfaceSkillHotkey, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    local priv = private.data[self]

    BackdropPublic.setSize(self, width, height)

    priv.text:setSize(width, height)
    priv.text:setFont('fonts\\nim_____.ttf', 0.8 * height)
end

---@param key string
---@param abil AbilityExt
---@return boolean
function public:setHotkey(key, abil)
    isTypeErr(self, InterfaceSkillHotkey, 'self')
    isTypeErr(key, 'string', 'key')
    isTypeErr(abil, {'nil', AbilityExt}, 'abil')
    local priv = private.data[self]

    if private.key2hotkey[key] then
        return false
    end

    -- Disable previuos
    if priv.key then
        private.key2hotkey[priv.key] = nil
        Keyboard.removeAction(private.key2action[priv.key])
    end

    if key then
        private.key2hotkey[key] = self
        private.key2action[priv.key] = Keyboard.addAction(key, private.keyPressedCallback)
    end

    priv.key = key
    priv.text:setText(key)
    priv.abil = abil

    return true
end

--- If hotkey is smart it is conrolled by key down and key up events instead of click.
---@param flag boolean
function public:setSmart(flag)
    isTypeErr(self, InterfaceSkillHotkey, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]

    priv.smart = flag
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.key2hotkey = setmetatable({}, {__mode = 'v'})
private.key2action = setmetatable({}, {__mode = 'v'})

---@param self InterfaceSkillHotkey
function private.newData(self)
    local priv = {
        key = nil,
        abil = nil,
        smart = false,

        text = SimpleText.new(),
    }
    private.data[self] = priv

    priv.text:setParent(self)
    self:setSize(self:getWidth(), self:getHeight())
end

---@param key string
---@param is_down boolean
---@param meta number
---@param pl player
function private.keyPressedCallback(key, is_down, meta, pl)
    if pl ~= GetLocalPlayer() then return end

    ---@type InterfaceSkillHotkey | nil
    local self = private.key2hotkey[key]
    if not self then return end

    local priv = private.data[self]
    if not priv.abil then return end
    if priv.key ~= key then
        Log:err(tostring(self)..': called with wrong key.')
    end

    -- TODO metakey
    if priv.smart then
        if priv.abil:isTargeting() and not is_down then
            priv.abil:targetingFinish()
        elseif not priv.abil:isTargeting() and is_down then
            priv.abil:targetingStart()
        end
    else
        if is_down then
            if priv.abil:isTargeting() then
                priv.abil:targetingFinish()
            else
                priv.abil:targetingStart()
            end
        end
    end
end

private.fdf = FdfBackdrop.new('InterfaceSkillHotkey')
private.fdf:setWidth(0.01)
private.fdf:setHeight(0.01)
private.fdf:setBackground('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
private.fdf:setBlendAll(true)
private.fdf:setInsets(0, 0, 0, 0)
private.fdf:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf:setCornerSize(0.00125)
private.fdf:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

return static