--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local NormalButton = FrameLib.Normal.Button or error('')
local NormalButtonPublic = Class.getPublic(NormalButton) or error('')
local NormalImage = FrameLib.Normal.Image or error('')
local SimpleImage = FrameLib.Simple.Image or error('')
---@type TypesLib
local TypesLib = require(LibList.TypesLib) or error('')
local FrameEvemt = TypesLib.FrameEventTypeEnum
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local isTypeErr = UtilsLib.isTypeErr or error('')

---@type InterfaceBuffButtonFdf
local Fdf = require('Interface.Buff.ButtonFdf') or error('')

--=======
-- Class
--=======

local InterfaceBuffButton = Class.new('InterfaceBuffButton', NormalButton)
---@class InterfaceBuffButton : FrameNormalButton
local public = InterfaceBuffButton.public
---@class InterfaceBuffButtonClass : FrameNormalButtonClass
local static = InterfaceBuffButton.static
---@type InterfaceBuffButtonClass
local override = InterfaceBuffButton.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceBuffButton
function override.new(child)
    if child then isTypeErr(child, InterfaceBuffButton, 'child') end

    local instance = child or Class.allocate(InterfaceBuffButton)
    instance = NormalButton.new(Fdf, instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param buff Buff
function public:setBuff(buff)
    local priv = private.data[self]

    priv.buff = buff
    if buff then
        self:setVisible(true)
        self:setNormalTexture(buff:getIcon())
    else
        self:setVisible(false)
    end
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceBuffButton
function private.newData(self)
    local priv = {
        buff = nil,
    }
    private.data[self] = priv
end

return static