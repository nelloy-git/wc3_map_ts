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

local FrameExtSimpleTexture = Class.new('FrameExtSimpleTexture', FrameExt)
---@class FrameExtSimpleTexture : FrameExt
local public = FrameExtSimpleTexture.public
---@class FrameExtSimpleTextureClass : FrameExtClass
local static = FrameExtSimpleTexture.static
---@type FrameExtSimpleTextureClass
local override = FrameExtSimpleTexture.override
local private = {}

--=========
-- Static
--=========

function override.new()
    Log:err(tostring(FrameExtSimpleTexture)..': can not be created manually.')
end

---@param handle framehandle
---@param child FrameExtSimpleTexture | nil
---@return FrameExtSimpleTexture
function override.link(handle, child)
    isTypeErr(handle, 'framehandle', 'handle')
    if child then isTypeErr(child, FrameExtSimpleTexture, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleTexture)
    instance = FrameExt.link(handle, true, instance)

    return instance
end

--========
-- Public
--========

---@param tex_file string
---@param flag number | nil
---@param blend boolean | nil
function public:setTexture(tex_file, flag, blend)
    isTypeErr(self, FrameExtSimpleTexture, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')
    if flag then isTypeErr(flag, 'number', 'flag') end
    if blend then isTypeErr(blend, 'boolean', 'blend') end

    BlzFrameSetTexture(self:getData(), tex_file, flag or 0, blend or true)
end

--- Disabled.
function public:addAction()
    isTypeErr(self, FrameExtSimpleTexture, 'self')
    Log:wrn(tostring(FrameExtSimpleTexture)..': events are not available for this class.')
end

--=========
-- Private
--=========

return static