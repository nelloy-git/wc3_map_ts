--=========
-- Include
--=========

---@type DamageLib
local DamageLib = require(LibList.DamageLib) or error('')
---@type HandleLib
local HandleLib = require(LibList.HandleLib) or error('')
local TextTag = HandleLib.TextTag

--========
-- Module
--========

---@class DamageShowText
local DamageShowText = {}

DamageShowText.Colors = {}
DamageShowText.Colors[DamageLib.Atk] = {r = 220, g = 30, b = 30, a = 200}
DamageShowText.Colors[DamageLib.Phys] = {r = 220, g = 30, b = 30, a = 200}
DamageShowText.Colors[DamageLib.Magic] = {r = 30, g = 30, b = 220, a = 200}
DamageShowText.Colors[DamageLib.Chaos] = {r = 220, g = 220, b = 220, a = 200}

DamageShowText.Height = {}
DamageShowText.Height[DamageLib.Atk] = 0
DamageShowText.Height[DamageLib.Phys] = 0
DamageShowText.Height[DamageLib.Magic] = 50
DamageShowText.Height[DamageLib.Chaos] = 100

DamageShowText.Vel = {}
DamageShowText.Vel[DamageLib.Atk] = {x = 0.05, y = 0}
DamageShowText.Vel[DamageLib.Phys] = {x = 0.05, y = 0}
DamageShowText.Vel[DamageLib.Magic] = {x = 0.03, y = 0.03}
DamageShowText.Vel[DamageLib.Chaos] = {x = 0, y = 0.05}

---@type DamageEventCallback
DamageShowText.DamageEvent = function(dmg, dmg_type, target, damager)
    if dmg < 1 then return dmg end

    local idmg, _ = math.modf(dmg)
    local sdmg = tostring(idmg)
    local color = DamageShowText.Colors[dmg_type]
    local height = DamageShowText.Height[dmg_type]
    local vel = DamageShowText.Vel[dmg_type]
    TextTag.newTimedForUnit(sdmg, 12,
                            color.r, color.g, color.b, color.a,
                            target, height,
                            vel.x, vel.y, 1)
    return dmg
end
DamageLib.addAction(DamageLib.Atk, -10000, DamageShowText.DamageEvent)
DamageLib.addAction(DamageLib.Phys, -10000, DamageShowText.DamageEvent)
DamageLib.addAction(DamageLib.Magic, -10000, DamageShowText.DamageEvent)
DamageLib.addAction(DamageLib.Chaos, -10000, DamageShowText.DamageEvent)

return DamageShowText