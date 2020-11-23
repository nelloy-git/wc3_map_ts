--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type FdfSimpleFrameClass
local FdfSimpleFrame = require('Fdf.Simple.Frame') or error('')
---@type FdfSimpleStringClass
local FdfSimpleString = require('Fdf.Simple.String') or error('')

---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')
---@type FrameExtSimpleStringClass
local FrameExtSimpleString = require('FrameExt.Simple.String') or error('')

--=======
-- Class
--=======

local FrameExtSimpleText = Class.new('FrameExtSimpleText', FrameExt)
---@class FrameExtSimpleText : FrameExt
local public = FrameExtSimpleText.public
---@class FrameExtSimpleTextClass : FrameExtClass
local static = FrameExtSimpleText.static
---@type FrameExtSimpleTextClass
local override = FrameExtSimpleText.override
local private = {}

--=========
-- Static
--=========

---@param child FrameExtSimpleText | nil
---@return FrameExtSimpleText
function override.new(child)
    if child then isTypeErr(child, FrameExtSimpleText, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleText)
    instance = FrameExt.new(private.fdf, instance)

    local string = BlzGetFrameByName(private.fdf_string, 0)
    private.newData(instance, string)

    return instance
end

---@param handle framehandle
---@param string framehandle
---@param child FrameExtSimpleText
---@return FrameExtSimpleText
function override.link(handle, string, child)
    isTypeErr(handle, 'framehandle', 'handle')
    isTypeErr(string, 'framehandle', 'string')
    if child then isTypeErr(child, FrameExtSimpleText, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleText)
    instance = FrameExt.link(handle, true, instance)

    private.newData(instance, string)

    return instance
end

--========
-- Public
--========

---@param text string
 function public:setText(text)
    isTypeErr(self, FrameExtSimpleText, 'self')
    isTypeErr(text, 'string', 'text')

    private.data[self].string:setText(text)
 end

---@param font string
---@param size number
---@param flags number | nil
function public:setFont(font, size, flags)
    isTypeErr(self, FrameExtSimpleText, 'self')
    isTypeErr(font, 'string', 'font')
    isTypeErr(size, 'number', 'size')
    if flags then isTypeErr(flags, 'number', 'flags') end

    private.data[self].string:setFont(font, size, flags)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self FrameExtSimpleText
---@param string framehandle
function private.newData(self, string)
    local priv = {
        string = FrameExtSimpleString.link(string),
    }
    private.data[self] = priv
end

private.fdf = FdfSimpleFrame.new('FrameExtSimpleText')
private.fdf:setWidth(0.04)
private.fdf:setHeight(0.01)
    private.fdf_string = FdfSimpleString.new('FrameExtSimpleTextString')
    private.fdf_string:setFont('fonts\\nim_____.ttf', 0.008)
private.fdf:addSubframe(private.fdf_string)

return static