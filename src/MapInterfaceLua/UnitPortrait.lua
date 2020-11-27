--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local NormalImage = FrameLib.Normal.Image or error('')
local NormalImagePublic = Class.getPublic(NormalImage) or error('')
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local Log = UtilsLib.Log or error('')

--=======
-- Class
--=======

local InterfaceUnitPortrait = Class.new('InterfaceUnitPortrait', NormalImage)
---@class InterfaceUnitPortrait : FrameNormalImage
local public = InterfaceUnitPortrait.public
---@class InterfaceUnitPortraitClass : FrameNormalImageClass
local static = InterfaceUnitPortrait.static
---@type InterfaceUnitPortraitClass
local override = InterfaceUnitPortrait.override
local private = {}

--=========
-- Static
--=========

local static_instance = nil

---@return InterfaceUnitPortrait
function override.new()
    if static_instance then
        Log:wrn('It is static class.')
        return static_instance
    end

    local instance = Class.allocate(InterfaceUnitPortrait)
    instance = NormalImage.new(private.fdf, instance)

    private.newData(instance)

    static_instance = instance
    return instance
end

--========
-- Public
--========

---@param x number
---@param y number
function public:setPos(x, y)
    NormalImagePublic.setPos(self, x, y)
    local priv = private.data[self]

    priv.portrait:setPos(self:getAbsX() + 0.05 * self:getWidth(),
                         self:getAbsY() + 0.05 * self:getHeight())
end

---@param flag boolean
function public:setVisible(flag)
    NormalImagePublic.setVisible(self, flag)
    private.data[self].portrait:setVisible(flag)
end

---@param w number
---@param h number
function public:setSize(w, h)
    NormalImagePublic.setSize(self, w, h)
    local priv = private.data[self]

    priv.portrait:setPos(self:getAbsX() + 0.05 * self:getWidth(),
                         self:getAbsY() + 0.05 * self:getHeight())
    priv.portrait:setSize(0.9 * w, 0.9 * h)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceUnitPortrait
function private.newData(self)
    local priv = {
        portrait = FrameLib.Origin.Portrait,
    }
    private.data[self] = priv
end

private.fdf = FrameLib.Fdf.Normal.Backdrop.new('InterfacePortraitBorder')
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