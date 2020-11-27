--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
---@type Wc3AbilityExt
local Wc3AbilityExt = LibManager.getDepency('Wc3AbilityExt')
local AbilityExtContainer = Wc3AbilityExt.Container or error('')
---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local FdfBackdrop = Wc3FrameExt.FdfBackdrop or error('')
local Backdrop = Wc3FrameExt.Backdrop or error('')
local BackdropPublic = Class.getPublic(Backdrop) or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type InterfaceSkillButtonClass
local SkillButton = require('Skill.Button') or error('')
---@type InterfaceSkillHotkeyClass
local SkillHotkey = require('Skill.Hotkey') or error('')

--=======
-- Class
--=======

local InterfaceSkillPanel = Class.new('InterfaceSkillPanel', Backdrop)
---@class InterfaceSkillPanel : FrameExtBackdrop
local public = InterfaceSkillPanel.public
---@class InterfaceSkillPanelClass : FrameExtBackdropClass
local static = InterfaceSkillPanel.static
---@type InterfaceSkillPanelClass
local override = InterfaceSkillPanel.override
local private = {}

--=========
-- Static
--=========

---@param max_abils number
---@return InterfaceSkillPanel
function override.new(max_abils)
    isTypeErr(max_abils, 'number', 'max_abils')

    local instance = Class.allocate(InterfaceSkillPanel)
    instance = Backdrop.new(nil, instance)

    private.newData(instance, max_abils)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, InterfaceSkillPanel, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')

    BackdropPublic.setSize(self, width, height)
    private.updateSize(self)
end

---@param container AbilityExtContainer
function public:setAbilContainer(container)
    isTypeErr(self, InterfaceSkillPanel, 'self')
    isTypeErr(container, {'nil', AbilityExtContainer}, 'container')
    local priv = private.data[self]

    local abil_list = container and container:getAll() or {}

    for i = 1, priv.max_abils do
        ---@type AbilityExt
        local abil = abil_list[i]
        priv.buttons[i]:setAbility(abil)

        -- TODO
        if i <= 9 then
            priv.hotkeys[i]:setHotkey(tostring(i), abil, true)
        end
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.button2panel = setmetatable({}, {__mode = 'kv'})
private.container2interface = setmetatable({}, {__mode = 'kv'})

---@param self InterfaceSkillPanel
---@param max_abils number
function private.newData(self, max_abils)
    local priv = {
        fast_cast = false,
        max_abils = max_abils,
        per_line = 10,

        backgrouds = {},
        buttons = {},
        hotkeys = {},
    }
    private.data[self] = priv

    for i = 1, max_abils do
        local back = Backdrop.new(private.fdf)
        back:setParent(self)
        priv.backgrouds[i] = back

        local btn = SkillButton.new()
        btn:setParent(back)
        btn:setVisible(false)
        priv.buttons[i] = btn

        local hotkey = SkillHotkey.new()
        hotkey:setParent(back)
        hotkey:setVisible(true)
        priv.hotkeys[i] = hotkey
    end

    private.updateSize(self)
end

---@param height number
---@param max_frames number
---@param per_line number
---@return number
function private.getLineHeight(height, max_frames, per_line)
    local i, f = math.modf(max_frames / per_line)
    if f ~= 0 then i = i + 1 end
    return height / i
end

function private.updateSize(self)
    local priv = private.data[self]

    local count = #priv.buttons
    local w = self:getWidth() / priv.per_line
    local h = private.getLineHeight(self:getHeight(),
                                    priv.max_abils, priv.per_line)

    local p = 0
    local l = 1
    for i = 1, count do
        p = p + 1
        if p > priv.per_line then
            p = 1
            l = l + 1
        end

        local x = (p - 1) * w
        local y = self:getHeight() - l * h

        priv.backgrouds[i]:setPos(x, y)
        priv.backgrouds[i]:setSize(w, h)

        priv.buttons[i]:setPos(0.1 * w, 0.1 * h)
        priv.buttons[i]:setSize(0.8 * w, 0.8 * h)

        priv.hotkeys[i]:setSize(0.3 * w, 0.25 * h)
    end
end

private.fdf = FdfBackdrop.new('InterfaceSkillPanel')
private.fdf:setWidth(0.01)
private.fdf:setHeight(0.01)
private.fdf:setBackgroundTileMode(true)
private.fdf:setBackgroundTileSize(0.2)
private.fdf:setBackground('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')
private.fdf:setBlendAll(true)
private.fdf:setInsets(0.01, 0.01, 0.01, 0.01)
private.fdf:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf:setCornerSize(0.0125)
private.fdf:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

return static