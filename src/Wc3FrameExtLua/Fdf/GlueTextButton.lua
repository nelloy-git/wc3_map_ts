--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfDataClass
local FdfData = require('FdfData') or error('')
---@type FdfBackdropClass
local FdfBackdrop = require('Fdf.Backdrop') or error('')
---@type FdfTextClass
local FdfText = require('Fdf.Text') or error('')
---@type FdfHighlightClass
local FdfHighlight = require('Fdf.Highlight') or error('')

--=======
-- Class
--=======

local FdfGlueTextButton = Class.new('FdfGlueTextButton', FdfData)
---@class FdfGlueTextButton : FdfData
local public = FdfGlueTextButton.public
---@class FdfGlueTextButtonClass : FdfDataClass
local static = FdfGlueTextButton.static
---@type FdfGlueTextButtonClass
local override = FdfGlueTextButton.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfGlueTextButton | nil
---@return FdfGlueTextButton
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfGlueTextButton, 'child') end

    local instance = child or Class.allocate(FdfGlueTextButton)
    instance = FdfData.new(name, 'GLUETEXTBUTTON', false, nil, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param width number
function public:setWidth(width)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(width, 'number', 'width')

    local str_width = tostring(width)
    self:setParameter('Width', str_width)
end

---@param height number
function public:setHeight(height)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(height, 'number', 'height')

    local str_height = tostring(height)
    self:setParameter('Height', str_height)
end

--- Look-Up FileNames in some String table (for example gameinterface)
---@param flag boolean
function public:setDecorateFileNames(flag)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    if flag then
        self:setParameter('DecorateFileNames')
    else
        self:removeParameter('DecorateFileNames')
    end
end

---@param autotrack boolean
---@param highlight_on_focus boolean
---@param highlight_on_mouse_over boolean
function public:setControlStyle(autotrack, highlight_on_focus, highlight_on_mouse_over)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(autotrack, 'boolean', 'autotrack')
    isTypeErr(highlight_on_focus, 'boolean', 'highlight_on_focus')
    isTypeErr(highlight_on_mouse_over, 'boolean', 'highlight_on_mouse_over')

    local flags
    if autotrack then flags = 'AUTOTRACK' end
    if highlight_on_focus then flags = (flags and flags..'|' or '')..'HIGHLIGHTONFOCUS' end
    if highlight_on_mouse_over then flags = (flags and flags..'|' or '')..'HIGHLIGHTONMOUSEOVER' end

    self:setParameter('ControlStyle', '\"'..flags..'\"')
end

---@param x number
---@param y number
function public:setPushedTextOffset(x, y)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')

    self:setParameter('ButtonPushedTextOffset', tostring(x)..' '..tostring(y))
end

---@param elem string | "'NORMAL'" | "'PUSHED'" | "'DISABLED'" | "'MOUSE'" | "'FOCUS'" | "'TEXT'"
---@return boolean
function public:hasElement(elem)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(elem, 'string', 'elem')
    local priv = private.data[self]

    if priv.elements[elem] then
        return true
    end
    return false
end

--- Create element if it does not exist.
---@param elem string | "'NORMAL'" | "'PUSHED'" | "'DISABLED'" | "'MOUSE'" | "'FOCUS'" | "'TEXT'"
---@return FdfBackdrop | FdfHighlight | FdfText
function public:getElement(elem)
    isTypeErr(self, FdfGlueTextButton, 'self')
    isTypeErr(elem, 'string', 'elem')
    local priv = private.data[self]

    if not priv.elements[elem] then
        if elem == 'NORMAL' then
            priv.elements[elem] = FdfBackdrop.new(self:getName()..'Normal')
            private.setControlSubframe(self, 'ControlBackdrop', priv.elements[elem])
        elseif elem == 'PUSHED' then
            priv.elements[elem] = FdfBackdrop.new(self:getName()..'Pushed')
            private.setControlSubframe(self, 'ControlPushedBackdrop', priv.elements[elem])
        elseif elem == 'DISABLED' then
            priv.elements[elem] = FdfBackdrop.new(self:getName()..'Disabled')
            private.setControlSubframe(self, 'ControlDisabledBackdrop', priv.elements[elem])
        elseif elem == 'MOUSE' then
            priv.elements[elem] = FdfHighlight.new(self:getName()..'Mouse')
            private.setControlSubframe(self, 'ControlMouseOverHighlight', priv.elements[elem])
        elseif elem == 'FOCUS' then
            priv.elements[elem] = FdfHighlight.new(self:getName()..'Focus')
            private.setControlSubframe(self, 'ControlFocusHighlight', priv.elements[elem])
        elseif elem == 'TEXT' then
            priv.elements[elem] = FdfText.new(self:getName()..'Text')
            private.setControlSubframe(self, 'ButtonText', priv.elements[elem])
        else
            Log:err(tostring(FdfGlueTextButton)..': wrong element name.', 2)
        end
    end
    return priv.elements[elem]
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self FdfGlueTextButton
function private.newData(self)
    local priv = {
        elements = {
            NORMAL = nil,
            PUSHED = nil,
            DISABLED = nil,
            MOUSE = nil,
            FOCUS = nil,
            TEXT = nil,
        },
    }
    private.data[self] = priv
end

---@param self FdfGlueTextButton
---@param parameter string
---@param subframe FdfData
function private.setControlSubframe(self, parameter, subframe)
    self:setParameter(parameter, '\"'..subframe:getName()..'\"')
    self:addSubframe(subframe)
end

return static