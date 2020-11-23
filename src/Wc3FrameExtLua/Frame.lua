--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local Handle = Wc3Handle.Handle or error('')
local HandlePublic = Class.getPublic(Handle) or error('')
local Trigger = Wc3Handle.Trigger or error('')
local TriggerEvent = Wc3Handle.TriggerEvent or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Action = Wc3Utils.Action or error('')
local ActionList = Wc3Utils.ActionList or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfDataClass
local FdfData = require('FdfData') or error('')

--=======
-- Class
--=======

local FrameExt = Class.new('FrameExt', Handle)
---@class FrameExt : Handle
local public = FrameExt.public
---@class FrameExtClass : HandleClass
local static = FrameExt.static
---@type FrameExtClass
local override = FrameExt.override
local private = {}

--=========
-- Static
--=========

---@param fdf FdfData
---@param child Frame | nil
---@return Frame
function override.new(fdf, child)
    isTypeErr(fdf, FdfData, 'fdf')
    if child then isTypeErr(child, FrameExt, 'child') end

    local handle = private.createFramehandle(fdf:getName(), fdf:isSimple())
    return static.link(handle, fdf:isSimple(), child)
end

---@param handle framehandle
---@param is_simple boolean
---@param child Frame | nil
---@return Frame
function override.link(handle, is_simple, child)
    isTypeErr(handle, 'framehandle', 'handle')
    isTypeErr(is_simple, 'boolean', 'is_simple')
    if child then isTypeErr(child, FrameExt, 'child') end

    local instance = child or Class.allocate(FrameExt)
    instance = Handle.new(handle, BlzDestroyFrame, instance)
    private.newData(instance, is_simple)

    return instance
end

--========
-- Public
--========

---@param x number
---@param y number
function public:setPos(x, y)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    local priv = private.data[self]

    priv.x = x
    priv.y = y

    if priv.parent then
        BlzFrameSetPoint(self:getData(), FRAMEPOINT_TOPLEFT,
                         priv.parent:getData(), FRAMEPOINT_TOPLEFT,
                         x, -y)
    else
        BlzFrameSetAbsPoint(self:getData(), FRAMEPOINT_TOPLEFT,
                            x, 0.6 - y)
    end

    for child, _ in pairs(priv.children) do
        child:setPos(child:getX(), child:getY())
    end
end

--- Returns x offset from parent.
---@return number
function public:getX()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].x
end

--- Returns y offset from parent.
function public:getY()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].y
end

---@return number
function public:getAbsX()
    isTypeErr(self, FrameExt, 'self')
    local priv = private.data[self]

    local parent_x = priv.parent and priv.parent:getAbsX() or 0
    local self_x = priv.x

    return self_x + parent_x
end

---@return number
function public:getAbsY()
    isTypeErr(self, FrameExt, 'self')
    local priv = private.data[self]

    local parent_y = priv.parent and priv.parent:getAbsY() or 0
    local self_y = priv.y

    return self_y + parent_y
end

---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    local priv = private.data[self]

    priv.width = width
    priv.height = height
    BlzFrameSetSize(self:getData(), width, height)
end

---@return number
function public:getWidth()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].width
end

---@return number
function public:getHeight()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].height
end

---@return boolean
function public:isSimple()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].is_simple
end

---@return framehandle | nil
function public:getParent()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].parent
end

--- User must check frame and parent are both simple or they are both normal.
---@param parent Frame | nil
function public:setParent(parent)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(parent, {'nil', FrameExt}, 'parent')
    local priv = private.data[self]

    -- Remove frame from previous parent.
    if priv.parent then
        local parent_priv = private.data[priv.parent]
        parent_priv.children[self] = nil
    end

    -- Setup new parent
    priv.parent = parent
    if parent then
        local parent_priv = private.data[parent]
        parent_priv.children[self] = true
    else
        BlzFrameSetParent(self:getData(), private.console_ui_backdrop)
    end

    -- Update position
    self:setPos(self:getX(), self:getY())
    self:setVisible(self:isVisible())
end

function public:getLevel()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].level
end

---@param level number
function public:setLevel(level)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(level, 'number', 'level')
    local priv = private.data[self]

    priv.level = level
    BlzFrameSetLevel(self:getData(), level)
end

--- [0,1]
---@param r number
---@param g number
---@param b number
---@param a number
function public:setColor(r, g, b, a)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(r, 'number', 'r')
    isTypeErr(g, 'number', 'g')
    isTypeErr(b, 'number', 'b')
    isTypeErr(a, 'number', 'a')

    r = r < 0 and 0 or r > 1 and 1 or r
    g = g < 0 and 0 or g > 1 and 1 or g
    b = b < 0 and 0 or b > 1 and 1 or b
    a = a < 0 and 0 or a > 1 and 1 or a

    local color = BlzConvertColor(math.floor(255 * r),
                                  math.floor(255 * g),
                                  math.floor(255 * b),
                                  math.floor(255 * a))
    BlzFrameSetVertexColor(self:getData(), color)
end

function public:getAlpha()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].alpha
end

--- [0, 1]
---@param alpha number
function public:setAlpha(alpha)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(alpha, 'number', 'alpha')

    alpha = alpha > 1 and 1 or alpha < 0 and 0 or alpha
    private.data[self].alpha = alpha

    BlzFrameSetAlpha(self:getData(), math.floor(255 * alpha))
end

---@return boolean
function public:isVisible()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].visible
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    local priv = private.data[self]
    priv.visible = flag

    BlzFrameSetVisible(self:getData(), flag)
    for child, _ in pairs(priv.children) do
        if not child:isTooltip() then
            child:setVisible(flag)
        end
    end
end

---@return Frame | nil
function public:getTooltip()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].tooltip
end

---@param tooltip Frame | nil
function public:setTooltip(tooltip)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(tooltip, {'nil', FrameExt}, 'tooltip')
    local priv = private.data[self]

    local prev = priv.tooltip
    if prev then
        private.data[prev].is_tooltip = false

        self:removeAction(priv.tooltip_show_action)
        self:removeAction(priv.tooltip_hide_action)
    end

    priv.tooltip = tooltip
    if tooltip then
        private.data[tooltip].is_tooltip = true

        priv.tooltip_show_action = priv.actions['ENTER']:add(function(frame, event, player)
            if player == GetLocalPlayer() then
                frame:getTooltip():setVisible(true)
            end
        end)
        priv.tooltip_hide_action = priv.actions['LEAVE']:add(function(frame, event, player)
            if player == GetLocalPlayer() then
                frame:getTooltip():setVisible(false)
            end
        end)
        tooltip:setVisible(false)
    end
end

---@return boolean
function public:isTooltip()
    isTypeErr(self, FrameExt, 'self')
    return private.data[self].is_tooltip
end

---@return boolean
function public:isEnabled()
    isTypeErr(self, FrameExt, 'self')
    return BlzFrameGetEnable(self:getData())
end

---@param flag boolean
function public:setEnabled(flag)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    BlzFrameSetEnable(self:getData(), flag)
end

function public:click()
    isTypeErr(self, FrameExt, 'self')
    BlzFrameClick(self:getData())
end

---@alias FrameExtCallback fun(frame:FrameExt, event:string, player:player)

--- Not all events are available for every frame
---@param event string | "'ENTER'" | "'LEAVE'" | "'UP'" | "'DOWN'" | "'WHEEL'" | "'CLICK'" | "'DOUBLECLICK'"
---@param callback FrameExtCallback
---@return Action
function public:addAction(event, callback)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(event, 'frameeventtype', 'event')
    isTypeErr(callback, 'function', 'callback')
    local priv = private.data[self]

    return priv.actions[event]:add(callback)
end

---@param action Action
---@return boolean
function public:removeAction(action)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(action, Action, 'action')
    local priv = private.data[self]

    for _, list in pairs(priv.actions) do
        if list and list:remove(action) then
            return true
        end
    end
    return false
end

function public:destroy()
    isTypeErr(self, FrameExt, 'self')
    local priv = private.data[self]

    -- Remove destroing frame events from main trigger.
    for i = 1, #priv.events do
        local found = private.removeTriggerEvent(priv.events[i])
        if not found then
            Log:err('Frame: event removal error.')
        end
    end
    private.updateTrigger()

    HandlePublic.destroy(self)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Frame
---@param is_simple boolean
function private.newData(self, is_simple)
    local handle = self:getData()
    local priv = {
        is_simple = is_simple,

        x = 0,
        y = 0,
        width = BlzFrameGetWidth(handle),
        height = BlzFrameGetHeight(handle),

        tooltip = nil,
        tooltip_show_action = nil,
        tooltip_hide_action = nil,
        is_tooltip = false,

        level = 0,
        alpha = 0,
        visible = true,

        children = {},

        ---@type table<frameeventtype, ActionList>
        actions = {},
        events = {}
    }
    private.data[self] = priv

    for i = 1, #private.frameevent do
        local s_event = private.event2str[private.frameevent[i]]
        priv.actions[s_event] = ActionList.new()

        local trig_event = TriggerEvent.newFrameEvent(self:getData(), private.frameevent[i])
        trig_event:addTrigger(private.trigger)
        table.insert(private.trigger_events, trig_event)

        table.insert(priv.events, trig_event)
    end
end

---@param name string
---@param is_simple boolean
---@return framehandle
function private.createFramehandle(name, is_simple)
    local handle
    local test_handle
    if is_simple then
        handle = BlzCreateSimpleFrame(name, nil, 0)
        test_handle = BlzCreateSimpleFrame('', nil, 0)
    else
        handle = BlzCreateFrame(name, private.console_ui_backdrop, 0, 0)
        test_handle = BlzCreateFrame('', private.console_ui_backdrop, 0, 0)
    end

    if tostring(handle) == tostring(test_handle) then
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test_handle)
        Log:err('Can not create framehandle', 3)
    end
    BlzDestroyFrame(test_handle)

    return handle
end

function private.runActions()
    ---@type Frame
    local frame = static.getLinked(BlzGetTriggerFrame())
    if not frame then return end
    local s_event = private.event2str[BlzGetTriggerFrameEvent()]
    if not s_event then return end
    local player = GetTriggerPlayer()
    local priv = private.data[frame]

    ---@type ActionList
    local actions = priv.actions[s_event]
    actions:run(frame, s_event, player)

    -- Drop focus
    if s_event == 'CLICK' and frame:isEnabled() then
        frame:setEnabled(false)
        frame:setEnabled(true)
    end
end

private.trigger = nil
private.trigger_events = {}
function private.updateTrigger()
    if private.trigger then
        private.trigger:destroy()
    end

    private.trigger = Trigger.new()
    private.trigger:add(private.runActions)
    for i = 1, #private.trigger_events do
        private.trigger_events:addTrigger(private.trigger)
    end
end

---@param event TriggerEvent
---@return boolean
function private.removeTriggerEvent(event)
    local found
    for i = 1, #private.trigger_events do
        if event == private.trigger_events[i] then
            found = i
            break
        end
    end

    if found then
        table.remove(private.trigger_events, found)
        return true
    end
    return false
end

if IsGame() then
    private.console_ui_backdrop = BlzGetFrameByName("ConsoleUIBackdrop", 0)
    BlzFrameClearAllPoints(private.console_ui_backdrop)
    BlzFrameSetAbsPoint(private.console_ui_backdrop, FRAMEPOINT_BOTTOMLEFT, 0, 0.6)
    BlzFrameSetAbsPoint(private.console_ui_backdrop, FRAMEPOINT_BOTTOMRIGHT, 0, 0.6)
    BlzFrameSetAbsPoint(private.console_ui_backdrop, FRAMEPOINT_TOPLEFT, 0, 0.6)
    BlzFrameSetAbsPoint(private.console_ui_backdrop, FRAMEPOINT_TOPLEFT, 0, 0.6)

    private.event2str = {
        [FRAMEEVENT_MOUSE_ENTER] = 'ENTER',
        [FRAMEEVENT_MOUSE_LEAVE] = 'LEAVE',
        [FRAMEEVENT_MOUSE_UP] = 'UP',
        [FRAMEEVENT_MOUSE_DOWN] = 'DOWN',
        [FRAMEEVENT_MOUSE_WHEEL] = 'WHEEL',
        [FRAMEEVENT_CONTROL_CLICK] = 'CLICK',
        [FRAMEEVENT_MOUSE_DOUBLECLICK] = 'DOUBLECLICK',

        -- TODO other events
    }

    private.frameevent = {}
    for event, str in pairs(private.event2str) do
        table.insert(private.frameevent, event)
    end

    -- Protect ConsoleUIBackdrop
    local origBlzGetFrameByName = BlzGetFrameByName
    BlzGetFrameByName = function(name, createContext)
        if name == 'ConsoleUIBackdrop' then
            Log:err('Frame: ConsoleUIBackdrop framehandle is blocked.', 2)
        end
        return origBlzGetFrameByName(name, createContext)
    end

    private.updateTrigger()
end

return static