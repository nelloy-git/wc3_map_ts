--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')


---@type FdfSimpleFrameClass
local FdfSimpleFrame = require('Fdf.Simple.Frame') or error('')
---@type FdfSimpleLayerClass
local FdfSimpleLayer = require('Fdf.Simple.Layer') or error('')
---@type FdfSimpleStatusBarClass
local FdfSimpleStatusBar = require('Fdf.Simple.StatusBar') or error('')
---@type FdfSimpleStringClass
local FdfSimpleString = require('Fdf.Simple.String') or error('')
---@type FdfSimpleTextureClass
local FdfSimpleTexture = require('Fdf.Simple.Texture') or error('')

---@type FrameExtClass
local FrameExt = require('FrameExt') or error('')
---@type FrameExtSimpleStringClass
local FrameExtSimpleString = require('FrameExt.Simple.String') or error('')
---@type FrameExtSimpleTextureClass
local FrameExtSimpleTexture = require('FrameExt.Simple.Texture') or error('')

--=======
-- Class
--=======

local FrameExtSimpleStatusBar = Class.new('FrameExtSimpleStatusBar', FrameExt)
---@class FrameExtSimpleStatusBar : FrameExt
local public = FrameExtSimpleStatusBar.public
---@class FrameExtSimpleStatusBarClass : FrameExtClass
local static = FrameExtSimpleStatusBar.static
---@type FrameExtSimpleStatusBarClass
local override = FrameExtSimpleStatusBar.override
local private = {}

--=========
-- Static
--=========

---@param child FrameExtSimpleStatusBar | nil
---@return FrameExtSimpleStatusBar
function override.new(child)
    if child then isTypeErr(child, FrameExtSimpleStatusBar, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleStatusBar)
    instance = FrameExt.new(private.fdf, instance)

    local background = BlzGetFrameByName(private.fdf_background:getName(), 0)
    local border = BlzGetFrameByName(private.fdf_border:getName(), 0)
    local string = BlzGetFrameByName(private.fdf_string:getName(), 0)
    private.newData(instance, background, border, string)

    return instance
end

---@param handle framehandle
---@param background framehandle
---@param border framehandle
---@param string framehandle
---@param child FrameExtSimpleStatusBar
---@return FrameExtSimpleStatusBar
function override.link(handle, background, border, string, child)
    isTypeErr(handle, 'framehandle', 'handle')
    isTypeErr(background, 'framehandle', 'background')
    isTypeErr(border, 'framehandle', 'border')
    isTypeErr(string, 'framehandle', 'string')
    if child then isTypeErr(child, FrameExtSimpleStatusBar, 'child') end

    local instance = child or Class.allocate(FrameExtSimpleStatusBar)
    instance = FrameExt.link(handle, true, instance)

    private.newData(instance, background, border, string)

    return instance
end

--========
-- Public
--========

---@param elem string  | "'BACKGROUND'" | "'BORDER'" | "'STRING'"
---@return FrameExtBackdrop | FrameExtHighlight | FrameExtText | nil
function public:getElement(elem)
    isTypeErr(self, FrameExtSimpleStatusBar, 'self')
    isTypeErr(elem, 'string', 'elem')

    return private.data[self].elements[elem]
end

---@param tex_file string
---@param flag number | nil
---@param blend boolean | nil
function public:setBarTexture(tex_file, flag, blend)
    isTypeErr(self, FrameExtSimpleStatusBar, 'self')
    isTypeErr(tex_file, 'string', 'tex_file')
    if flag then isTypeErr(flag, 'number', 'flag') end
    if blend then isTypeErr(blend, 'boolean', 'blend') end

    BlzFrameSetTexture(self:getData(), tex_file, flag or 0, blend or true)
end

 --- [0, 1]
 ---@param value number
 function public:setValue(value)
    isTypeErr(self, FrameExtSimpleStatusBar, 'self')
    isTypeErr(value, 'number', 'value')

    value = value < 0 and 0 or value > 1 and 1 or value
    BlzFrameSetValue(self:getData(), value * 100)
 end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self FrameExtSimpleStatusBar
---@param background framehandle
---@param border framehandle
---@param string framehandle
function private.newData(self, background, border, string)
    local priv = {
        elements = {
            BACKGROUND = FrameExtSimpleTexture.link(background),
            BORDER = FrameExtSimpleTexture.link(border),
            STRING = FrameExtSimpleString.link(string),
        }
    }
    private.data[self] = priv
end

private.fdf = FdfSimpleStatusBar.new('FrameExtSimpleStatusBar')
private.fdf:setWidth(0.04)
private.fdf:setHeight(0.01)
private.fdf:setBarTexture('Replaceabletextures\\Teamcolor\\Teamcolor00.blp')
    private.fdf_layer_back = FdfSimpleLayer.new('BACKGROUND')
        private.fdf_background = FdfSimpleTexture.new('FrameExtSimpleStatusBarTexture')
        private.fdf_background:setFile('Replaceabletextures\\Teamcolor\\Teamcolor27.blp')
    private.fdf_layer_back:addSubframe(private.fdf_background)
private.fdf:addSubframe(private.fdf_layer_back)
    private.fdf_forw = FdfSimpleFrame.new('FrameExtSimpleStatusBarForward')
    private.fdf_forw:setAllPoints(true)
        private.fdf_layer_forw = FdfSimpleLayer.new('ARTWORK')
            private.fdf_string = FdfSimpleString.new('FrameExtSimpleStatusBarString')
            private.fdf_string:setFont('fonts\\nim_____.ttf', 0.008)
            private.fdf_string:setColor(1.0, 1.0, 1.0, 1.0)
            private.fdf_string:setText('')
        private.fdf_layer_forw:addSubframe(private.fdf_string)
            private.fdf_border = FdfSimpleTexture.new('FrameExtSimpleStatusBarBorder')
            private.fdf_border:setFile('UI\\Feedback\\XPBar\\human-xpbar-border.blp') -- from UI/war3skins.txt
        private.fdf_layer_forw:addSubframe(private.fdf_border)
    private.fdf_forw:addSubframe(private.fdf_layer_forw)
private.fdf:addSubframe(private.fdf_forw)

return static