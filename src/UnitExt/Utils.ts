const turnTime = 0.5

export function getTurnTime(){
    let angle: number = math.pi
    if (target){
        let targ = target[0]
        let caster = abil.Data.owner
    
        let dx = targ.x - caster.x
        let dy = targ.y - caster.y
        angle = Atan2(dy, dx)
        angle = angle >= 0 ? angle : 2 * math.pi + angle
    }

    let caster = abil.Data.owner
    return TURN_TIME * math.abs(angle - caster.angle) / math.pi
}