--=========
-- Include
--=========

---@type FrameLib
local FrameLib = require(LibList.FrameLib) or error('')
local FdfBackdrop = FrameLib.Fdf.Normal.Backdrop or error('')
local FdfGlueTextButton = FrameLib.Fdf.Normal.GlueTextButton or error('')
local FdfHighlight = FrameLib.Fdf.Normal.Highlight or error('')
local FdfText = FrameLib.Fdf.Normal.Text or error('')

--==========
-- Settings
--==========

local default_texture = ''
local default_highlight = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'

--========
-- Module
--========

---@class InterfaceBuffButtonFdf
local InterfaceBuffButtonFdf = FdfGlueTextButton.new('InterfaceBuffButton')

InterfaceBuffButtonFdf:setWidth(0.02)
InterfaceBuffButtonFdf:setHeight(0.02)
InterfaceBuffButtonFdf:setControlStyle(true, false, true)

local img_normal = InterfaceBuffButtonFdf:getControlNormal()
img_normal:setBackground(default_texture)

local img_disabled = InterfaceBuffButtonFdf:getControlDisabled()
img_disabled:setBackground(default_texture)

local img_pushed = InterfaceBuffButtonFdf:getControlPushed()
img_pushed:setBackground(default_texture)
-- TODO color

local highlight = InterfaceBuffButtonFdf:getControlMouse()
highlight:setHighlightType('FILETEXTURE')
highlight:setAlphaFile(default_highlight)
highlight:setAlphaMode('ADD')

return InterfaceBuffButtonFdf