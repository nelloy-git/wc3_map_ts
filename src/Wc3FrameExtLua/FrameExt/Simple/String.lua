--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')

--=======
-- Class
--=======

local FrameExtSimpleString = Class.new('FrameExtSimpleString', FrameExt)
---@class FrameExtSimpleString : Frame
local public = FrameExtSimpleString.public
---@class FrameExtSimpleStringClass : FrameClass
local static = FrameExtSimpleString.static
---@type FrameExtSimpleStringClass
local override = FrameExtSimpleString.override
local private = {}

--=========
-- Static
--=========

function override.new()
    Log:err(tostring(FrameExtSimpleString)..': can not be created manually.')
end

---@param handle framehandle
---@param child FrameExtSimpleString | nil
---@return FrameExtSimpleString
function override.link(handle, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if child then isTypeErr(child, FrameExtSimpleString, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleString)
    instance = FrameExt.link(handle, true, instance)

    return instance
end

--========
-- Public
--========

---@param text string
function public:setText(text)
    isTypeErr(self, FrameExtSimpleString, 'self')
    isTypeErr(text, 'string', 'text')

    BlzFrameSetText(self:getData(), text)
end

---@param font string
---@param size number
---@param flags number | nil
function public:setFont(font, size, flags)
    isTypeErr(self, FrameExtSimpleString, 'self')
    isTypeErr(font, 'string', 'font')
    isTypeErr(size, 'number', 'size')
    if flags then isTypeErr(flags, 'number', 'flags') end

    BlzFrameSetFont(self:getData(), font, size, flags or 0)
end

--=========
-- Private
--=========

return static