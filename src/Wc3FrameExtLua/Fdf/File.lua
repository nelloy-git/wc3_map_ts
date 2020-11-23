--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local ImportFile = Wc3Utils.ImportFile or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')
local pairsByKeys = Wc3Utils.pairsByKeys or error('')

--=======
-- Class
--=======

local FdfFile = Class.new('FdfFile')
---@class FdfFile
local public = FdfFile.public
---@class FdfFileClass
local static = FdfFile.static
---@type FdfFileClass
local override = FdfFile.override
local private = {}

--=========
-- Static
--=========

---@param name string
---@param child FdfFile | nil
---@return FdfFile
function override.new(name, child)
    isTypeErr(name, 'string', 'name')
    if child then isTypeErr(child, FdfFile, 'child') end

    local instance = child or Class.allocate(FdfFile)
    private.newData(instance, name)

    return instance
end

---@param filename string
---@return FdfFile
function static.init(filename)
    local file = static.new(filename)

    if private.names[filename] then
        Log:err('FdfFile: file with the same name already exists.', 2)
    end
    private.names[filename] = true

    if IsGame() then
        if not BlzLoadTOCFile(private.dst_dir..filename..'.toc') then
            Log:err('Can not load '..private.dst_dir..filename..'.toc')
        end
    end

    return file
end

--========
-- Public
--========

---@param fdf_data FdfData
function public:add(fdf_data)
    private.data[self].frames[fdf_data] = true
end

---@param fdf_data FdfData
function public:remove(fdf_data)
    private.data[self].frames[fdf_data] = nil
end

--- Compiletime only.
function public:save()
    isTypeErr(self, FdfFile, 'self')
    local priv = private.data[self]

    if IsGame() then
        Log:err('FdfFile: can be saved in buildtime only', 2)
    end

    local log_msg = 'Created new FdfFile \''..priv.name..'\' containing:'
    local text = ''
    local sort_func = function(k1, k2) return k1:getName() < k2:getName() end
    for frame, _ in pairsByKeys(priv.frames, sort_func) do
        log_msg = log_msg..'\n    '..frame:getName()
        text = text..frame:serialize()..'\n'
    end

    local sep = package.config:sub(1,1)
    local fdf_path = GetDst()..sep..private.dst_dir..priv.name..'.fdf'
    local toc_path = GetDst()..sep..private.dst_dir..priv.name..'.toc'

    ImportFile.empty(private.dst_dir..priv.name..'.fdf')
    local fdf = assert(io.open(fdf_path, "w"))
    fdf:write(text)
    fdf:close()

    ImportFile.empty(private.dst_dir..priv.name..'.toc')
    local toc = assert(io.open(toc_path, "w"))
    toc:write(private.dst_dir..priv.name..".fdf\n\n\n")
    toc:close()

    Log:msg(log_msg)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.names = setmetatable({}, {__mode = 'k'})
BuildFinal(function()
    for file, priv in pairs(private.data) do
        file:save()
    end
end)

---@param self FdfFile
---@param name string
function private.newData(self, name)
    ---@class FdfFilePrivate
    local priv = {
        name = name,
        frames = {}
    }
    private.data[self] = setmetatable(priv, private.metatable)
end

if not IsGame() then
    local sep = package.config:sub(1,1)
    private.dst_dir = 'war3mapImported'..sep..'Wc3FrameExt'..sep
end

return static