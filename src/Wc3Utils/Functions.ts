//** @noSeltInFile */
import * as lua from "lua-types"

declare namespace string {
    function split(s: string, sep: string){
        let list: string[]
        string.gmatch
        for part in string.gmatch(str, "([^"..sep.."]+)") do
            table.insert(t, part)
        end
        return t
    }
}

export function id2int(){

}

/*
--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass')
local classType = Class.type or error('')
local getClass = Class.getClass or error('')

---@type UtilsSettings
local Settings = require('Settings') or error('')
local Log = Settings.default_logger or error('')

--========
-- Module
--========

---@class UtilsFunctions
local UtilsFunctions = {}

local _cache = {}
local function isArray(t)
    local count = #t
    if count == 0 then
        return false
    end

    for i=1,count do
        local v = t[i]
        if v == nil then
          return false
        end
        t[i] = nil
        _cache[i] = v
    end

    if next(t) then
        return false
    end

    for i=1,count do
        t[i] = _cache[i]
        _cache[i] = nil
    end

    return true
  end

---@param var any
---@param need_type any | any[]
---@return boolean
function UtilsFunctions.checkType(var, need_type)
    if isArray(need_type) then
        for i = 1, #need_type do
            if UtilsFunctions.checkType(var, need_type[i]) then
                return true
            end
        end
        return false
    end

    local real_type = type(var)
    if real_type == 'userdata' then
        local wc3_type_string = tostring(var)
        local pos = wc3_type_string:find(':')
        local wc3_type = wc3_type_string:sub(1, pos - 1)
        if wc3_type ~= need_type then
            return false
        end
        return true
    end

    return classType(var, need_type)
end

---@param var any
---@param need_type any | any[]
---@param var_name string
---@param level number | nil
function UtilsFunctions.isTypeErr(var, need_type, var_name, level)
    if not Settings.isDebug() then
        return
    end

    if UtilsFunctions.checkType(var, need_type) then
        return
    end

    -- Print error
    local real_type = type(var)
    local msg
    level = level and level + 1 or 3
    if real_type == 'userdata' then
        local wc3_type_string = tostring(var)
        local pos = wc3_type_string:find(':')
        local wc3_type = wc3_type_string:sub(1, pos - 1)
        msg = 'variable \''..(var_name or '')..'\'('..wc3_type..') is not of type '
    elseif real_type == 'table' and getClass(var) then
        local class_str = tostring(getClass(var))
        msg = 'variable \''..(var_name or '')..'\'('..class_str..') is not of type '
    else
        msg = 'variable \''..(var_name or '')..'\'('..real_type..') is not of type '
    end

    if isArray(need_type) then
        msg = msg..tostring(need_type[1])
        for i = 2, #need_type do
            msg = msg..'|'..tostring(need_type[i])
        end
    else
        msg = msg..tostring(need_type)
    end

    Log:err(msg, level)
end

---@param id string
---@return number
function UtilsFunctions.id2int(id)
    UtilsFunctions.isTypeErr(id, 'string', 'id')
    local res, _ = string.unpack(">I4", id)
    return res
end

---@param id integer
---@return number
function UtilsFunctions.int2id(id)
    UtilsFunctions.isTypeErr(id, 'number', 'id')
    local res = string.pack(">I4", id)
    return res
end

local uniq_num = 0
---@return number
function UtilsFunctions.getUniqueNumber()
    uniq_num = uniq_num + 1
    return uniq_num
end

--- Function for iterating table
--- for k, v in pairsByKeys(t, f) do ... end
function UtilsFunctions.pairsByKeys(t, f)
    local a = {}
    for n in pairs(t) do table.insert(a, n) end
    table.sort(a, f)
    local i = 0      -- iterator variable
    local iter = function ()   -- iterator function
      i = i + 1
      if a[i] == nil then return nil
      else return a[i], t[a[i]]
      end
    end
    return iter
end

---@param str string
---@param sep string
---@return string
function UtilsFunctions.splitStr(str, sep)
    if sep == nil then
        sep = "%s"
    end

    local t = {}
    for part in string.gmatch(str, "([^"..sep.."]+)") do
        table.insert(t, part)
    end
    return t
end

---@param num number
---@param precision integer
---@return string
function UtilsFunctions.num2str(num, precision)
    num = math.floor(num * 10^precision)
    local s_num = tostring(num)
    local len = s_num:len()
    if len == 1 then
        s_num = '0'..s_num
        len = len + 1
    end

    return s_num:sub(1, len - precision)..'.'..s_num:sub(len - precision + 1)
end

return UtilsFunctions
*/