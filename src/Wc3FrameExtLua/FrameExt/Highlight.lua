--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfHighlightClass
local FdfHighlight = require('Fdf.Highlight') or error('')
---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')

--=======
-- Class
--=======

local FrameExtHighlight = Class.new('FrameExtHighlight', FrameExt)
---@class FrameExtHighlight : FrameExt
local public = FrameExtHighlight.public
---@class FrameExtHighlightClass : FrameExtClass
local static = FrameExtHighlight.static
---@type FrameExtHighlightClass
local override = FrameExtHighlight.override
local private = {}

--=========
-- Static
--=========

---@param fdf FdfHighlight | nil
---@param child FrameExtHighlight | nil
---@return FrameExtHighlight
function override.new(fdf, child)
    if fdf then isTypeErr(fdf, FdfHighlight, 'fdf') end
    if child then isTypeErr(child, FrameExtHighlight, 'child') end

    fdf = fdf or private.defult_fdf
    local instance = child or Class.allocate(FrameExtHighlight)
    instance = FrameExt.new(fdf, instance)

    return instance
end

---@param handle framehandle
---@param child FrameExtHighlight | nil
---@return FrameExtHighlight
function override.link(handle, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if child then isTypeErr(child, FrameExtHighlight, 'child') end

    local instance = child or Class.allocate(FrameExtHighlight)
    instance = FrameExt.link(handle, false, instance)

    return instance
end

--========
-- Public
--========

---@param tex_file string
---@param flag number | nil
---@param blend boolean | nil
function public:setTexture(tex_file, flag, blend)
    isTypeErr(self, FrameExtHighlight, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')
    if flag then isTypeErr(flag, 'number', 'flag') end
    if blend then isTypeErr(blend, 'boolean', 'blend') end

    BlzFrameSetTexture(self:getData(), tex_file, flag or 0, blend or true)
end

--- Disabled.
function public:addAction()
    isTypeErr(self, FrameExtHighlight, 'self')
    Log:wrn(tostring(FrameExtHighlight)..': events are not available for this class.')
end

--=========
-- Private
--=========

---@type FdfHighlight
private.defult_fdf = FdfHighlight.new('FrameExtHighlight')
private.defult_fdf:setWidth(0.04)
private.defult_fdf:setHeight(0.04)
private.defult_fdf:setAlphaFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')

return static