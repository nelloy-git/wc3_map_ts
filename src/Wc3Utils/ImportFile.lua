--=========
-- Include
--=========

---@type UtilsSettings
local Settings = require('Settings') or error('')
local Log = Settings.default_logger or error('')

--=======
-- Module
--========

---@class ImportFile
local ImportFile = {}
local sep
if not IsGame() then
    sep = Macro(package.config:sub(1,1))
else
    sep = '\\'
end

local function split (inputstr, sep)
    if sep == nil then
        sep = "%s"
    end
    local t={}
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
        table.insert(t, str)
    end
    return t
end

---@param path string
---@return boolean
local function isFileExists(path)
    local ok, err, code = os.rename(path, path)
    if not ok then
       if code == 13 then
          -- Permission denied, but it exists
          return true
       end
    end
    return ok, err
end

---@return boolean
local function isDir(path)
    -- "/" works on both Unix and Windows
    return isFileExists(path.."/")
end

---@param src string
---@param dst string
local function copyFile(src, dst)
    if not isFileExists(src) then
        error("File "..src.." is not exist.")
    end

    local infile = io.open(src, "rb")
    local instr = infile:read("*a")
    infile:close()

    local outfile = io.open(dst, "wb")
    outfile:write(instr)
    outfile:close()
end

-- Lua implementation of PHP scandir function
local function scanDir(directory)
    local i, t, popen = 0, {}, io.popen
    local pfile
    if sep == '/' then
        pfile = popen('ls -a "'..directory..'"')
    else
        pfile = popen('dir '..directory..' /b/a')
    end
    for filename in pfile:lines() do
        i = i + 1
        t[i] = filename
    end
    pfile:close()
    return t
end

---@param src string
---@param dst string
local function copyDir(src, dst)
    if not isDir(dst) then
        os.execute('mkdir '..dst)
    end

    local list = scanDir(src)
    for i = 1, #list do
        ---@type string
        local name = list[i]
        if isDir(src..sep..name) then
            copyDir(src..sep..name, dst..sep..name)
        else
            if isFileExists(src..sep..name) then
                copyFile(src..sep..name, dst..sep..name)
            end
        end
    end
end

---@param path string
---@return string
local function readFile(path)
    if not isFileExists(path) then
        error("Cannot find file "..path, 2)
    end

    local f = io.open(path)
    local str = f:read("*a")
    f:close()
    return str
end

function ImportFile.empty(dst)
    if IsGame() then
        return
    end

    dst = GetDst()..sep..dst
    local tree = split(dst, sep)
    for i = 1, #tree - 1 do
        tree[i] = (tree[i - 1] and tree[i - 1]..sep or '')..tree[i]
        if not isFileExists(tree[i]) then
            os.execute('mkdir '..tree[i])
        end
    end

    local f = assert(io.open(dst, "w"))
    f:write('')
    f:close()
end

function ImportFile.load(src, dst)
    if IsGame() then
        return
    end

    if not isFileExists(src) then
        Log:err("Cant not find import file: "..src, 2)
    end

    dst = GetDst()..sep..dst
    local tree = split(dst, sep)
    for i = 1, #tree - 1 do
        tree[i] = (tree[i - 1] and tree[i - 1]..sep or '')..tree[i]
        if not isFileExists(tree[i]) then
            os.execute('mkdir '..tree[i])
        end
    end

    if isDir(src) then
        copyDir(src, dst)
    else
        copyFile(src, dst)
    end
end

return ImportFile