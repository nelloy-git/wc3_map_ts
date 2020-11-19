LibManager.startLib('Wc3Handle')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class Wc3Handle
local Wc3Handle = {}

---@type HandleClass
Wc3Handle.Handle = require('Handle') or error('')
---@type AbilityClass
Wc3Handle.Ability = require('Handle.Ability') or error('')
---@type DestructableClass
Wc3Handle.Destructable = require('Handle.Destructable') or error('')
---@type EffectClass
Wc3Handle.Effect = require('Handle.Effect') or error('')
-----@type FrameClass
Wc3Handle.Frame = require('Handle.Frame') or error('')
---@type ImageClass
Wc3Handle.Image = require('Handle.Image') or error('')
---@type ImageArcClass
Wc3Handle.ImageArc = require('Handle.Image.Arc') or error('')
---@type ImageLineClass
Wc3Handle.ImageLine = require('Handle.Image.Line') or error('')
---@type ImagePixelClass
Wc3Handle.ImagePixel = require('Handle.Image.Pixel') or error('')
---@type ItemClass
Wc3Handle.Item = require('Handle.Item') or error('')
---@type EffectProjectileClass
Wc3Handle.Projectile = require('Handle.Effect.Projectile') or error('')
---@type SmartTimerClass
Wc3Handle.SmartTimer = require('Handle.SmartTimer') or error('')
---@type TextTagClass
Wc3Handle.TextTag = require('Handle.TextTag') or error('')
---@type TimerClass
Wc3Handle.Timer = require('Handle.Timer') or error('')
---@type TimedObjClass
Wc3Handle.TimedObj = require('TimedObj') or error('')
---@type TriggerClass
Wc3Handle.Trigger = require('Handle.Trigger') or error('')
---@type TriggerEventClass
Wc3Handle.TriggerEvent = require('Handle.TriggerEvent') or error('')
---@type UnitClass
Wc3Handle.Unit = require('Handle.Unit') or error('')

LibManager.endLib()

return Wc3Handle