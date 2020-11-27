--=========
-- Include
--=========

local Class = require(LibList.ClassLib) or error('')
---@type FrameLib
local FrameLib = require(LibList.FrameLib)
---@type HandleLib
local HandleLib = require(LibList.HandleLib) or error('')
local Frame = HandleLib.Frame or error('')
local FramePublic = Class.getPublic(Frame) or error('')
---@type ParameterLib
local ParamLib = require(LibList.ParameterLib) or error('')
local ParamContainer = ParamLib.UnitContainer or error('')
local paramToStr = ParamLib.paramToStr or error('')
local ParamType = ParamLib.ParamType or error('')
---@type UtilsLib
local UtilsLib = require(LibList.UtilsLib) or error('')
local isTypeErr = UtilsLib.isTypeErr or error('')
local Log = UtilsLib.Log or error('')

--=======
-- Class
--=======

local InterfaceParamList = Class.new('InterfaceParamList', Frame)
---@class InterfaceParamList : Frame
local public = InterfaceParamList.public
---@class InterfaceParamListClass : FrameClass
local static = InterfaceParamList.static
---@type InterfaceParamListClass
local override = InterfaceParamList.override
local private = {}

--=========
-- Static
--=========

---@return InterfaceParamList
function override.new()
    local instance = Class.allocate(InterfaceParamList)
    instance = Frame.new(private.fdf_background:getName(),
                         private.fdf_background:isSimple(),
                         instance)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

function public:setPos(x, y)
    FramePublic.setPos(self, x, y)
    private.updatePos(self)
end

---@param width number
---@param height number
function public:setSize(width, height)
    FramePublic.setSize(self, width, height)
    private.updatePos(self)
end

---@param flag number
function public:setVisible(flag)
    FramePublic.setVisible(self, flag)
    local priv = private.data[self]

    for i = 1, #private.params_order do
        priv.names[i]:setVisible(flag)
        priv.value[i]:setVisible(flag)
    end
end

---@param container ParameterContainer
function public:setParamsContainer(container)
    if container then isTypeErr(container, ParamContainer, 'container') end

    local priv = private.data[self]

    local previous = priv.container
    if previous then
        private.container2interface[previous] = nil
        previous:removeAction(priv.changed_action)
    end

    priv.container = container
    if container then
        private.container2interface[container] = self
        local action = container:addChangedAction(private.containerChanged)
        priv.changed_action = action
    end

    private.updateValues(self)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.container2interface = setmetatable({}, {__mode = 'kv'})

private.fdf_background = FrameLib.Fdf.Normal.Backdrop.new('InterfaceUnitParametersBackground')
private.fdf_background:setWidth(0.04)
private.fdf_background:setHeight(0.04)
private.fdf_background:setBackgroundTileMode(true)
private.fdf_background:setBackgroundTileSize(0.2)
private.fdf_background:setBackground('UI\\Widgets\\ToolTips\\Human\\human-tooltip-background')
private.fdf_background:setInsets(0.005, 0.005, 0.005, 0.005)
private.fdf_background:setCornerFlags('UL|UR|BL|BR|T|L|B|R')
private.fdf_background:setCornerSize(0.0125)
private.fdf_background:setEdgeFile('UI\\Widgets\\ToolTips\\Human\\human-tooltip-border')

private.font = 'fonts\\nim_____.ttf'

---@type table<number, ParameterType>
private.params_order = {}
table.insert(private.params_order, ParamType.PATK)
table.insert(private.params_order, ParamType.MATK)
table.insert(private.params_order, ParamType.PDEF)
table.insert(private.params_order, ParamType.MDEF)
table.insert(private.params_order, ParamType.PRES)
table.insert(private.params_order, ParamType.MRES)
table.insert(private.params_order, ParamType.LIFE)
table.insert(private.params_order, ParamType.REGE)
table.insert(private.params_order, ParamType.MANA)
table.insert(private.params_order, ParamType.RECO)
table.insert(private.params_order, ParamType.PSPD)
table.insert(private.params_order, ParamType.MSPD)
table.insert(private.params_order, ParamType.CRIT)
table.insert(private.params_order, ParamType.MOVE)

private.is_percent = {
    [ParamType.PATK] = false,
    [ParamType.MATK] = false,
    [ParamType.PDEF] = false,
    [ParamType.MDEF] = false,
    [ParamType.PRES] = true,
    [ParamType.MRES] = true,
    [ParamType.LIFE] = false,
    [ParamType.REGE] = false,
    [ParamType.MANA] = false,
    [ParamType.RECO] = false,
    [ParamType.PSPD] = false,
    [ParamType.MSPD] = true,
    [ParamType.CRIT] = true,
    [ParamType.MOVE] = false,
}

do
    local param_count = 0
    for _,_ in pairs(ParamType) do
        param_count = param_count + 1
    end
    if #private.params_order ~= param_count then
        Log:wrn(tostring(InterfaceParamList)..': does not use all parameters. Check \'private.params_order\'. '..
                        tostring(#private.params_order)..'/'..tostring(param_count))
    end
end

---@param self InterfaceParamList
function private.newData(self)
    local priv = {
        container = nil,
        changed_action = nil,

        names = {},
        value = {}
    }
    private.data[self] = priv

    local count = #private.params_order
    for i = 1, count do
        ---@type ParameterType
        local param = private.params_order[i]

        local name = FrameLib.Simple.Text.new()
        name:setText(paramToStr(param))
        table.insert(priv.names, name)

        local value = FrameLib.Simple.Text.new()
        table.insert(priv.value, value)
    end

    private.updatePos(self)
end

---@param self InterfaceParamList
function private.updatePos(self)
    local priv = private.data[self]

    local x = self:getAbsX()
    local y = self:getAbsY()
    local width = self:getWidth()
    local height = self:getHeight()

    local x_border = 0.05 * width   --Insets
    local y_border = 0.05 * height  --Insets

    local count = #private.params_order
    local w_name = (width - 2 * x_border) / 2
    local w_value = (width - 2 * x_border) / 2
    local h = (height - 2 * y_border) / count
    local font_size = 0.9 * h

    for i = 1, count do
        ---@type FrameSimpleText
        local name = priv.names[i]
        name:setPos(x + x_border, y + y_border + (i - 1) * h)
        name:setSize(w_name, h)
        name:setFont(private.font, font_size)
        name:setVisible(self:isVisible())

        ---@type FrameSimpleText
        local value = priv.value[i]
        value:setPos(x + width - x_border - w_value, y + y_border + (i - 1) * h)
        value:setSize(w_value, h)
        value:setFont(private.font, font_size)
        value:setVisible(self:isVisible())
    end
end

---@param self InterfaceParamList
function private.updateValues(self)
    local priv = private.data[self]

    if not priv.container then
        return
    end

    local count = #private.params_order
    for i = 1, count do
        local param = private.params_order[i]

        local val = priv.container:getResult(param)
        local s_val
        if private.is_percent[param] then
            val = 100 * val - (100 * val) % 0.1
            val = (val > -0.5 and val < 0) and 0 or val
            s_val = tostring(val)
            local last = s_val:find('%.') and s_val:find('%.') + 2 or s_val:len()
            s_val = s_val:sub(1, last)..'%'
        else
            val = val - val % 1
            val = (val < 0 and val > -1) and 0 or val
            s_val = tostring(val)
            s_val = s_val:sub(1, s_val:find('%.') or s_val:len())
        end

        priv.value[i]:setText(s_val)
    end
end

---@param container ParameterContainer
---@param param ParameterType
function private.containerChanged(container, param)
    ---@type InterfaceParamList
    local self = private.container2interface[container]
    private.updateValues(self)
    -- TODO optimization
end

return static