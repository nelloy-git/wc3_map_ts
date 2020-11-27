--=========
-- Include
--=========

---@type Wc3FrameExt
local Wc3FrameExt = LibManager.getDepency('Wc3FrameExt')
local FdfGlueTextButton = Wc3FrameExt.FdfGlueTextButton or error('')

--==========
-- Settings
--==========

local default_texture = ''
local default_highlight = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
local font = 'fonts\\nim_____.ttf'
local font_size = 0.014

--========
-- Module
--========

---@class InterfaceSkillButtonFdf
local InterfaceSkillButtonFdf = FdfGlueTextButton.new('InterfaceSkillButton')

InterfaceSkillButtonFdf:setWidth(0.04)
InterfaceSkillButtonFdf:setHeight(0.04)
InterfaceSkillButtonFdf:setControlStyle(true, false, true)

local img_normal = InterfaceSkillButtonFdf:getElement('NORMAL')
img_normal:setBackground(default_texture)

local img_disabled = InterfaceSkillButtonFdf:getElement('DISABLED')
img_disabled:setBackground(default_texture)

local img_pushed = InterfaceSkillButtonFdf:getElement('PUSHED')
img_pushed:setBackground(default_texture)
-- TODO color

local highlight = InterfaceSkillButtonFdf:getElement('MOUSE')
highlight:setHighlightType('FILETEXTURE')
highlight:setAlphaFile(default_highlight)
highlight:setAlphaMode('ADD')

return InterfaceSkillButtonFdf