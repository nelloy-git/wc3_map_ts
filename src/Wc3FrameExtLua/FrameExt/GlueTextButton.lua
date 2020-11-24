--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfGlueTextButtonClass
local FdfGlueTextButton = require('Fdf.GlueTextButton') or error('')

---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')
local FrameExtPublic = Class.getPublic(FrameExt) or error('')
---@type FrameExtBackdropClass
local Backdrop = require('FrameExt.Backdrop') or error('')
---@type FrameExtHighlightClass
local Highlight = require('FrameExt.Highlight') or error('')
---@type FrameExtTextClass
local Text = require('FrameExt.Text') or error('')

--=======
-- Class
--=======

local FrameExtGlueTextButton = Class.new('FrameExtGlueTextButton', FrameExt)
---@class FrameExtGlueTextButton : FrameExt
local public = FrameExtGlueTextButton.public
---@class FrameExtGlueTextButtonClass : FrameExtClass
local static = FrameExtGlueTextButton.static
---@type FrameExtGlueTextButtonClass
local override = FrameExtGlueTextButton.override
local private = {}

--=========
-- Static
--=========

---@param fdf FdfGlueTextButton | nil
---@param child FrameExtGlueTextButton | nil
---@return FrameExtGlueTextButton
function override.new(fdf, child)
    if fdf then isTypeErr(fdf, FdfGlueTextButton, 'fdf') end
    if child then isTypeErr(child, FrameExtGlueTextButton, 'child') end

    ---@type FdfGlueTextButton
    fdf = fdf or private.default_fdf
    local instance = child or Class.allocate(FrameExtGlueTextButton)
    instance = FrameExt.new(fdf, instance)

    local normal = private.getElement(fdf, 'NORMAL')
    local pushed = private.getElement(fdf, 'PUSHED')
    local disabled = private.getElement(fdf, 'DISABLED')
    local mouse = private.getElement(fdf, 'MOUSE')
    local focus = private.getElement(fdf, 'FOCUS')
    local text = private.getElement(fdf, 'TEXT')
    private.newData(instance, normal, pushed, disabled, mouse, focus, text)

    return instance
end

---@param handle framehandle
---@param normal framehandle | nil
---@param pushed framehandle | nil
---@param disabled framehandle | nil
---@param mouse framehandle | nil
---@param focus framehandle | nil
---@param text framehandle | nil
---@param child FrameExtGlueTextButton | nil
function override.link(handle, normal, pushed, disabled, mouse, focus, text, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if normal then isTypeErr(normal, 'framehandle', 'normal') end
    if pushed then isTypeErr(pushed, 'framehandle', 'pushed') end
    if disabled then isTypeErr(disabled, 'framehandle', 'disabled') end
    if mouse then isTypeErr(mouse, 'framehandle', 'mouse') end
    if focus then isTypeErr(focus, 'framehandle', 'focus') end
    if text then isTypeErr(text, 'framehandle', 'text') end

    local instance = child or Class.allocate(FrameExtGlueTextButton)
    instance = FrameExt.link(handle, false, child)

    private.newData(instance, normal, pushed, disabled, mouse, focus, text)

    return instance
end

--========
-- Public
--========

---@param elem string  | "'NORMAL'" | "'PUSHED'" | "'DISABLED'" | "'MOUSE'" | "'FOCUS'" | "'TEXT'"
---@return FrameExtBackdrop | FrameExtHighlight | FrameExtText | nil
function public:getElement(elem)
    isTypeErr(self, FrameExtGlueTextButton, 'self')
    isTypeErr(elem, 'string', 'elem')

    return private.data[self].elements[elem]
end

---@param event string | "'ENTER'" | "'LEAVE'" | "'UP'" | "'DOWN'" | "'WHEEL'" | "'CLICK'" | "'DOUBLECLICK'"
---@param callback FrameExtCallback
---@return Action
function public:addAction(event, callback)
    isTypeErr(self, FrameExtGlueTextButton, 'self')
    isTypeErr(event, 'string', 'event')
    isTypeErr(callback, 'function', 'callback')

    if not private.available_events[event] then
        Log:err(tostring(FrameExtGlueTextButton)..': event \''..event..'\' is not available.')
    end
    return FrameExtPublic.addAction(self, event, callback)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self FrameExtGlueTextButton
---@param normal framehandle | nil
---@param pushed framehandle | nil
---@param disabled framehandle | nil
---@param mouse framehandle | nil
---@param focus framehandle | nil
---@param text framehandle | nil
function private.newData(self, normal, pushed, disabled, mouse, focus, text)
    local priv = {
        elements = {
            NORMAL = normal and Backdrop.link(normal) or nil,
            PUSHED = pushed and Backdrop.link(pushed) or nil,
            DISABLED = disabled and Backdrop.link(disabled) or nil,
            MOUSE = mouse and Highlight.link(mouse) or nil,
            FOCUS = focus and Highlight.link(focus) or nil,
            TEXT = text and Text.link(text) or nil,
        },
    }
    private.data[self] = priv
end

---@param fdf FdfGlueTextButton
---@param elem string | "'NORMAL'" | "'PUSHED'" | "'DISABLED'" | "'MOUSE'" | "'FOCUS'" | "'TEXT'"
---@return framehandle | nil
function private.getElement(fdf, elem)
    local elem_fdf = fdf:hasElement(elem) and fdf:getElement(elem) or nil
    return elem_fdf and BlzGetFrameByName(elem_fdf:getName(), 0) or nil
end

private.default_fdf = FdfGlueTextButton.new('FrameExtGlueTextButton')
private.default_fdf:setWidth(0.04)
private.default_fdf:setHeight(0.04)
private.default_fdf:setControlStyle(true, true, true)

---@type FdfBackdrop
private.fdf_normal = private.default_fdf:getElement('NORMAL')
private.fdf_normal:setBackground("")

---@type FdfBackdrop
private.fdf_pushed = private.default_fdf:getElement('PUSHED')
private.fdf_pushed:setBackground("")

---@type FdfBackdrop
private.fdf_disabled = private.default_fdf:getElement('DISABLED')
private.fdf_disabled:setBackground("")

---@type FdfHighlight
private.fdf_mouse = private.default_fdf:getElement('MOUSE')
private.fdf_mouse:setHighlightType('FILETEXTURE')
private.fdf_mouse:setAlphaFile("UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp")
private.fdf_mouse:setAlphaMode('ADD')

---@type FdfHighlight
private.fdf_focus = private.default_fdf:getElement('FOCUS')
private.fdf_focus:setHighlightType('FILETEXTURE')
private.fdf_focus:setAlphaFile("UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp")
private.fdf_focus:setAlphaMode('ADD')

private.available_events = {
    ENTER = true,
    LEAVE = true,
    UP = true,
    DOWN = true,
    WHEEL = true,
    CLICK = true,
    DOUBLECLICK = true,
}

return static