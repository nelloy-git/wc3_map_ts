--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Frame = Class.new('Frame', Handle)
---@class Frame : Handle
local public = Frame.public
---@class FrameClass : HandleClass
local static = Frame.static
---@type FrameClass
local override = Frame.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param is_simple boolean
---@param child Frame | nil
---@return Frame
function override.new(name, is_simple, child)
    isTypeErr(name, 'string', 'name')
    isTypeErr(is_simple, 'boolean', 'is_simple')
    if child then isTypeErr(child, Frame, 'child') end

    local handle = private.createFramehandle(name, is_simple)
    return static.link(handle, is_simple, child)
end

---@param handle framehandle
---@param is_simple boolean
---@param child Frame | nil
---@return Frame
function override.link(handle, is_simple, child)
    isTypeErr(handle, 'framehandle', 'handle')
    isTypeErr(is_simple, 'boolean', 'is_simple')
    if child then isTypeErr(child, Frame, 'child') end

    local instance = child or Class.allocate(Frame)
    instance = Handle.new(handle, BlzDestroyFrame, instance)
    private.newData(instance, is_simple)

    return instance
end

--========
-- Public
--========

---@return boolean
function public:isSimple()
    isTypeErr(self, Frame, 'self')
    return private.data[self].is_simple
end

---@param point framepointtype
---@param relative Frame
---@param relative_point framepointtype
---@param x number
---@param y number
function public:setPoint(point, relative, relative_point, x, y)
    isTypeErr(self, Frame, 'self')
    isTypeErr(point, 'framepoint', 'point')
    isTypeErr(relative, Frame, 'relative')
    isTypeErr(relative_point, 'framerelative_point', 'point')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')

    BlzFrameSetPoint(self:getData(), point,
                     relative:getData(), relative_point,
                     x, y)
end

---@param point framepointtype
---@param x number
---@param y number
function public:setAbsPoint(point, x, y)
    isTypeErr(self, Frame, 'self')
    isTypeErr(point, 'framepoint', 'point')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')

    BlzFrameSetAbsPoint(self:getData(), point, x, y)
end

function public:clearAllPoints()
    isTypeErr(self, Frame, 'self')
    BlzFrameClearAllPoints(self:getData())
end

---@param relative Frame
function public:setAllPoints(relative)
    isTypeErr(self, Frame, 'self')
    isTypeErr(relative, Frame, 'relative')
    BlzFrameSetAllPoints(self:getData(), relative:getData())
end

---@return boolean
function public:isVisible()
    isTypeErr(self, Frame, 'self')
    return BlzFrameIsVisible(self:getData())
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, Frame, 'self')
    isTypeErr(flag, 'boolean', 'flag')

    BlzFrameSetVisible(self:getData(), flag)
end

---@return boolean
function public:isEnabled()
    isTypeErr(self, Frame, 'self')
    return BlzFrameGetEnable(self:getData())
end

---@param flag boolean
function public:setEnabled(flag)
    isTypeErr(self, Frame, 'self')
    isTypeErr(flag, 'boolean', 'flag')
    BlzFrameSetEnable(self:getData(), flag)
end

--- [0, 1]
---@param alpha number
function public:setAlpha(alpha)
    isTypeErr(self, Frame, 'self')
    isTypeErr(alpha, 'number', 'alpha')

    alpha = alpha > 1 and 1 or alpha < 0 and 0 or alpha
    BlzFrameSetAlpha(self:getData(), math.floor(255 * alpha))
end


---@param width number
---@param height number
function public:setSize(width, height)
    isTypeErr(self, Frame, 'self')
    isTypeErr(width, 'number', 'width')
    isTypeErr(height, 'number', 'height')
    BlzFrameSetSize(self:getData(), width, height)
end

---@return number
function public:getWidth()
    isTypeErr(self, Frame, 'self')
    return BlzFrameGetWidth(self:getData())
end

---@return number
function public:getHeight()
    isTypeErr(self, Frame, 'self')
    return BlzFrameGetHeight(self:getData())
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, Frame, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    local i_color = BlzConvertColor(math.floor(255 * color.r),
                                    math.floor(255 * color.g),
                                    math.floor(255 * color.b),
                                    math.floor(255 * color.a))
    BlzFrameSetVertexColor(self:getData(), i_color)
end

---@return Color
function public:getColor()
    isTypeErr(self, Frame, 'self')
    return Color.copy(private.data[self].color)
end

---@param level number
function public:setLevel(level)
    isTypeErr(self, Frame, 'self')
    isTypeErr(level, 'number', 'level')
    BlzFrameSetLevel(self:getData(), level)
end

---@param parent Frame | nil
function public:setParent(parent)
    isTypeErr(self, Frame, 'self')
    if parent then isTypeErr(parent, Frame, 'parent') end
    BlzFrameSetParent(self:getData(), parent and parent:getData() or nil)
end

---@return Frame | nil
function public:getParent()
    isTypeErr(self, Frame, 'self')
    return static.getLinked(BlzFrameGetParent(self:getData()))
end

---@param index number
---@return Frame | nil
function public:getChild(index)
    isTypeErr(self, Frame, 'self')
    isTypeErr(index, 'number', 'index')
    return static.getLinked(BlzFrameGetChild(self:getData(), index))
end

---@return number
function public:getChildrenCount()
    isTypeErr(self, Frame, 'self')
    return BlzFrameGetChildrenCount(self:getData())
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Frame
---@param is_simple boolean
function private.newData(self, is_simple)
    local priv = {
        color = Color.new(1, 1, 1, 1),
        is_simple = is_simple,
    }
    private.data[self] = priv
end

---@param name string
---@param is_simple boolean
---@return framehandle
function private.createFramehandle(name, is_simple)
    local handle
    local test_handle
    if is_simple then
        handle = BlzCreateSimpleFrame(name, nil, 0)
        test_handle = BlzCreateSimpleFrame('', nil, 0)
    else
        handle = BlzCreateFrame(name, private.console_ui_backdrop, 0, 0)
        test_handle = BlzCreateFrame('', private.console_ui_backdrop, 0, 0)
    end

    if tostring(handle) == tostring(test_handle) then
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test_handle)
        Log:err('Can not create framehandle', 3)
    end
    BlzDestroyFrame(test_handle)

    return handle
end

return static