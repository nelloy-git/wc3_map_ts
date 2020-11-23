--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfTextClass
local FdfText = require('Fdf.Text') or error('')
---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')

--=======
-- Class
--=======

local FrameExtText = Class.new('FrameExtText', FrameExt)
---@class FrameExtText : FrameExt
local public = FrameExtText.public
---@class FrameExtTextClass : FrameExtClass
local static = FrameExtText.static
---@type FrameExtTextClass
local override = FrameExtText.override
local private = {}

--=========
-- Static
--=========

---@param fdf FdfText | nil
---@param child FrameExtText | nil
---@return FrameExtText
function override.new(fdf, child)
    if fdf then isTypeErr(fdf, FdfText, 'fdf') end
    if child then isTypeErr(child, FrameExtText, 'child') end

    fdf = fdf or private.default_fdf
    local instance = child or Class.allocate(FrameExtText)
    instance = FrameExt.new(fdf, instance)

    return instance
end

---@param handle framehandle
---@param child FrameExtText
---@return FrameExtText
function override.link(handle, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if child then isTypeErr(child, FrameExtText, 'child') end

    local instance = child or Class.allocate(FrameExtText)
    instance = FrameExt.link(handle, false, instance)

    return instance
end

--========
-- Public
--========

---@param text string
function public:setText(text)
    isTypeErr(self, FrameExt, 'self')
    isTypeErr(text, 'string', 'text')

    BlzFrameSetText(self:getData(), text)
end

--=========
-- Private
--=========

private.default_fdf = FdfText.new('FrameExtText')
private.default_fdf:setWidth(0.04)
private.default_fdf:setHeight(0.04)
private.default_fdf:setFont('fonts\\nim_____.ttf', 0.008)
private.default_fdf:setJustification('JUSTIFYCENTER', 'JUSTIFYMIDDLE')

return static