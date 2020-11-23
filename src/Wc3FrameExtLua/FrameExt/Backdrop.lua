--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type FdfBackdropClass
local FdfBackdrop = require('Fdf.Backdrop') or error('')
---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')

--=======
-- Class
--=======

local FrameExtBackdrop = Class.new('FrameExtBackdrop', FrameExt)
---@class FrameExtBackdrop : FrameExt
local public = FrameExtBackdrop.public
---@class FrameExtBackdropClass : FrameExtClass
local static = FrameExtBackdrop.static
---@type FrameExtBackdropClass
local override = FrameExtBackdrop.override
local private = {}

--=========
-- Static
--=========

---@param fdf FdfBackdrop | nil
---@param child FrameExtBackdrop | nil
---@return FrameExtBackdrop
function override.new(fdf, child)
    if fdf then isTypeErr(fdf, FdfBackdrop, 'fdf') end
    if child then isTypeErr(child, FrameExtBackdrop, 'child') end

    fdf = fdf or private.defult_fdf
    local instance = child or Class.allocate(FrameExtBackdrop)
    instance = FrameExt.new(fdf, instance)

    return instance
end

---@param handle framehandle
---@param child FrameExtBackdrop | nil
---@return FrameExtBackdrop
function override.link(handle, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if child then isTypeErr(child, FrameExtBackdrop, 'child') end

    local instance = child or Class.allocate(FrameExtBackdrop)
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
    isTypeErr(self, FrameExtBackdrop, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')
    if flag then isTypeErr(flag, 'number', 'flag') end
    if blend then isTypeErr(blend, 'boolean', 'blend') end

    BlzFrameSetTexture(self:getData(), tex_file, flag or 0, blend or true)
end

--- Disabled.
function public:addAction()
    isTypeErr(self, FrameExtBackdrop, 'self')
    Log:wrn(tostring(FrameExtBackdrop)..': events are not available for this class.')
end

--=========
-- Private
--=========

---@type FdfBackdrop
private.defult_fdf = FdfBackdrop.new('FrameExtBackdrop')
private.defult_fdf:setWidth(0.04)
private.defult_fdf:setHeight(0.04)
private.defult_fdf:setBackground('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')

return static