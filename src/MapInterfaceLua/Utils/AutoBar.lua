--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local SimpleBar = FrameLib.Simple.StatusBar or error('')
local SimpleBarPublic = Class.getPublic(SimpleBar)
---@type HandleLib
local HandleLib = require(LibList.HandleLib) or error('')
local Timer = HandleLib.Timer or error('')
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local num2str = UtilsLib.num2str or error('')

--=======
-- Class
--=======

local InterfaceAutoBar = Class.new('InterfaceAutoBar', SimpleBar)
---@class InterfaceAutoBar : FrameSimpleStatusBar
local public = InterfaceAutoBar.public
---@class InterfaceAutoBarClass : FrameSimpleStatusBarClass
local static = InterfaceAutoBar.static
---@type InterfaceAutoBarClass
local override = InterfaceAutoBar.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceAutoBar
function override.new()
    local instance = Class.allocate(InterfaceAutoBar)
    instance = SimpleBar.new(instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param func fun():number
function public:setUpdateCurFunc(func)
    private.data[self].getCur = func
end

---@param func fun():number
function public:setUpdateMaxFunc(func)
    private.data[self].getMax = func
end

--- Number of chars after point
---@param precision integer
function public:setPrecision(precision)
    private.data[self].precision = precision or 1
end

---@param flag boolean
function public:showValue(flag)
    private.data[self].show_val = flag
end

---@param flag boolean
function public:showMax(flag)
    private.data[self].show_max = flag
end

---@param flag boolean
function public:showPercent(flag)
    private.data[self].show_perc = flag
end

function public:update()
    local priv = private.data[self]

    local cur = priv.getCur and priv.getCur() or 0
    local max = priv.getMax and priv.getMax() or 0
    local perc = cur / (max == 0 and 1 or max)

    local text = ' '
    if priv.show_val then
        text = text..num2str(cur, priv.precision)..' '
        if priv.show_max then
            text = text..'/ '
        end
    end

    if priv.show_max then
        text = text..num2str(max, priv.precision)..' '
    end

    if priv.show_perc then
        text = text..'('..num2str(100 * perc, 0)..'%) '
    end

    self:setProgress(perc)
    self:setText(text)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self InterfaceAutoBar
function private.newData(self)
    local priv = {
        getCur = nil,
        getMax = nil,
        precision = 1,

        show_val = true,
        show_max = true,
        show_perc = true,
    }
    private.data[self] = priv
end

if not IsCompiletime() then
    private.timer = Timer.new()
    private.timer:start(0.01, true, function()
        for self, _ in pairs(private.data) do
            self:update()
        end
    end)
end

return static