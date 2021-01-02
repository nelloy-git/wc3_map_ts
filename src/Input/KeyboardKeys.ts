export let KeyboardKeys = [
    OSKEY_BACKSPACE,
    OSKEY_TAB,
    OSKEY_CLEAR,
    OSKEY_RETURN,
    OSKEY_SHIFT,
    OSKEY_CONTROL,
    OSKEY_ALT,
    OSKEY_PAUSE,
    OSKEY_CAPSLOCK,
    OSKEY_KANA,
    OSKEY_HANGUL,
    OSKEY_JUNJA,
    OSKEY_FINAL,
    OSKEY_HANJA,
    OSKEY_KANJI,
    OSKEY_ESCAPE,
    OSKEY_CONVERT,
    OSKEY_NONCONVERT,
    OSKEY_ACCEPT,
    OSKEY_MODECHANGE,
    OSKEY_SPACE,
    OSKEY_PAGEUP,
    OSKEY_PAGEDOWN,
    OSKEY_END,
    OSKEY_HOME,
    OSKEY_LEFT,
    OSKEY_UP,
    OSKEY_RIGHT,
    OSKEY_DOWN,
    OSKEY_SELECT,
    OSKEY_PRINT,
    OSKEY_EXECUTE,
    OSKEY_PRINTSCREEN,
    OSKEY_INSERT,
    OSKEY_DELETE,
    OSKEY_HELP,
    OSKEY_0,
    OSKEY_1,
    OSKEY_2,
    OSKEY_3,
    OSKEY_4,
    OSKEY_5,
    OSKEY_6,
    OSKEY_7,
    OSKEY_8,
    OSKEY_9,
    OSKEY_A,
    OSKEY_B,
    OSKEY_C,
    OSKEY_D,
    OSKEY_E,
    OSKEY_F,
    OSKEY_G,
    OSKEY_H,
    OSKEY_I,
    OSKEY_J,
    OSKEY_K,
    OSKEY_L,
    OSKEY_M,
    OSKEY_N,
    OSKEY_O,
    OSKEY_P,
    OSKEY_Q,
    OSKEY_R,
    OSKEY_S,
    OSKEY_T,
    OSKEY_U,
    OSKEY_V,
    OSKEY_W,
    OSKEY_X,
    OSKEY_Y,
    OSKEY_Z,
    OSKEY_LMETA,
    OSKEY_RMETA,
    OSKEY_APPS,
    OSKEY_SLEEP,
    OSKEY_NUMPAD0,
    OSKEY_NUMPAD1,
    OSKEY_NUMPAD2,
    OSKEY_NUMPAD3,
    OSKEY_NUMPAD4,
    OSKEY_NUMPAD5,
    OSKEY_NUMPAD6,
    OSKEY_NUMPAD7,
    OSKEY_NUMPAD8,
    OSKEY_NUMPAD9,
    OSKEY_MULTIPLY,
    OSKEY_ADD,
    OSKEY_SEPARATOR,
    OSKEY_SUBTRACT,
    OSKEY_DECIMAL,
    OSKEY_DIVIDE,
    OSKEY_F1,
    OSKEY_F2,
    OSKEY_F3,
    OSKEY_F4,
    OSKEY_F5,
    OSKEY_F6,
    OSKEY_F7,
    OSKEY_F8,
    OSKEY_F9,
    OSKEY_F10,
    OSKEY_F11,
    OSKEY_F12,
    OSKEY_F13,
    OSKEY_F14,
    OSKEY_F15,
    OSKEY_F16,
    OSKEY_F17,
    OSKEY_F18,
    OSKEY_F19,
    OSKEY_F20,
    OSKEY_F21,
    OSKEY_F22,
    OSKEY_F23,
    OSKEY_F24,
    OSKEY_NUMLOCK,
    OSKEY_SCROLLLOCK,
    OSKEY_OEM_NEC_EQUAL,
    OSKEY_OEM_FJ_JISHO,
    OSKEY_OEM_FJ_MASSHOU,
    OSKEY_OEM_FJ_TOUROKU,
    OSKEY_OEM_FJ_LOYA,
    OSKEY_OEM_FJ_ROYA,
    OSKEY_LSHIFT,
    OSKEY_RSHIFT,
    OSKEY_LCONTROL,
    OSKEY_RCONTROL,
    OSKEY_LALT,
    OSKEY_RALT,
    OSKEY_BROWSER_BACK,
    OSKEY_BROWSER_FORWARD,
    OSKEY_BROWSER_REFRESH,
    OSKEY_BROWSER_STOP,
    OSKEY_BROWSER_SEARCH,
    OSKEY_BROWSER_FAVORITES,
    OSKEY_BROWSER_HOME,
    OSKEY_VOLUME_MUTE,
    OSKEY_VOLUME_DOWN,
    OSKEY_VOLUME_UP,
    OSKEY_MEDIA_NEXT_TRACK,
    OSKEY_MEDIA_PREV_TRACK,
    OSKEY_MEDIA_STOP,
    OSKEY_MEDIA_PLAY_PAUSE,
    OSKEY_LAUNCH_MAIL,
    OSKEY_LAUNCH_MEDIA_SELECT,
    OSKEY_LAUNCH_APP1,
    OSKEY_LAUNCH_APP2,
    OSKEY_OEM_1,
    OSKEY_OEM_PLUS,
    OSKEY_OEM_COMMA,
    OSKEY_OEM_MINUS,
    OSKEY_OEM_PERIOD,
    OSKEY_OEM_2,
    OSKEY_OEM_3,
    OSKEY_OEM_4,
    OSKEY_OEM_5,
    OSKEY_OEM_6,
    OSKEY_OEM_7,
    OSKEY_OEM_8,
    OSKEY_OEM_AX,
    OSKEY_OEM_102,
    OSKEY_ICO_HELP,
    OSKEY_ICO_00,
    OSKEY_PROCESSKEY,
    OSKEY_ICO_CLEAR,
    OSKEY_PACKET,
    OSKEY_OEM_RESET,
    OSKEY_OEM_JUMP,
    OSKEY_OEM_PA1,
    OSKEY_OEM_PA2,
    OSKEY_OEM_PA3,
    OSKEY_OEM_WSCTRL,
    OSKEY_OEM_CUSEL,
    OSKEY_OEM_ATTN,
    OSKEY_OEM_FINISH,
    OSKEY_OEM_COPY,
    OSKEY_OEM_AUTO,
    OSKEY_OEM_ENLW,
    OSKEY_OEM_BACKTAB,
    OSKEY_ATTN,
    OSKEY_CRSEL,
    OSKEY_EXSEL,
    OSKEY_EREOF,
    OSKEY_PLAY,
    OSKEY_ZOOM,
    OSKEY_NONAME,
    OSKEY_PA1,
    OSKEY_OEM_CLEAR,
]

export function keyToString(this: void, key: joskeytype): string{
    switch (key){
        case OSKEY_BACKSPACE: {return 'BACKSPACE'}
        case OSKEY_TAB: {return 'TAB'}
        case OSKEY_CLEAR: {return 'CLEAR'}
        case OSKEY_RETURN: {return 'RETURN'}
        case OSKEY_SHIFT: {return 'SHIFT'}
        case OSKEY_CONTROL: {return 'CONTROL'}
        case OSKEY_ALT: {return 'ALT'}
        case OSKEY_PAUSE: {return 'PAUSE'}
        case OSKEY_CAPSLOCK: {return 'CAPSLOCK'}
        case OSKEY_KANA: {return 'KANA'}
        case OSKEY_HANGUL: {return 'HANGUL'}
        case OSKEY_JUNJA: {return 'JUNJA'}
        case OSKEY_FINAL: {return 'FINAL'}
        case OSKEY_HANJA: {return 'HANJA'}
        case OSKEY_KANJI: {return 'KANJI'}
        case OSKEY_ESCAPE: {return 'ESCAPE'}
        case OSKEY_CONVERT: {return 'CONVERT'}
        case OSKEY_NONCONVERT: {return 'NONCONVERT'}
        case OSKEY_ACCEPT: {return 'ACCEPT'}
        case OSKEY_MODECHANGE: {return 'MODECHANGE'}
        case OSKEY_SPACE: {return 'SPACE'}
        case OSKEY_PAGEUP: {return 'PAGEUP'}
        case OSKEY_PAGEDOWN: {return 'PAGEDOWN'}
        case OSKEY_END: {return 'END'}
        case OSKEY_HOME: {return 'HOME'}
        case OSKEY_LEFT: {return 'LEFT'}
        case OSKEY_UP: {return 'UP'}
        case OSKEY_RIGHT: {return 'RIGHT'}
        case OSKEY_DOWN: {return 'DOWN'}
        case OSKEY_SELECT: {return 'SELECT'}
        case OSKEY_PRINT: {return 'PRINT'}
        case OSKEY_EXECUTE: {return 'EXECUTE'}
        case OSKEY_PRINTSCREEN: {return 'PRINTSCREEN'}
        case OSKEY_INSERT: {return 'INSERT'}
        case OSKEY_DELETE: {return 'DELETE'}
        case OSKEY_HELP: {return 'HELP'}
        case OSKEY_0: {return '0'}
        case OSKEY_1: {return '1'}
        case OSKEY_2: {return '2'}
        case OSKEY_3: {return '3'}
        case OSKEY_4: {return '4'}
        case OSKEY_5: {return '5'}
        case OSKEY_6: {return '6'}
        case OSKEY_7: {return '7'}
        case OSKEY_8: {return '8'}
        case OSKEY_9: {return '9'}
        case OSKEY_A: {return 'A'}
        case OSKEY_B: {return 'B'}
        case OSKEY_C: {return 'C'}
        case OSKEY_D: {return 'D'}
        case OSKEY_E: {return 'E'}
        case OSKEY_F: {return 'F'}
        case OSKEY_G: {return 'G'}
        case OSKEY_H: {return 'H'}
        case OSKEY_I: {return 'I'}
        case OSKEY_J: {return 'J'}
        case OSKEY_K: {return 'K'}
        case OSKEY_L: {return 'L'}
        case OSKEY_M: {return 'M'}
        case OSKEY_N: {return 'N'}
        case OSKEY_O: {return 'O'}
        case OSKEY_P: {return 'P'}
        case OSKEY_Q: {return 'Q'}
        case OSKEY_R: {return 'R'}
        case OSKEY_S: {return 'S'}
        case OSKEY_T: {return 'T'}
        case OSKEY_U: {return 'U'}
        case OSKEY_V: {return 'V'}
        case OSKEY_W: {return 'W'}
        case OSKEY_X: {return 'X'}
        case OSKEY_Y: {return 'Y'}
        case OSKEY_Z: {return 'Z'}
        case OSKEY_LMETA: {return 'LMETA'}
        case OSKEY_RMETA: {return 'RMETA'}
        case OSKEY_APPS: {return 'APPS'}
        case OSKEY_SLEEP: {return 'SLEEP'}
        case OSKEY_NUMPAD0: {return 'NUMPAD0'}
        case OSKEY_NUMPAD1: {return 'NUMPAD1'}
        case OSKEY_NUMPAD2: {return 'NUMPAD2'}
        case OSKEY_NUMPAD3: {return 'NUMPAD3'}
        case OSKEY_NUMPAD4: {return 'NUMPAD4'}
        case OSKEY_NUMPAD5: {return 'NUMPAD5'}
        case OSKEY_NUMPAD6: {return 'NUMPAD6'}
        case OSKEY_NUMPAD7: {return 'NUMPAD7'}
        case OSKEY_NUMPAD8: {return 'NUMPAD8'}
        case OSKEY_NUMPAD9: {return 'NUMPAD9'}
        case OSKEY_MULTIPLY: {return 'MULTIPLY'}
        case OSKEY_ADD: {return 'ADD'}
        case OSKEY_SEPARATOR: {return 'SEPARATOR'}
        case OSKEY_SUBTRACT: {return 'SUBTRACT'}
        case OSKEY_DECIMAL: {return 'DECIMAL'}
        case OSKEY_DIVIDE: {return 'DIVIDE'}
        case OSKEY_F1: {return 'F1'}
        case OSKEY_F2: {return 'F2'}
        case OSKEY_F3: {return 'F3'}
        case OSKEY_F4: {return 'F4'}
        case OSKEY_F5: {return 'F5'}
        case OSKEY_F6: {return 'F6'}
        case OSKEY_F7: {return 'F7'}
        case OSKEY_F8: {return 'F8'}
        case OSKEY_F9: {return 'F9'}
        case OSKEY_F10: {return 'F10'}
        case OSKEY_F11: {return 'F11'}
        case OSKEY_F12: {return 'F12'}
        case OSKEY_F13: {return 'F13'}
        case OSKEY_F14: {return 'F14'}
        case OSKEY_F15: {return 'F15'}
        case OSKEY_F16: {return 'F16'}
        case OSKEY_F17: {return 'F17'}
        case OSKEY_F18: {return 'F18'}
        case OSKEY_F19: {return 'F19'}
        case OSKEY_F20: {return 'F20'}
        case OSKEY_F21: {return 'F21'}
        case OSKEY_F22: {return 'F22'}
        case OSKEY_F23: {return 'F23'}
        case OSKEY_F24: {return 'F24'}
        case OSKEY_NUMLOCK: {return 'NUMLOCK'}
        case OSKEY_SCROLLLOCK: {return 'SCROLLLOCK'}
        case OSKEY_OEM_NEC_EQUAL: {return 'OEM_NEC_EQUAL'}
        case OSKEY_OEM_FJ_JISHO: {return 'OEM_FJ_JISHO'}
        case OSKEY_OEM_FJ_MASSHOU: {return 'OEM_FJ_MASSHOU'}
        case OSKEY_OEM_FJ_TOUROKU: {return 'OEM_FJ_TOUROKU'}
        case OSKEY_OEM_FJ_LOYA: {return 'OEM_FJ_LOYA'}
        case OSKEY_OEM_FJ_ROYA: {return 'OEM_FJ_ROYA'}
        case OSKEY_LSHIFT: {return 'LSHIFT'}
        case OSKEY_RSHIFT: {return 'RSHIFT'}
        case OSKEY_LCONTROL: {return 'LCONTROL'}
        case OSKEY_RCONTROL: {return 'RCONTROL'}
        case OSKEY_LALT: {return 'LALT'}
        case OSKEY_RALT: {return 'RALT'}
        case OSKEY_BROWSER_BACK: {return 'BROWSER_BACK'}
        case OSKEY_BROWSER_FORWARD: {return 'BROWSER_FORWARD'}
        case OSKEY_BROWSER_REFRESH: {return 'BROWSER_REFRESH'}
        case OSKEY_BROWSER_STOP: {return 'BROWSER_STOP'}
        case OSKEY_BROWSER_SEARCH: {return 'BROWSER_SEARCH'}
        case OSKEY_BROWSER_FAVORITES: {return 'BROWSER_FAVORITES'}
        case OSKEY_BROWSER_HOME: {return 'BROWSER_HOME'}
        case OSKEY_VOLUME_MUTE: {return 'VOLUME_MUTE'}
        case OSKEY_VOLUME_DOWN: {return 'VOLUME_DOWN'}
        case OSKEY_VOLUME_UP: {return 'VOLUME_UP'}
        case OSKEY_MEDIA_NEXT_TRACK: {return 'MEDIA_NEXT_TRACK'}
        case OSKEY_MEDIA_PREV_TRACK: {return 'MEDIA_PREV_TRACK'}
        case OSKEY_MEDIA_STOP: {return 'MEDIA_STOP'}
        case OSKEY_MEDIA_PLAY_PAUSE: {return 'MEDIA_PLAY_PAUSE'}
        case OSKEY_LAUNCH_MAIL: {return 'LAUNCH_MAIL'}
        case OSKEY_LAUNCH_MEDIA_SELECT: {return 'LAUNCH_MEDIA_SELECT'}
        case OSKEY_LAUNCH_APP1: {return 'LAUNCH_APP1'}
        case OSKEY_LAUNCH_APP2: {return 'LAUNCH_APP2'}
        case OSKEY_OEM_1: {return 'OEM_1'}
        case OSKEY_OEM_PLUS: {return 'OEM_PLUS'}
        case OSKEY_OEM_COMMA: {return 'OEM_COMMA'}
        case OSKEY_OEM_MINUS: {return 'OEM_MINUS'}
        case OSKEY_OEM_PERIOD: {return 'OEM_PERIOD'}
        case OSKEY_OEM_2: {return 'OEM_2'}
        case OSKEY_OEM_3: {return 'OEM_3'}
        case OSKEY_OEM_4: {return 'OEM_4'}
        case OSKEY_OEM_5: {return 'OEM_5'}
        case OSKEY_OEM_6: {return 'OEM_6'}
        case OSKEY_OEM_7: {return 'OEM_7'}
        case OSKEY_OEM_8: {return 'OEM_8'}
        case OSKEY_OEM_AX: {return 'OEM_AX'}
        case OSKEY_OEM_102: {return 'OEM_102'}
        case OSKEY_ICO_HELP: {return 'ICO_HELP'}
        case OSKEY_ICO_00: {return 'ICO_00'}
        case OSKEY_PROCESSKEY: {return 'PROCESSKEY'}
        case OSKEY_ICO_CLEAR: {return 'ICO_CLEAR'}
        case OSKEY_PACKET: {return 'PACKET'}
        case OSKEY_OEM_RESET: {return 'OEM_RESET'}
        case OSKEY_OEM_JUMP: {return 'OEM_JUMP'}
        case OSKEY_OEM_PA1: {return 'OEM_PA1'}
        case OSKEY_OEM_PA2: {return 'OEM_PA2'}
        case OSKEY_OEM_PA3: {return 'OEM_PA3'}
        case OSKEY_OEM_WSCTRL: {return 'OEM_WSCTRL'}
        case OSKEY_OEM_CUSEL: {return 'OEM_CUSEL'}
        case OSKEY_OEM_ATTN: {return 'OEM_ATTN'}
        case OSKEY_OEM_FINISH: {return 'OEM_FINISH'}
        case OSKEY_OEM_COPY: {return 'OEM_COPY'}
        case OSKEY_OEM_AUTO: {return 'OEM_AUTO'}
        case OSKEY_OEM_ENLW: {return 'OEM_ENLW'}
        case OSKEY_OEM_BACKTAB: {return 'OEM_BACKTAB'}
        case OSKEY_ATTN: {return 'ATTN'}
        case OSKEY_CRSEL: {return 'CRSEL'}
        case OSKEY_EXSEL: {return 'EXSEL'}
        case OSKEY_EREOF: {return 'EREOF'}
        case OSKEY_PLAY: {return 'PLAY'}
        case OSKEY_ZOOM: {return 'ZOOM'}
        case OSKEY_NONAME: {return 'NONAME'}
        case OSKEY_PA1: {return 'PA1'}
        case OSKEY_OEM_CLEAR: {return 'OEM_CLEAR'}
        default: {return ''}
    }
}