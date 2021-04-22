
import { FileBinary, log } from "../../Utils"
import { Field, FieldBool, FieldChange, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"
import { float2byte, int2byte, str2byte } from "../Utils"
import { UnitsMeta } from './UnitsMeta'

export interface TUnitField<T extends Field.ValueType> extends Field<T> {}

export class TUnitFieldBool extends FieldBool implements TUnitField<boolean> {
    toBinary(val: boolean){
        return this.id + Field.type2byte('bool') + int2byte(val ? 1 : 0) + '\0\0\0\0'
    }
}

export class TUnitFieldInt extends FieldInt implements TUnitField<number> {
    toBinary(val: number){
        return this.id + Field.type2byte('int') + int2byte(val) + '\0\0\0\0'
    }
}
export class TUnitFieldReal extends FieldReal implements TUnitField<number> {
    toBinary(val: number){
        return this.id + Field.type2byte('real') + float2byte(val) + '\0\0\0\0'
    }
}
export class TUnitFieldUnreal extends FieldUnreal implements TUnitField<number> {
    toBinary(val: number){
        return this.id + Field.type2byte('unreal') + float2byte(val) + '\0\0\0\0'
    }
}
export class TUnitFieldString extends FieldString implements TUnitField<string> {
    toBinary(val: string){
        return this.id + Field.type2byte('string') + str2byte(val) + '\0\0\0\0'
    }
}

export class TUnitFieldChange<T extends Field.ValueType> extends FieldChange<T>{

    static fromBinary(file: FileBinary){
        let code = file.readChar(4)
        let field = findTUnitField(code)
        if (!field){
            error(TUnitFieldChange.name + ': unknown field ' + code)
        }

        let b_type = file.readChar(4)
        if (Field.type2byte(field.type) != b_type){
            error(TUnitFieldChange.name + ': ' + code + ' field.type != typeof(value)\n' +
                  'field: ' + Field.type2byte(field.type).charCodeAt(0) + '\n' +
                  'value: ' + b_type.charCodeAt(0))
        }

        let val = Field.byte2val(field.type, file)

        file.readChar(4) // Pass 4 bytes

        return new TUnitFieldChange<Field.ValueType>(field, val)
    }

    toBinary(){
        return this.field.id + Field.type2byte(this.field.type) +
                Field.val2byte(this.field.type, this.val) + '\0\0\0\0'
    }
}

export namespace TUnitField {
    export let AllowCustomTeamColor = new TUnitFieldBool("utcc")
    export let Attack1ProjectileHomingEnabled = new TUnitFieldBool("umh1")
    export let Attack1ShowUI = new TUnitFieldBool("uwu1")
    export let Attack2ProjectileHomingEnabled = new TUnitFieldBool("umh2")
    export let Attack2ShowUI = new TUnitFieldBool("uwu2")
    export let CanDropItemsOnDeath = new TUnitFieldBool("udro")
    export let CanFlee = new TUnitFieldBool("ufle")
    export let CategorizationCampaign = new TUnitFieldBool("ucam")
    export let CategorizationSpecial = new TUnitFieldBool("uspe")
    export let DisplayasNeutralHostile = new TUnitFieldBool("uhos")
    export let HasTilesetSpecificData = new TUnitFieldBool("utss")
    export let HasWaterShadow = new TUnitFieldBool("ushr")
    export let HideMinimapDisplay = new TUnitFieldBool("uhom")
    export let IsaBuilding = new TUnitFieldBool("ubdg")
    export let PlaceableInEditor = new TUnitFieldBool("uine")
    export let ScaleProjectiles = new TUnitFieldBool("uscb")
    export let SelectionCircleOnWater = new TUnitFieldBool("usew")
    export let Sleeps = new TUnitFieldBool("usle")
    export let UseClickHelper = new TUnitFieldBool("uuch")
    export let UseExtendedLineofSight = new TUnitFieldBool("ulos")
    export let Hero_GroupSeparationEnabled = new TUnitFieldBool("urpo")
    export let Hero_HideHeroDeathMsg = new TUnitFieldBool("uhhd")
    export let Hero_HideHeroInterfaceIcon = new TUnitFieldBool("uhhb")
    export let Hero_HideHeroMinimapDisplay = new TUnitFieldBool("uhhm")
    export let NeutralBuildingShowsMinimapIcon = new TUnitFieldBool("unbm")
    export let NeutralBuildingValidAsRandomBuilding = new TUnitFieldBool("unbr")
    export let RevivesDeadHeros = new TUnitFieldBool("urev")

    export let Attack1AreaofEffectFullDamage = new TUnitFieldInt("ua1f")
    export let Attack1AreaofEffectMediumDamage = new TUnitFieldInt("ua1h")
    export let Attack1AreaofEffectSmallDamage = new TUnitFieldInt("ua1q")
    export let Attack1DamageBase = new TUnitFieldInt("ua1b")
    export let Attack1DamageSidesperDie = new TUnitFieldInt("ua1s")
    export let Attack1DamageUpgradeAmount = new TUnitFieldInt("udu1")
    export let Attack1DamageDice = new TUnitFieldInt("ua1d")
    export let Attack1MaximumTargets = new TUnitFieldInt("utc1")
    export let Attack1ProjectileSpeed = new TUnitFieldInt("ua1z")
    export let Attack1Range = new TUnitFieldInt("ua1r")
    export let Attack2AreaofEffectFullDamage = new TUnitFieldInt("ua2f")
    export let Attack2AreaofEffectMediumDamage = new TUnitFieldInt("ua2h")
    export let Attack2AreaofEffectSmallDamage = new TUnitFieldInt("ua2q")
    export let Attack2DamageBase = new TUnitFieldInt("ua2b")
    export let Attack2DamageSidesperDie = new TUnitFieldInt("ua2s")
    export let Attack2DamageUpgradeAmount = new TUnitFieldInt("udu2")
    export let Attack2DamagebooleanofDice = new TUnitFieldInt("ua2d")
    export let Attack2MaximumbooleanofTargets = new TUnitFieldInt("utc2")
    export let Attack2ProjectileSpeed = new TUnitFieldInt("ua2z")
    export let Attack2Range = new TUnitFieldInt("ua2r")
    export let AttacksEnabled = new TUnitFieldInt("uaen")
    export let BuildTime = new TUnitFieldInt("ubld")
    export let ButtonPositionX = new TUnitFieldInt("ubpx")
    export let ButtonPositionY = new TUnitFieldInt("ubpy")
    export let DeathType = new TUnitFieldInt("udea")
    export let DefenseBase = new TUnitFieldInt("udef")
    export let DefenseUpgradeBonus = new TUnitFieldInt("udup")
    export let ElevationSamplePoints = new TUnitFieldInt("uept")
    export let FoodCost = new TUnitFieldInt("ufoo")
    export let FoodProduced = new TUnitFieldInt("ufma")
    export let GoldBountyAwardedBase = new TUnitFieldInt("ubba")
    export let GoldBountyAwardedSidesperDie = new TUnitFieldInt("ubsi")
    export let GoldBountyAwardedbooleanofDice = new TUnitFieldInt("ubdi")
    export let GoldCost = new TUnitFieldInt("ugol")
    export let HitPointsMaximumBase = new TUnitFieldInt("uhpm")
    export let LumberBountyAwardedBase = new TUnitFieldInt("ulba")
    export let LumberBountyAwardedSidesperDie = new TUnitFieldInt("ulbs")
    export let LumberBountyAwardedbooleanofDice = new TUnitFieldInt("ulbd")
    export let LumberCost = new TUnitFieldInt("ulum")
    export let ManaInitialAmount = new TUnitFieldInt("umpi")
    export let ManaMaximum = new TUnitFieldInt("umpm")
    export let MinimumAttackRange = new TUnitFieldInt("uamn")
    export let OrientationInterpolation = new TUnitFieldInt("uori")
    export let PointValue = new TUnitFieldInt("upoi")
    export let Priority = new TUnitFieldInt("upri")
    export let RepairGoldCost = new TUnitFieldInt("ugor")
    export let RepairLumberCost = new TUnitFieldInt("ulur")
    export let RepairTime = new TUnitFieldInt("urtm")
    export let SightRadiusDay = new TUnitFieldInt("usid")
    export let SightRadiusNight = new TUnitFieldInt("usin")
    export let SoundLoopingFadeInRate = new TUnitFieldInt("ulfi")
    export let SoundLoopingFadeOutRate = new TUnitFieldInt("ulfo")
    export let MovementSpeedBase = new TUnitFieldInt("umvs")
    export let MovementSpeedMaximum = new TUnitFieldInt("umas")
    export let MovementSpeedMinimum = new TUnitFieldInt("umis")
    export let StockMaximum = new TUnitFieldInt("usma")
    export let StockReplenishInterval = new TUnitFieldInt("usrg")
    export let StockStartDelay = new TUnitFieldInt("usst")
    export let TeamColor = new TUnitFieldInt("utco")
    export let TintingColorBlue = new TUnitFieldInt("uclb")
    export let TintingColorGreen = new TUnitFieldInt("uclg")
    export let TintingColorRed = new TUnitFieldInt("uclr")
    export let Hero_FormationRank = new TUnitFieldInt("ufor")
    export let Hero_GroupSeparationGroupNumber = new TUnitFieldInt("urpg")
    export let Hero_GroupSeparationParameter = new TUnitFieldInt("urpp")
    export let Hero_GroupSeparationPriority = new TUnitFieldInt("urpr")
    export let Hero_Level = new TUnitFieldInt("ulev")
    export let Hero_ProperNamesUsed = new TUnitFieldInt("upru")
    export let Hero_StartingAgility = new TUnitFieldInt("uagi")
    export let Hero_StartingIntelligence = new TUnitFieldInt("uint")
    export let Hero_StartingStrength = new TUnitFieldInt("ustr")
    export let Hero_TransportedSize = new TUnitFieldInt("ucar")

    export let ShadowImageWidth = new TUnitFieldReal("ushw")
    export let ShadowImageHeight = new TUnitFieldReal("ushh")
    export let ShadowImageCenterY = new TUnitFieldReal("ushy")
    export let ShadowImageCenterX = new TUnitFieldReal("ushx")
    export let SelectionScale = new TUnitFieldReal("ussc")
    export let SelectionCircleHeight = new TUnitFieldReal("uslz")
    export let ScalingValue = new TUnitFieldReal("usca")
    export let MaximumRollAngledegrees = new TUnitFieldReal("umxr")
    export let MaximumPitchAngledegrees = new TUnitFieldReal("umxp")
    export let FogOfWarSampleRadius = new TUnitFieldReal("ufrd")
    export let ElevationSampleRadius = new TUnitFieldReal("uerd")
    export let AnimationWalkSpeed = new TUnitFieldReal("uwal")
    export let AnimationRunSpeed = new TUnitFieldReal("urun")
    export let AnimationBlendTimeseconds = new TUnitFieldReal("uble")
    
    export let TurnRate = new TUnitFieldUnreal("umvr")
    export let PropulsionWindowdegrees = new TUnitFieldUnreal("uprw")
    export let ProjectileLaunchZSwimming = new TUnitFieldUnreal("ulsz")
    export let ProjectileLaunchZ = new TUnitFieldUnreal("ulpz")
    export let ProjectileLaunchY = new TUnitFieldUnreal("ulpy")
    export let ProjectileLaunchX = new TUnitFieldUnreal("ulpx")
    export let ProjectileImpactZSwimming = new TUnitFieldUnreal("uisz")
    export let ProjectileImpactZ = new TUnitFieldUnreal("uimz")
    export let OccluderHeight = new TUnitFieldUnreal("uocc")
    export let ManaRegeneration = new TUnitFieldUnreal("umpr")
    export let HitPointsRegenerationRate = new TUnitFieldUnreal("uhpr")
    export let MovementHeightMinimum = new TUnitFieldUnreal("umvf")
    export let MovementHeight = new TUnitFieldUnreal("umvh")
    export let DeathTimeseconds = new TUnitFieldUnreal("udtm")
    export let CollisionSize = new TUnitFieldUnreal("ucol")
    export let Attack2RangeMotionBuffer = new TUnitFieldUnreal("urb2")
    export let Attack2ProjectileArc = new TUnitFieldUnreal("uma2")
    export let Attack2DamageSpillRadius = new TUnitFieldUnreal("usr2")
    export let Attack2DamageSpillDistance = new TUnitFieldUnreal("usd2")
    export let Attack2DamageLossFactor = new TUnitFieldUnreal("udl2")
    export let Attack2DamageFactorSmall = new TUnitFieldUnreal("uqd2")
    export let Attack2DamageFactorMedium = new TUnitFieldUnreal("uhd2")
    export let Attack2CooldownTime = new TUnitFieldUnreal("ua2c")
    export let Attack2AnimationDamagePoint = new TUnitFieldUnreal("udp2")
    export let Attack2AnimationBackswingPoint = new TUnitFieldUnreal("ubs2")
    export let Attack1RangeMotionBuffer = new TUnitFieldUnreal("urb1")
    export let Attack1ProjectileArc = new TUnitFieldUnreal("uma1")
    export let Attack1DamageSpillRadius = new TUnitFieldUnreal("usr1")
    export let Attack1DamageSpillDistance = new TUnitFieldUnreal("usd1")
    export let Attack1DamageLossFactor = new TUnitFieldUnreal("udl1")
    export let Attack1DamageFactorSmall = new TUnitFieldUnreal("uqd1")
    export let Attack1DamageFactorMedium = new TUnitFieldUnreal("uhd1")
    export let Attack1CooldownTime = new TUnitFieldUnreal("ua1c")
    export let Attack1AnimationDamagePoint = new TUnitFieldUnreal("udp1")
    export let Attack1AnimationBackswingPoint = new TUnitFieldUnreal("ubs1")
    export let AnimationCastPoint = new TUnitFieldUnreal("ucpt")
    export let AnimationCastBackswing = new TUnitFieldUnreal("ucbs")
    export let AIPlacementRadius = new TUnitFieldUnreal("uabr")
    export let AcquisitionRange = new TUnitFieldUnreal("uacq")
    export let StrengthPerLevel = new TUnitFieldUnreal("ustp")
    export let IntelligencePerLevel = new TUnitFieldUnreal("uinp")
    export let AgilityPerLevel = new TUnitFieldUnreal("uagp")
    export let PlacementRequiresWaterRadius = new TUnitFieldUnreal("upaw")
    
    export let AIPlacementType = new TUnitFieldString("uabt")
    /** 'Ethereal', 'Flesh', 'Wood', 'Stone', 'Metal' */
    export let ArmorSoundType = new TUnitFieldString("uarm")
    /** 'normal', 'small', 'medium', 'large', 'fort', 'hero', 'divine', 'none' */
    export let ArmorType = new TUnitFieldString("udty")
    export let ArtSpecial = new TUnitFieldString("uspa")
    export let ArtTarget = new TUnitFieldString("utaa")
    export let Attack1AreaofEffectTargets = new TUnitFieldString("ua1p")
    /** 'unknown', 'normal', 'pierce', 'siege', 'spells', 'chaos', 'magic', 'hero' */
    export let Attack1AttackType = new TUnitFieldString("ua1t")
    export let Attack1ProjectileArt = new TUnitFieldString("ua1m")
    /** 'air', 'alive', 'allies', 'ancient', 'dead', 'debris', 'decoration', 'enemies', 'friend', 'ground', 'hero',
      * 'invulnerable', 'item', 'mechanical', 'neutral', 'nonancient', 'none', 'nonhero', 'nonsapper', 'notself',
      * 'organic', 'player', 'playerunits', 'sapper', 'self', 'structure', 'terrain', 'tree', 'vulnerable', 'wall', */
    export let Attack1TargetsAllowed = new TUnitFieldString("ua1g")
    /** 'Nothing', 'AxeMediumChop', 'MetalHeavyBash', 'MetalHeavyChop',
      * 'MetalHeavySlice', 'MetalLightChop', 'MetalLightSlice', 'MetalMediumBash', 'MetalMediumChop',
      * 'MetalMediumSlice', 'RockHeavyBash', 'WoodHeavyBash', 'WoodLightBash', 'WoodMediumBash' */
    export let Attack1WeaponSound = new TUnitFieldString("ucs1")
    /** 'normal', 'instant', 'artillery', 'aline', 'missile', 'splash', 'bounce', 'line' */
    export let Attack1WeaponType = new TUnitFieldString("ua1w")
    export let Attack2AreaofEffectTargets = new TUnitFieldString("ua2p")
    /** 'unknown', 'normal', 'pierce', 'siege', 'spells', 'chaos', 'magic', 'hero' */
    export let Attack2AttackType = new TUnitFieldString("ua2t")
    export let Attack2ProjectileArt = new TUnitFieldString("ua2m")
    /** 'air', 'alive', 'allies', 'ancient', 'dead', 'debris', 'decoration', 'enemies', 'friend', 'ground', 'hero',
      * 'invulnerable', 'item', 'mechanical', 'neutral', 'nonancient', 'none', 'nonhero', 'nonsapper', 'notself',
      * 'organic', 'player', 'playerunits', 'sapper', 'self', 'structure', 'terrain', 'tree', 'vulnerable', 'wall', */
    export let Attack2TargetsAllowed = new TUnitFieldString("ua2g")
    /** 'Nothing', 'AxeMediumChop', 'MetalHeavyBash', 'MetalHeavyChop',
      * 'MetalHeavySlice', 'MetalLightChop', 'MetalLightSlice', 'MetalMediumBash', 'MetalMediumChop',
      * 'MetalMediumSlice', 'RockHeavyBash', 'WoodHeavyBash', 'WoodLightBash', 'WoodMediumBash' */
    export let Attack2WeaponSound = new TUnitFieldString("ucs2")
    /** 'normal', 'instant', 'artillery', 'aline', 'missile', 'splash', 'bounce', 'line' */
    export let Attack2WeaponType = new TUnitFieldString("ua2w")
    export let DefaultActiveAbility = new TUnitFieldString("udaa")
    export let DependencyEquivalents = new TUnitFieldString("udep")
    export let Description = new TUnitFieldString("ides")
    export let HitPointsRegenerationType = new TUnitFieldString("uhrt")
    export let Hotkey = new TUnitFieldString("uhot")
    export let IconGameInterface = new TUnitFieldString("uico")
    export let IconScoreScreen = new TUnitFieldString("ussi")
    export let ItemsSold = new TUnitFieldString("usei")
    export let ModelFile = new TUnitFieldString("umdl")
    export let ModelFileExtraVersions = new TUnitFieldString("uver")
    export let MovementSound = new TUnitFieldString("umsl")
    export let MovementType = new TUnitFieldString("umvt")
    export let Name = new TUnitFieldString("unam")
    export let NameEditorSuffix = new TUnitFieldString("unsf")
    export let NormalAbilities = new TUnitFieldString("uabi")
    export let Race = new TUnitFieldString("urac")
    export let RandomSound = new TUnitFieldString("ursl")
    export let RequiredAnimationNames = new TUnitFieldString("uani")
    export let RequiredAnimationNamesAttachments = new TUnitFieldString("uaap")
    export let RequiredAttachmentLinkNames = new TUnitFieldString("ualp")
    export let RequiredBoneNames = new TUnitFieldString("ubpr")
    export let Requirements = new TUnitFieldString("ureq")
    export let RequirementsLevels = new TUnitFieldString("urqa")
    export let ShadowImageUnit = new TUnitFieldString("ushu")
    export let ShadowTextureBuilding = new TUnitFieldString("ushb")
    export let TargetedAs = new TUnitFieldString("utar")
    export let Tilesets = new TUnitFieldString("util")
    export let TooltipBasic = new TUnitFieldString("utip")
    export let TooltipExtended = new TUnitFieldString("utub")
    export let UnitClassification = new TUnitFieldString("utyp")
    export let UnitSoundSet = new TUnitFieldString("usnd")
    export let UnitsSold = new TUnitFieldString("useu")
    export let UpgradesUsed = new TUnitFieldString("upgr")
    export let Hero_ConstructionSound = new TUnitFieldString("ubsl")
    export let Hero_GroundTexture = new TUnitFieldString("uubs")
    export let Hero_HeroAbilities = new TUnitFieldString("uhab")
    export let Hero_HeroRevivalLocations = new TUnitFieldString("urva")
    export let Hero_PrimaryAttribute = new TUnitFieldString("upra")
    export let Hero_ProperNames = new TUnitFieldString("upro")
    export let Hero_RequierementsForTier1 = new TUnitFieldString("urq0")
    export let Hero_RequierementsForTier2 = new TUnitFieldString("urq1")
    export let Hero_RequierementsForTier3 = new TUnitFieldString("urq2")
    export let Hero_RequierementsForTier4 = new TUnitFieldString("urq3")
    export let Hero_RequierementsForTier5 = new TUnitFieldString("urq4")
    export let Hero_RequierementsForTier6 = new TUnitFieldString("urq5")
    export let Hero_RequierementsForTier7 = new TUnitFieldString("urq6")
    export let Hero_RequierementsForTier8 = new TUnitFieldString("urq7")
    export let Hero_RequierementsForTier9 = new TUnitFieldString("urq8")
    export let Hero_StructuresBuilt = new TUnitFieldString("ubui")
    export let Hero_TooltipAwaken = new TUnitFieldString("uawt")
    export let Hero_TooltipRevive = new TUnitFieldString("utpr")
    export let ConstructionSound = new TUnitFieldString("ubsl")
    export let GroundTexture = new TUnitFieldString("uubs")
    export let ItemsMade = new TUnitFieldString("umki")
    export let PathingMap = new TUnitFieldString("upat")
    export let PlacementPreventedBy = new TUnitFieldString("upar")
    export let PlacementRequires = new TUnitFieldString("upap")
    export let ResearchesAvailable = new TUnitFieldString("ures")
    export let UnitsTrained = new TUnitFieldString("utra")
    export let UpgradesTo = new TUnitFieldString("uupt")

    export let ItemAbilList = new TUnitFieldString('iabi')
    export let ItemArmor = new TUnitFieldString('iarm')
    export let ItemClass = new TUnitFieldString('icla')
    export let ItemColorBlue = new TUnitFieldInt('iclb')
    export let ItemColorGreen = new TUnitFieldInt('iclg')
    export let ItemColorRed = new TUnitFieldInt('iclr')
    export let ItemCooldownId = new TUnitFieldString('icid')
    export let ItemDrops = new TUnitFieldBool('idrp')
    export let ItemDropable = new TUnitFieldBool('idro')
    export let ItemModel = new TUnitFieldString('ifil')
    export let ItemGoldCost = new TUnitFieldInt('igol')
    export let ItemHealth = new TUnitFieldInt('ihtp')
    export let ItemIgnoreCooldown = new TUnitFieldBool('iicd')
    export let ItemLevel = new TUnitFieldInt('ilev')
    export let ItemLumberCost = new TUnitFieldInt('ilum')
    export let ItemMorph = new TUnitFieldBool('imor')
    export let ItemLevelOld = new TUnitFieldInt('ilvo')
    export let ItemPurshable = new TUnitFieldBool('iper')
    export let ItemPickRandom = new TUnitFieldBool('iprn')
    export let ItemPowerUp = new TUnitFieldBool('ipow')
    export let ItemPriority = new TUnitFieldInt('ipri')
    export let ItemScale = new TUnitFieldReal('isca')
    export let ItemSelSize = new TUnitFieldReal('issc')
    export let ItemSellable = new TUnitFieldBool('isel')
    export let ItemPawnable = new TUnitFieldBool('ipaw')
    export let ItemStockMax = new TUnitFieldInt('isto')
    export let ItemStockRegen = new TUnitFieldInt('istr')
    export let ItemStockStart = new TUnitFieldInt('isst')
    export let ItemStockInitial = new TUnitFieldInt('isit')
    export let ItemUsable = new TUnitFieldBool('iusa')
    export let ItemUses = new TUnitFieldInt('iuse')
    export let ItemStackMax = new TUnitFieldInt('ista')
    export let ItemAnimProp = new TUnitFieldString('iani')
    export let ItemIcon = new TUnitFieldString('iico')

    export let CasterUpgradeArt = new TUnitFieldString('ucua')
    export let CasterUpgradeName = new TUnitFieldString('ucun')
    export let CasterUpgradeTip = new TUnitFieldString('ucut')
    export let RequiresCount = new TUnitFieldInt('urqc')
    export let StockInitial = new TUnitFieldInt('usit')
    export let CanBuild = new TUnitFieldBool('ucbo')
    export let IsBuildOn = new TUnitFieldBool('uibo')
    export let AbilSkinList = new TUnitFieldString('uabs')
    export let HeroAbilSkinList = new TUnitFieldString('uhas')
}

let all_fields = Object.values(TUnitField)
export function findTUnitField(code: string){
    for (let field of all_fields){
        if (code == field.id){
            return field
        }
    }
    return undefined
}

// Verify fields
if (!IsGame()){
    let meta = UnitsMeta.getFields()
    for (const id of meta){
        let field = findTUnitField(id)
        if (!field){
            log(TUnitFieldChange.name + ': id "' + id + '" is not registered')
        }
    }
}