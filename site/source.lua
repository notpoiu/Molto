local Registry = {}

--// Helpers \\--
local function Check(...)
	for index = 1, select("#", ...) do
		if typeof((select(index, ...))) ~= "function" then return false end
	end
	return true
end

local AssetManager = {}
do
	local BASE_PATH = "molto-icons"

	AssetManager.Supported = Check(isfile, isfolder, makefolder, readfile, writefile, getcustomasset)
	AssetManager.CanDelete = AssetManager.Supported and Check(listfiles, delfolder)

	function AssetManager.Path(relative: string?): string
		return if relative then `{BASE_PATH}/{relative}` else BASE_PATH
	end

	function AssetManager.EnsureFolder(relative: string?)
		local current = ""
		for _, part in string.split(AssetManager.Path(relative), "/") do
			current = if current == "" then part else `{current}/{part}`
			if not isfolder(current) then
				makefolder(current)
			end
		end
	end

	function AssetManager.IsFile(relative: string): boolean
		local success, result = pcall(isfile, AssetManager.Path(relative))
		return success and result == true
	end

	function AssetManager.Read(relative: string): string?
		return if AssetManager.IsFile(relative) then readfile(AssetManager.Path(relative)) else nil
	end

	function AssetManager.Write(relative: string, data: string)
		writefile(AssetManager.Path(relative), data)
	end

	function AssetManager.Download(relative: string, url: string, validate: ((string) -> boolean)?)
		if AssetManager.IsFile(relative) then return end

		local data = game:HttpGet(url)
		assert(not validate or validate(data), `Invalid download for {relative}`)
		AssetManager.Write(relative, data)
	end

	function AssetManager.ListNames(): { string }
		local names = {}
		for _, entry in listfiles(BASE_PATH) do
			local name = entry:gsub("\\", "/"):gsub("/$", ""):match("([^/]+)$")
			if name then
				table.insert(names, name)
			end
		end
		return names
	end

	function AssetManager.GetAsset(relative: string): string
		return getcustomasset(AssetManager.Path(relative))
	end
end

--// Constants \\--
local ASSET_BASE_URL = "https://raw.githubusercontent.com/Just3itx/Molto/refs/heads/material-symbols-test/site/"
local DEFAULT_PROVIDER = "lucide"
local PROVIDERS = {lucide={Hash="d696c1613123ecf29dd415cafa9c1c4cfe753307ed88439c7c02e2bf765c75d4",FontSources={"4ebe99c5ae25efcc41662dc5ab6eaba4e593bb8a5553b88beb21214834291fdd","cf5cfeeb5d34dc869e14028d7b3b29890a3210a2e180c3b68bc35f1c68ab2447"},Font=true,Count=1962,SourceHash="423a40bf7c8261df0f4488795f29363459e0d983f7a472a56361a0ca732cb06b",Sheets=2,License="ISC",Name="Lucide",FontParts=2},tabler={Hash="e5e6ef7cc035c9828b5cddf5280412d3081277c7e2550b9ae09e7afad487c846",FontSources={"cc7965bfb2aaf7f3d7f8d0588d5eddefebbbed8b30a59b4b077d5b9f8adf891f","5cee0c3b5b0b34409d30f4a3f9b2f62e22b608c9b6794dff1974c0bc22c69201","91b40bd91bfeca8e50e0cbe4564dc54fc37d18ff81cb9827119bf41f212aa649","ded3bb4c65fe91d7538025ee7a66f156fbf87daadb118f9fadbfdac0663a51ce","e1531143a79337f8b92379276bbbc7dc79a44b69cc5684701432d186e75758c5"},Font=true,Count=6286,SourceHash="c4ac52a2a33e7c753fd0d132626ea18e96e99fd62beaebf9249932767e4f31eb",Sheets=4,License="MIT",Name="Tabler",FontParts=5},heroicons={Hash="da3ef30e5bda1a0cf6586a6de9789a12537d550aec9598eccc85b4326be76615",FontSources={"da02a3a8e3f2b01840e735d0025f9c898a597fa3f22802b8cf61fba7ca4dd065","1a0ce866418752177d2393a48aede97f27ba5c52239eab5e3b7a9b0de15e6c44"},Font=true,Count=1288,SourceHash="6439652a852d969b2916cffd09efb0ab9a6f2127b7b7692b7b0e48315b4b8029",Sheets=1,License="MIT",Name="Heroicons",FontParts=2},material={Hash="28d0dc56de33b9fcb95f90caca7798c3282cb0a26074e15753ff60adb8a4e53b",FontSources={"a6c3b947bc82401b8fb6c7fb8b37cae4efbdbaa7e3b0ea5ee2654ae9f318e3e4","7a7ca51f6604403d8a6f7e20d2625b80aeb9ffecb398775762a24e22c0f470b0","a1ef7a9bf6412ef4532c9eb14284b3046051fcb1b6a65015f1a61d6b692c0f53","e8d6e6babc6a12e7a0d703e5df813b1f3a965359af60e3a8b3673b3289b08f77","acb95b43b3d2b2a0276449de286742820855cacd790c55d81f878e961e35ec81","cfc9890dcf418bcbdcdb7ee3ffc194d21f8a82a648bbec0e19bbffde1740e075","8678c8a58f00204f31e5b39aada3a5bc3aa7c70680c2752c7b328fac72e28d56","dcddc643c20abafef86ff881df4431426570bec2b4d1ec07e9e6df482651104a","29ee2e12f047d3241c81cbf805678ef3e81ab0da562ea43a8d9c57ed9488375b","34c129915b924951d6a63961ee2a0a4df1fa4973b8dbb0f1b514b29db19b8410","736463c4cb2de1dfdb87191833fc9b0bb607c3afcfa8183e886d44a3bf91e445","00d98ed7e153a244c0099221af02796c48ecef42daaa02e5fc602ee1ab439826","74a8f8daf6a161836d72107ee02e942474817440794f3187832dd1450a006862","91d06a7f5b083e2fa865bff7c4742ba1f6f27c415a3462482b783916e0ab911a","4e942f188ad52e90818fc3bf37a28ef188621f546d975d1e537207326a9f7a3b","198f0878e3a7d4a0f6e16c1a754a6db440aeb6d3302d8a6131d5ca80cc81e2a8","2b8e4080a3cff6c658c825c0f283bca3ae51192f6370381ccee8d0c33ece58e3"},Font=true,Count=16442,SourceHash="b0be36aa94c3b3b003880f44da8c52204ab8ffe893ed722a609c151ebf32f3f8",Sheets=11,License="Apache 2.0",Name="Material Symbols",FontParts=17},solar={Hash="1dd38a1afdeef9ae2bda29590ffb87909ff144cc4d51f618c6e1b72a97a716f7",FontSources={"3802b325e0eef37da22ec8f19edb8242fb0abe4866aaa723bf45600ea750f09c","72b0c1f3edde0bd89b7324266a5e64150bd8c66de1dcc8b21e606cba281a578a","4b7be61461c75eb5b721cc70076b62bf037447c0fc33f8da80df0ff7f1ef18cc","7d9c618b25ae8bc59cdda100dde6aaf178f63b0ebc023a69100993b81f0df365","9fe2dfd85a94e9c2f7a0114f0431e23433a093e9b09dc707fa351496f5183131","bf0b1109835e55a511c36b383faef3f055ed1bb0bb4c3bd60dfdceb970d890b1","565beac7a0aa5279b0c35d1f49b105c91cb8a0f7fe8a72be4f38ed06870291f0","37b9ef51ceb693ebbf7e2b100f0a95a1d9749425d316f1408e2fea252c167930","d2ccef64bc1a2185194c5865a0b337b8de85d43561202148179272a6c2a1d2b0","d6376e04d3f8747fa4fd388744560670fa5006dc0978c3fc99ec130c783dee72"},Font=true,Count=8859,SourceHash="7edd6e3c80b0440e7d21eb23fca74b84e645e90d99dcbd493ecc170b7d317753",Sheets=6,License="CC BY 4.0",Name="Solar",FontParts=10},fluent={Hash="eea2ac0ea41cbaeaa955ffc63a8c19228eb254d1436c9537570627f000780f98",FontSources={"0ca2ebc12344dfc21b2a0c6d2cd967adff5437de09c2843f165fc0ea715b735e","c025ee859ab9b30623da15c41bdc54453d7ca28b3b7512ccbfee87da8a5e231c","81ec0aec30f4d22a749352e93543167320ed88a6f5c51aee63f31fc6ef42b4a2","08c2d11f4e3c3cf9c89a4c70dd3e1774a8590d9530836a03880025ddca5a3867","ec03717283f571d664222c4ac9ddd8cdc7378113e32b3ea9c3455e75fc59aada","5877c0d62d3b88e05847d6caa50b8ea228d27f66df3e15dfd7e4ada1b3f86a7e","6882f8421b1870a7ad7bd98ba933c950c9021d5975a291b6c5ded9a1c1eb3aae","0b6d115f0496bb0737ebd3092b0d6a77b0e1c8309824f36b44aaedfabad84d14","3b0484af44ee884f75040e964703fb659e14fead7be5eca80e9baed6eee5b09a","459b54e519f643aac8b4febc20ebce816f51299ea8b59ed881efdda46f97b8cf","b5b95e254ef47aacce39eccd3886587d050f1a9c103513516a775bc6112e4f93","12c77501f8279630483ec7fda5cbaedf23147b42ac89e70563f8b8dcf54f6900","2b33de99ad42aeaaa60414fd699fa6117683524760bb14b86d982c7bf0fa0f77","a0815cc57d498fb4dad8ad04a5164f1767c18aa96cdf864f31a6fba6ec29f0ab","b9708402b5a529863a263341478fd44ae6f362f2320bacf5118cda474bac1fcb","68b9dbded5d541c81943a74d381ae69516d02aa7f07ed0c3ab519f0c59a099f2","4685a4902150718823b10d7b0c442628dc79b78a648b6800e4dc581704cc7b67","03a38183356a4c6c15071c7ae71779146aa4fc6d6e47f3af6ae9ddd0582d3ad9","d4cf604e15f3c7e1e8bd65ef36f3342403eeea8f7773d79eceb116188507dc39","a80c414eb482bbad39463586ecb021f49fe1285072e5336a360786c6b3ea3e57","0b537ae8676593b0b991b9df6c76c69fe76a8e116a0193e335ae8346b67562f2","c4977f667b3efa70906ea3bc4e183a95a5e248f9e030fac10b07f608d45047b2","40a771f73627c5fd8093fc2d8b79819cf2aafa0fa48fa313460272dbdf5fcf55","c7f4bc777ac1aa70c54070b3b62e7d665b89a9e421346a285fca34be0704bbd7","5638ab3b76ca1af8584e592c5eb977b6ae331801f0078de546f8167999ef3231"},Font=true,Count=20289,SourceHash="7bf2c2d522bf7bf203a61b82b402f36b4ec6fbde41876b299d98b116c982125b",Sheets=13,License="MIT",Name="Fluent UI",FontParts=25},phosphor={Hash="d20c6770dc7e67b922e161822deede7ddaac3cabf392c9dc0e5d9e34f2b5dd79",FontSources={"da857805e9de82a216d8fc1c07844477d64b83c5e2a4dd284d5f1297ebdeefad","28405604f4e367df4a396bfe1690b43429def2de4821e4a39ed344d9d078b902","66aec2575fc1162a949d63562ccaa111381d69032a677d5ac793fafe6d1fd0cf","3aacf066c2c478c22db7a52bb798422c1bf4f02aad569b57f00c23468d4e639a","de427575bbe085cdd8218d259544d96bfa0ff5103f7f291b6566045e72695776","3ccbbf6cd2bcd19b64fca0ec42963c2b04123ddf222a8309ddac7d0893eb5e3d","8c9b026dd07b38eb160ac2784e69e32537b4d37d7a1422c971a4e18aa0409b70","30f32ad1572e5156a059d7a3b06bce52a4914e25f21a44aac339f7b8776b52a2"},Font=true,Count=9161,SourceHash="c3b2cb558245a0660ceecb7597fd5f38eb4d3e39ab37a8da64196384821bb76d",Sheets=6,License="MIT",Name="Phosphor",FontParts=8}}

local MAX_ALIAS_DEPTH = 8
local PRELOAD_WORKERS = 6

--// Providers \\--
type ProviderState = {
	Id: string,
	Icons: { string },
	Aliases: { [string]: string },
	Rects: { { any } },
	Index: { [string]: number },
	SheetUrls: { [number]: string },
	Folder: string,
	FontParts: number?,
	FontName: string,
	Fonts: { [number]: Font | false },
}

local loadedProviders: { [string]: ProviderState } = {}
local currentProvider = DEFAULT_PROVIDER

-- Keeps only the newest build of a provider on disk
local function PruneCache(id: string, currentFolder: string)
	if not AssetManager.CanDelete then return end

	for _, name in AssetManager.ListNames() do
		local hash = if name:sub(1, #id + 1) == `{id}-` then name:sub(#id + 2) else nil
		if hash and name ~= currentFolder and hash:match("^" .. string.rep("%x", 64) .. "$") then
			pcall(delfolder, AssetManager.Path(name))
		end
	end
end

local function LoadProvider(id: string): ProviderState
	local loaded = loadedProviders[id]
	if loaded then return loaded end

	local meta = PROVIDERS[id]
	assert(meta, `Unknown icon provider "{id}"`)

	local folder = `{id}-{meta.Hash}`
	local dataFile = `{folder}/data.lua`
	local dataUrl = `{ASSET_BASE_URL}providers/{id}.lua`

	local useCustomSprites = false
	local source: string? = nil

	if AssetManager.Supported then
		useCustomSprites = pcall(function()
			AssetManager.EnsureFolder(folder)
			for sheet = 1, meta.Sheets do
				AssetManager.Download(`{folder}/{sheet}.png`, `{ASSET_BASE_URL}spritesheets/{id}/{sheet}.png`, function(data)
					return data:sub(1, 8) == "\137PNG\r\n\26\n" -- PNG header
				end)
			end
			AssetManager.GetAsset(`{folder}/1.png`)
		end)

		pcall(function()
			AssetManager.EnsureFolder(folder)
			AssetManager.Download(dataFile, dataUrl, function(data)
				return data:sub(1, 6) == "return"
			end)
			source = AssetManager.Read(dataFile)
		end)

		if useCustomSprites then
			pcall(PruneCache, id, folder)
		end
	end

	local data = loadstring(source or game:HttpGet(dataUrl))()

	local sheetUrls = {}
	for sheet, fallback in data.Sheets do
		sheetUrls[sheet] = if useCustomSprites then AssetManager.GetAsset(`{folder}/{sheet}.png`) else fallback
	end

	local index = {}
	for position, name in data.Icons do
		index[name] = position
	end

	local state: ProviderState = {
		Id = id,
		Icons = data.Icons,
		Aliases = data.Aliases,
		Rects = data.Rects,
		Index = index,
		SheetUrls = sheetUrls,
		Folder = folder,
		FontParts = if meta.Font then meta.FontParts else nil,
		FontName = meta.Name,
		Fonts = {},
	}

	loadedProviders[id] = state
	return state
end

-- Must match FontPartOf in scripts/build.luau
local function FontPartOf(name: string, parts: number): number
	local hash = 7
	for index = 1, #name do
		hash = (hash * 131 + string.byte(name, index)) % 2147483629
	end
	return hash % parts + 1
end

-- Big sets are split into several fonts, so a font is downloaded when its first icon is looked up
local function GetFontFace(state: ProviderState, part: number): Font?
	local cached = state.Fonts[part]
	if cached ~= nil then return cached or nil end

	local face: Font? = nil
	if AssetManager.Supported then
		pcall(function()
			local ttfFile = `{state.Folder}/font-{part}.ttf`
			local familyFile = `{state.Folder}/font-{part}.json`

			AssetManager.EnsureFolder(state.Folder)
			AssetManager.Download(ttfFile, `{ASSET_BASE_URL}fonts/{state.Id}/{state.Id}-{part}.ttf`, function(data)
				return data:sub(1, 4) == "\0\1\0\0" -- TrueType header
			end)
			AssetManager.Write(familyFile, game:GetService("HttpService"):JSONEncode({
				name = `{state.FontName} {part}`,
				loadStrategy = "sameFamilyOnly",
				faces = {
					{ name = "Regular", weight = 400, style = "normal", assetId = AssetManager.GetAsset(ttfFile) },
				},
			}))

			face = Font.new(AssetManager.GetAsset(familyFile))
		end)
	end

	state.Fonts[part] = face or false
	return face
end

--// API \--
Registry.Providers = {}
for id in PROVIDERS do
	table.insert(Registry.Providers, id)
end
table.sort(Registry.Providers)

function Registry.GetProviderInfo(id: string?)
	local meta = PROVIDERS[id or currentProvider]
	if not meta then return nil end

	return { Id = id or currentProvider, Name = meta.Name, License = meta.License, Count = meta.Count }
end

function Registry.GetProvider(): string
	return currentProvider
end

function Registry.SetProvider(id: string)
	assert(PROVIDERS[id], `Unknown icon provider "{id}"`)

	LoadProvider(id)
	currentProvider = id
end

function Registry.GetIcons(provider: string?): { string }
	return LoadProvider(provider or currentProvider).Icons
end

function Registry.HasIcon(name: string, provider: string?): boolean
	return Registry.GetAsset(name, provider) ~= nil
end

local function Resolve(state: ProviderState, name: string): string
	local resolved = name
	for _ = 1, MAX_ALIAS_DEPTH do
		local target = state.Aliases[resolved]
		if not target then break end
		resolved = target
	end
	return resolved
end

-- Downloads everything up front so GetAsset never yields. Without names it fetches every font part of the provider.
-- Returns the number of font parts that are ready
function Registry.PreloadAsync(names: { string }?, provider: string?): number
	local state = LoadProvider(provider or currentProvider)
	if not state.FontParts then return 0 end

	local seen: { [number]: boolean } = {}
	local queue: { number } = {}
	local function Add(part: number)
		if not seen[part] then
			seen[part] = true
			table.insert(queue, part)
		end
	end

	if names then
		for _, name in names do
			local resolved = Resolve(state, name)
			if state.Index[resolved] then
				Add(FontPartOf(resolved, state.FontParts))
			end
		end
	else
		for part = 1, state.FontParts do
			Add(part)
		end
	end

	local ready = 0
	local function Work()
		while true do
			local part = table.remove(queue)
			if not part then return end
			if GetFontFace(state, part) then
				ready += 1
			end
		end
	end

	-- Several parts download at once, the rest of the queue is picked up as workers finish
	local workers = math.min(PRELOAD_WORKERS, #queue)
	if typeof(task) ~= "table" or workers <= 1 then
		Work()
		return ready
	end

	local running = workers
	for _ = 1, workers do
		task.spawn(function()
			pcall(Work)
			running -= 1
		end)
	end
	while running > 0 do
		task.wait()
	end
	return ready
end

function Registry.GetAsset(name: string, provider: string?)
	local state = LoadProvider(provider or currentProvider)

	local resolved = Resolve(state, name)

	local position = state.Index[resolved]
	if not position then
		return nil
	end

	local rect = state.Rects[position]
	local fontPart = if state.FontParts then FontPartOf(resolved, state.FontParts) else nil
	local fontFace = if fontPart then GetFontFace(state, fontPart) else nil

	return {
		IconName = name,
		Provider = state.Id,
		Url = state.SheetUrls[rect[1]],
		ImageRectSize = Vector2.new(rect[2][1], rect[2][2]),
		ImageRectOffset = Vector2.new(rect[3][1], rect[3][2]),

		-- Only present when the provider font loaded. The font shapes Text into one icon through a ligature
		FontFace = fontFace,
		FontPart = fontPart,
		Text = if fontFace then resolved else nil,
	}
end

function Registry.SetIcon(iconInstance: TextLabel | ImageLabel, name: string, provider: string?)
	assert(typeof(iconInstance) == "Instance" and (iconInstance:IsA("TextLabel") or iconInstance:IsA("ImageLabel")), "iconInstance must be a TextLabel or ImageLabel")
	
	local asset = Registry.GetAsset(name, provider)
	assert(asset, `Icon "{name}" not found in provider "{provider}"`)

	if iconInstance:IsA("TextLabel") then
		assert(asset.FontFace, "Environment does not support font icons. Try using an ImageLabel instead.")

		iconInstance.Text = asset.Text
		iconInstance.FontFace = asset.FontFace
	else
		iconInstance.Image = asset.Url
		iconInstance.ImageRectSize = asset.ImageRectSize
		iconInstance.ImageRectOffset = asset.ImageRectOffset
	end
end

return Registry
