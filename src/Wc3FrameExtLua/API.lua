LibManager.startLib('Wc3FrameExt')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')
LibManager.addDepency('Wc3Handle', 'https://github.com/nelloy-git/Wc3Handle.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class Wc3FrameExt
local Wc3FrameExt = {}

--========
-- Screen
--========

---@type FrameScreen
Wc3FrameExt.Screen = require('Screen') or error('')

--=====
-- Fdf
--=====

---@type FdfData
Wc3FrameExt.Fdf = require('FdfData') or error('')

---@type FdfSimpleFrameClass
Wc3FrameExt.FdfSimpleFrame = require('Fdf.Simple.Frame') or error('')
---@type FdfSimpleLayerClass
Wc3FrameExt.FdfSimpleLayer = require('Fdf.Simple.Layer') or error('')
---@type FdfSimpleStatusBarClass
Wc3FrameExt.FdfSimpleStatusBar = require('Fdf.Simple.StatusBar') or error('')
---@type FdfSimpleStringClass
Wc3FrameExt.FdfSimpleString = require('Fdf.Simple.String') or error('')
---@type FdfSimpleTextureClass
Wc3FrameExt.FdfSimpleTexture = require('Fdf.Simple.Texture') or error('')

---@type FdfBackdropClass
Wc3FrameExt.FdfBackdrop = require('Fdf.Backdrop') or error('')
---@type FdfGlueTextButtonClass
Wc3FrameExt.FdfGlueTextButton = require('Fdf.GlueTextButton') or error('')
---@type FdfHighlightClass
Wc3FrameExt.FdfHighlight = require('Fdf.Highlight') or error('')
---@type FdfTextClass
Wc3FrameExt.FdfText = require('Fdf.Text') or error('')

----------
-- Frames
----------

---@type FrameExt
Wc3FrameExt.Frame = require('FrameExt') or error('')

---@type FrameExtSimpleFrameClass
Wc3FrameExt.SimpleFrame = require('FrameExt.Simple.Frame') or error('')
---@type FrameExtSimpleStatusBarClass
Wc3FrameExt.SimpleStatusBar = require('FrameExt.Simple.StatusBar') or error('')
---@type FrameExtSimpleStringClass
Wc3FrameExt.SimpleString = require('FrameExt.Simple.String') or error('')
---@type FrameExtSimpleTextClass
Wc3FrameExt.SimpleText = require('FrameExt.Simple.Text') or error('')
---@type FrameExtSimpleTextureClass
Wc3FrameExt.SimpleTexture = require('FrameExt.Simple.Texture') or error('')

---@type FrameExtBackdropClass
Wc3FrameExt.Backdrop = require('FrameExt.Backdrop') or error('')
---@type FrameExtGlueTextButtonClass
Wc3FrameExt.GlueTextButton = require('FrameExt.GlueTextButton') or error('')
---@type FrameExtHighlightClass
Wc3FrameExt.Highlight = require('FrameExt.Highlight') or error('')
---@type FrameExtTextClass
Wc3FrameExt.Text = require('FrameExt.Text') or error('')

--========
-- Origin
--========

Wc3FrameExt.Origin = {}

local function initOrigin()
    ---@type FrameExtOriginChatBox
    Wc3FrameExt.Origin.ChatBox = require('Origin.ChatBox') or error('')
    ---@type FrameExtOriginChatEditBox
    Wc3FrameExt.Origin.ChatEditBox = require('Origin.ChatEditBox') or error('')
    ---@type FrameExtOriginCursor
    Wc3FrameExt.Origin.Cursor = require('Origin.Cursor') or error('')
    ---@type FrameExtOriginInventory
    Wc3FrameExt.Origin.Inventory = require('Origin.Inventory') or error('')
    ---@type FrameExtOriginGameUI
    Wc3FrameExt.Origin.GameUI = require('Origin.GameUI') or error('')
    ---@type FrameExtOriginMinimap
    Wc3FrameExt.Origin.Minimap = require('Origin.Minimap') or error('')
    ---@type FrameExtOriginPortrait
    Wc3FrameExt.Origin.Portrait = require('Origin.Portrait') or error('')
    ---@type FrameExtOriginSkillButton[]
    Wc3FrameExt.Origin.SkillButton = require('Origin.SkillButton') or error('')
    ---@type FrameExtOriginTooltip
    Wc3FrameExt.Origin.Tooltip = require('Origin.Tooltip') or error('')
end

if not IsGame() then
    initOrigin()
else
    local init_timer = CreateTimer()
    TimerStart(init_timer, 0, false, function() initOrigin() DestroyTimer(init_timer) end)
end

--==========
-- Settings
--==========

---@type FrameExtSettings
local Settings = require('Settings')

LibManager.endLib()

return Wc3FrameExt