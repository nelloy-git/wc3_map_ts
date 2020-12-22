import * as Fdf from "../../Fdf"

let fdf = new Fdf.Backdrop('InterfaceMinimapBackground')
fdf.width = 0.04
fdf.height = 0.04
fdf.backgroundTileMode = true
fdf.backgroudTileSize = 0.2
fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
fdf.blendAll = true
fdf.insets = [0.001, 0.001, 0.001, 0.001]
fdf.cornarFlags = ['UL','UR','BL','BR','T','L','B','R']
fdf.cornerSize = 0.0125
fdf.edgeFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-border'

export { fdf as InterfaceBorderFdf }