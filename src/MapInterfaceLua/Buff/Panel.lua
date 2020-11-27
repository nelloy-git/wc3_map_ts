--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type BuffLib
local BuffLib = require(LibList.BuffLib) or error('')
local BuffContainer = BuffLib.Container or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local FdfNormalImage = FrameLib.Fdf.Normal.Backdrop or error('')
local NormalImage = FrameLib.Normal.Image or error('')
local NormalImagePublic = Class.getPublic(NormalImage) or error('')
---@type InputLib
local InputLib = require(LibList.InputLib) or error('')
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local isTypeErr = UtilsLib.isTypeErr or error('')
local Log = UtilsLib.Log or error('')

---@type InterfaceBuffButtonClass
local BuffButton = require('Interface.Buff.Button') or error('')

--=======
-- Class
--=======

local InterfaceBuffPanel = Class.new('InterfaceBuffPanel', NormalImage)
---@class InterfaceBuffPanel : FrameNormalImage
local public = InterfaceBuffPanel.public
---@class InterfaceBuffPanelClass : FrameNormalImageClass
local static = InterfaceBuffPanel.static
---@type InterfaceBuffPanelClass
local override = InterfaceBuffPanel.override
local private = {}

--=========
-- Static
--=========

---@param max_buffs number
---@return InterfaceBuffPanel
function override.new(max_buffs)
    isTypeErr(max_buffs, 'number', 'max_buffs')

    local instance = Class.allocate(InterfaceBuffPanel)
    instance = NormalImage.new(private.fdf, instance)

    private.newData(instance, max_buffs)

    return instance
end

--========
-- Public
--========

---@param width number
---@param height number
function public:setSize(width, height)
    NormalImagePublic.setSize(self, width, height)
    private.updateSize(self)
end

---@param container BuffContainer
function public:setBuffContainer(container)
    if container then isTypeErr(container, BuffContainer, 'container') end
    local priv = private.data[self]

    local prev = priv.container
    if prev then
        private.container2interface[prev] = nil
        prev:removeAction(priv.changed_action)
    end

    priv.container = container
    if container then
        private.container2interface[container] = self
        priv.changed_action = container:addChangedAction(private.updateBuffs)
    end

    private.updateBuffs(container)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.button2panel = setmetatable({}, {__mode = 'kv'})
private.container2interface = setmetatable({}, {__mode = 'kv'})

---@param self InterfaceBuffPanel
---@param max_buffs number
function private.newData(self, max_buffs)
    local priv = {
        max_buffs = max_buffs,
        per_line = 10,

        container = nil,
        changed_action = nil,

        buttons = {},
    }
    private.data[self] = priv
    self:setAlpha(0)

    for i = 1, max_buffs do
        local btn = BuffButton.new()
        btn:setParent(self)
        btn:setVisible(false)
        priv.buttons[i] = btn
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
    local width = self:getWidth()
    local height = self:getHeight()

    local count = priv.max_buffs
    local w = width / priv.per_line
    local h = private.getLineHeight(height, priv.max_buffs, priv.per_line)

    local p = 0
    local l = 0
    for i = 1, count do
        p = p + 1
        if p > priv.per_line then
            p = 1
            l = l + 1
        end

        local x = (p - 1) * w
        local y = l * h

        priv.buttons[i]:setPos(x, y)
        priv.buttons[i]:setSize(w, h)
    end
end

---@type BuffContainerCallback
private.updateBuffs = function(container)
    if not container then
        return
    end

    ---@type InterfaceBuffPanel
    local self = private.container2interface[container]
    local priv = private.data[self]

    local buff_list = container and container:getAll() or {}
    for i = 1, priv.max_buffs do
        ---@type Buff
        local buff = buff_list[i]
        priv.buttons[i]:setBuff(buff)
    end
end

private.fdf = FdfNormalImage.new('InterfaceBuffPanel')
private.fdf:setWidth(0.01)
private.fdf:setHeight(0.01)
private.fdf:setBackgroundTileMode(true)
private.fdf:setBackgroundTileSize(0.2)
private.fdf:setBackground('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')
private.fdf:setBlendAll(true)
private.fdf:setInsets(0.005, 0.005, 0.005, 0.005)
private.fdf:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf:setCornerSize(0.0125)
private.fdf:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

return static