--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib)
local Image = FrameLib.Normal.Image
local ImagePublic = Class.getPublic(Image)
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local Log = UtilsLib.Log or error('')

--=======
-- Class
--=======

local InterfaceMinimap = Class.new('InterfaceMinimap', Image)
---@class InterfaceMinimap : Image
local public = InterfaceMinimap.public
---@class InterfaceMinimapClass : ImageClass
local static = InterfaceMinimap.static
---@type InterfaceMinimapClass
local override = InterfaceMinimap.override
local private = {}

--=========
-- Static
--=========

local static_instance = nil

---@return InterfaceMinimap
function override.new()
    if static_instance then
        Log:wrn('It is static class.')
        return static_instance
    end

    local instance = Class.allocate(InterfaceMinimap)
    instance = Image.new(private.fdf, instance)

    private.newData(instance)

    static_instance = instance
    return instance
end

---@param handle framehandle
---@param child FrameNormalImage
---@return FrameNormalImage
function override.link(handle, child)
    Log:err(tostring(InterfaceMinimap)..': function \'link\' is not available.', 2)
end

--========
-- Public
--========

---@param w number
---@param h number
function public:setSize(w, h)
    ImagePublic.setSize(self, w, h)
    local priv = private.data[self]

    priv.minimap:setSize(0.9 * w, 0.9 * h)
    priv.minimap:setPos(0.05 * w, 0.05 * h)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceMinimap
function private.newData(self)
    local priv = {
        minimap = FrameLib.Origin.Minimap,
    }
    private.data[self] = priv

    priv.minimap:setParent(self)
end

private.fdf = FrameLib.Fdf.Normal.Backdrop.new('InterfaceMinimapBorder')
private.fdf:setWidth(0.04)
private.fdf:setHeight(0.04)
private.fdf:setBackgroundTileMode(true)
private.fdf:setBackgroundTileSize(0.2)
private.fdf:setBackground('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')
private.fdf:setBlendAll(true)
private.fdf:setInsets(0.005, 0.005, 0.005, 0.005)
private.fdf:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf:setCornerSize(0.0125)
private.fdf:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

return static