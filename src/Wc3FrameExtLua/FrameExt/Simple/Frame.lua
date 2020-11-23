--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type FdfSimpleFrameClass
local FdfSimpleFrame = require('Fdf.Simple.Frame') or error('')
---@type FdfSimpleTextureClass
local FdfSimpleTexture = require('Fdf.Simple.Texture') or error('')

---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')
---@type FrameExtSimpleTextureClass
local FrameExtSimpleTexture = require('FrameExt.Simple.Texture') or error('')

--=======
-- Class
--=======

local FrameExtSimpleFrame = Class.new('FrameExtSimpleFrame', FrameExt)
---@class FrameExtSimpleFrame : FrameExt
local public = FrameExtSimpleFrame.public
---@class FrameExtSimpleFrameClass : FrameExtClass
local static = FrameExtSimpleFrame.static
---@type FrameExtSimpleFrameClass
local override = FrameExtSimpleFrame.override
local private = {}

--=========
-- Static
--=========

---@param child FrameExtSimpleFrame | nil
---@return FrameExtSimpleFrame
function override.new(child)
    if child then isTypeErr(child, FrameExtSimpleFrame, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleFrame)
    instance = FrameExt.new(private.fdf, instance)

    local texture = BlzGetFrameByName(private.fdf_texture, 0)
    private.newData(instance, texture)

    return instance
end

---@param handle framehandle
---@param texture framehandle
---@param child FrameExtSimpleFrame
---@return FrameExtSimpleFrame
function override.link(handle, texture, child)
    isTypeErr(handle, 'framehandle', 'handle')
    isTypeErr(texture, 'framehandle', 'texture')
    if child then isTypeErr(child, FrameExtSimpleFrame, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleFrame)
    instance = FrameExt.link(handle, true, instance)

    private.newData(instance, texture)

    return instance
end

--========
-- Public
--========

---@param tex_file string
---@param flag number
---@param blend boolean
function public:setTexture(tex_file, flag, blend)
    isTypeErr(self, FrameExtSimpleFrame, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')
    if flag then isTypeErr(flag, 'number', 'flag') end
    if blend then isTypeErr(blend, 'boolean', 'blend') end

    private.data[self].texture:setTexture(tex_file, flag, blend)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self FrameExtSimpleFrame
---@param texture framehandle
function private.newData(self, texture)
    local priv = {
        texture = FrameExtSimpleTexture.link(texture),
    }
    private.data[self] = priv
end

private.fdf = FdfSimpleFrame.new('FrameExtSimpleFrame')
private.fdf:setWidth(0.04)
private.fdf:setHeight(0.04)
    private.fdf_texture = FdfSimpleTexture.new(private.fdf:getName()..'Texture')
    private.fdf_texture:setFile("")
private.fdf:addSubframe(private.fdf_texture)

return static