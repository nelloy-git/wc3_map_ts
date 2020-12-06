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
    if (key == OSKEY_BACKSPACE){return 'BACKSPACE'}
    else if (key == OSKEY_TAB){return 'TAB'}
    else if (key == OSKEY_CLEAR){return 'CLEAR'}
    else if (key == OSKEY_RETURN){return 'RETURN'}
    else if (key == OSKEY_SHIFT){return 'SHIFT'}
    else if (key == OSKEY_CONTROL){return 'CONTROL'}
    else if (key == OSKEY_ALT){return 'ALT'}
    else if (key == OSKEY_PAUSE){return 'PAUSE'}
    else if (key == OSKEY_CAPSLOCK){return 'CAPSLOCK'}
    else if (key == OSKEY_KANA){return 'KANA'}
    else if (key == OSKEY_HANGUL){return 'HANGUL'}
    else if (key == OSKEY_JUNJA){return 'JUNJA'}
    else if (key == OSKEY_FINAL){return 'FINAL'}
    else if (key == OSKEY_HANJA){return 'HANJA'}
    else if (key == OSKEY_KANJI){return 'KANJI'}
    else if (key == OSKEY_ESCAPE){return 'ESCAPE'}
    else if (key == OSKEY_CONVERT){return 'CONVERT'}
    else if (key == OSKEY_NONCONVERT){return 'NONCONVERT'}
    else if (key == OSKEY_ACCEPT){return 'ACCEPT'}
    else if (key == OSKEY_MODECHANGE){return 'MODECHANGE'}
    else if (key == OSKEY_SPACE){return 'SPACE'}
    else if (key == OSKEY_PAGEUP){return 'PAGEUP'}
    else if (key == OSKEY_PAGEDOWN){return 'PAGEDOWN'}
    else if (key == OSKEY_END){return 'END'}
    else if (key == OSKEY_HOME){return 'HOME'}
    else if (key == OSKEY_LEFT){return 'LEFT'}
    else if (key == OSKEY_UP){return 'UP'}
    else if (key == OSKEY_RIGHT){return 'RIGHT'}
    else if (key == OSKEY_DOWN){return 'DOWN'}
    else if (key == OSKEY_SELECT){return 'SELECT'}
    else if (key == OSKEY_PRINT){return 'PRINT'}
    else if (key == OSKEY_EXECUTE){return 'EXECUTE'}
    else if (key == OSKEY_PRINTSCREEN){return 'PRINTSCREEN'}
    else if (key == OSKEY_INSERT){return 'INSERT'}
    else if (key == OSKEY_DELETE){return 'DELETE'}
    else if (key == OSKEY_HELP){return 'HELP'}
    else if (key == OSKEY_0){return '0'}
    else if (key == OSKEY_1){return '1'}
    else if (key == OSKEY_2){return '2'}
    else if (key == OSKEY_3){return '3'}
    else if (key == OSKEY_4){return '4'}
    else if (key == OSKEY_5){return '5'}
    else if (key == OSKEY_6){return '6'}
    else if (key == OSKEY_7){return '7'}
    else if (key == OSKEY_8){return '8'}
    else if (key == OSKEY_9){return '9'}
    else if (key == OSKEY_A){return 'A'}
    else if (key == OSKEY_B){return 'B'}
    else if (key == OSKEY_C){return 'C'}
    else if (key == OSKEY_D){return 'D'}
    else if (key == OSKEY_E){return 'E'}
    else if (key == OSKEY_F){return 'F'}
    else if (key == OSKEY_G){return 'G'}
    else if (key == OSKEY_H){return 'H'}
    else if (key == OSKEY_I){return 'I'}
    else if (key == OSKEY_J){return 'J'}
    else if (key == OSKEY_K){return 'K'}
    else if (key == OSKEY_L){return 'L'}
    else if (key == OSKEY_M){return 'M'}
    else if (key == OSKEY_N){return 'N'}
    else if (key == OSKEY_O){return 'O'}
    else if (key == OSKEY_P){return 'P'}
    else if (key == OSKEY_Q){return 'Q'}
    else if (key == OSKEY_R){return 'R'}
    else if (key == OSKEY_S){return 'S'}
    else if (key == OSKEY_T){return 'T'}
    else if (key == OSKEY_U){return 'U'}
    else if (key == OSKEY_V){return 'V'}
    else if (key == OSKEY_W){return 'W'}
    else if (key == OSKEY_X){return 'X'}
    else if (key == OSKEY_Y){return 'Y'}
    else if (key == OSKEY_Z){return 'Z'}
    else if (key == OSKEY_LMETA){return 'LMETA'}
    else if (key == OSKEY_RMETA){return 'RMETA'}
    else if (key == OSKEY_APPS){return 'APPS'}
    else if (key == OSKEY_SLEEP){return 'SLEEP'}
    else if (key == OSKEY_NUMPAD0){return 'NUMPAD0'}
    else if (key == OSKEY_NUMPAD1){return 'NUMPAD1'}
    else if (key == OSKEY_NUMPAD2){return 'NUMPAD2'}
    else if (key == OSKEY_NUMPAD3){return 'NUMPAD3'}
    else if (key == OSKEY_NUMPAD4){return 'NUMPAD4'}
    else if (key == OSKEY_NUMPAD5){return 'NUMPAD5'}
    else if (key == OSKEY_NUMPAD6){return 'NUMPAD6'}
    else if (key == OSKEY_NUMPAD7){return 'NUMPAD7'}
    else if (key == OSKEY_NUMPAD8){return 'NUMPAD8'}
    else if (key == OSKEY_NUMPAD9){return 'NUMPAD9'}
    else if (key == OSKEY_MULTIPLY){return 'MULTIPLY'}
    else if (key == OSKEY_ADD){return 'ADD'}
    else if (key == OSKEY_SEPARATOR){return 'SEPARATOR'}
    else if (key == OSKEY_SUBTRACT){return 'SUBTRACT'}
    else if (key == OSKEY_DECIMAL){return 'DECIMAL'}
    else if (key == OSKEY_DIVIDE){return 'DIVIDE'}
    else if (key == OSKEY_F1){return 'F1'}
    else if (key == OSKEY_F2){return 'F2'}
    else if (key == OSKEY_F3){return 'F3'}
    else if (key == OSKEY_F4){return 'F4'}
    else if (key == OSKEY_F5){return 'F5'}
    else if (key == OSKEY_F6){return 'F6'}
    else if (key == OSKEY_F7){return 'F7'}
    else if (key == OSKEY_F8){return 'F8'}
    else if (key == OSKEY_F9){return 'F9'}
    else if (key == OSKEY_F10){return 'F10'}
    else if (key == OSKEY_F11){return 'F11'}
    else if (key == OSKEY_F12){return 'F12'}
    else if (key == OSKEY_F13){return 'F13'}
    else if (key == OSKEY_F14){return 'F14'}
    else if (key == OSKEY_F15){return 'F15'}
    else if (key == OSKEY_F16){return 'F16'}
    else if (key == OSKEY_F17){return 'F17'}
    else if (key == OSKEY_F18){return 'F18'}
    else if (key == OSKEY_F19){return 'F19'}
    else if (key == OSKEY_F20){return 'F20'}
    else if (key == OSKEY_F21){return 'F21'}
    else if (key == OSKEY_F22){return 'F22'}
    else if (key == OSKEY_F23){return 'F23'}
    else if (key == OSKEY_F24){return 'F24'}
    else if (key == OSKEY_NUMLOCK){return 'NUMLOCK'}
    else if (key == OSKEY_SCROLLLOCK){return 'SCROLLLOCK'}
    else if (key == OSKEY_OEM_NEC_EQUAL){return 'OEM_NEC_EQUAL'}
    else if (key == OSKEY_OEM_FJ_JISHO){return 'OEM_FJ_JISHO'}
    else if (key == OSKEY_OEM_FJ_MASSHOU){return 'OEM_FJ_MASSHOU'}
    else if (key == OSKEY_OEM_FJ_TOUROKU){return 'OEM_FJ_TOUROKU'}
    else if (key == OSKEY_OEM_FJ_LOYA){return 'OEM_FJ_LOYA'}
    else if (key == OSKEY_OEM_FJ_ROYA){return 'OEM_FJ_ROYA'}
    else if (key == OSKEY_LSHIFT){return 'LSHIFT'}
    else if (key == OSKEY_RSHIFT){return 'RSHIFT'}
    else if (key == OSKEY_LCONTROL){return 'LCONTROL'}
    else if (key == OSKEY_RCONTROL){return 'RCONTROL'}
    else if (key == OSKEY_LALT){return 'LALT'}
    else if (key == OSKEY_RALT){return 'RALT'}
    else if (key == OSKEY_BROWSER_BACK){return 'BROWSER_BACK'}
    else if (key == OSKEY_BROWSER_FORWARD){return 'BROWSER_FORWARD'}
    else if (key == OSKEY_BROWSER_REFRESH){return 'BROWSER_REFRESH'}
    else if (key == OSKEY_BROWSER_STOP){return 'BROWSER_STOP'}
    else if (key == OSKEY_BROWSER_SEARCH){return 'BROWSER_SEARCH'}
    else if (key == OSKEY_BROWSER_FAVORITES){return 'BROWSER_FAVORITES'}
    else if (key == OSKEY_BROWSER_HOME){return 'BROWSER_HOME'}
    else if (key == OSKEY_VOLUME_MUTE){return 'VOLUME_MUTE'}
    else if (key == OSKEY_VOLUME_DOWN){return 'VOLUME_DOWN'}
    else if (key == OSKEY_VOLUME_UP){return 'VOLUME_UP'}
    else if (key == OSKEY_MEDIA_NEXT_TRACK){return 'MEDIA_NEXT_TRACK'}
    else if (key == OSKEY_MEDIA_PREV_TRACK){return 'MEDIA_PREV_TRACK'}
    else if (key == OSKEY_MEDIA_STOP){return 'MEDIA_STOP'}
    else if (key == OSKEY_MEDIA_PLAY_PAUSE){return 'MEDIA_PLAY_PAUSE'}
    else if (key == OSKEY_LAUNCH_MAIL){return 'LAUNCH_MAIL'}
    else if (key == OSKEY_LAUNCH_MEDIA_SELECT){return 'LAUNCH_MEDIA_SELECT'}
    else if (key == OSKEY_LAUNCH_APP1){return 'LAUNCH_APP1'}
    else if (key == OSKEY_LAUNCH_APP2){return 'LAUNCH_APP2'}
    else if (key == OSKEY_OEM_1){return 'OEM_1'}
    else if (key == OSKEY_OEM_PLUS){return 'OEM_PLUS'}
    else if (key == OSKEY_OEM_COMMA){return 'OEM_COMMA'}
    else if (key == OSKEY_OEM_MINUS){return 'OEM_MINUS'}
    else if (key == OSKEY_OEM_PERIOD){return 'OEM_PERIOD'}
    else if (key == OSKEY_OEM_2){return 'OEM_2'}
    else if (key == OSKEY_OEM_3){return 'OEM_3'}
    else if (key == OSKEY_OEM_4){return 'OEM_4'}
    else if (key == OSKEY_OEM_5){return 'OEM_5'}
    else if (key == OSKEY_OEM_6){return 'OEM_6'}
    else if (key == OSKEY_OEM_7){return 'OEM_7'}
    else if (key == OSKEY_OEM_8){return 'OEM_8'}
    else if (key == OSKEY_OEM_AX){return 'OEM_AX'}
    else if (key == OSKEY_OEM_102){return 'OEM_102'}
    else if (key == OSKEY_ICO_HELP){return 'ICO_HELP'}
    else if (key == OSKEY_ICO_00){return 'ICO_00'}
    else if (key == OSKEY_PROCESSKEY){return 'PROCESSKEY'}
    else if (key == OSKEY_ICO_CLEAR){return 'ICO_CLEAR'}
    else if (key == OSKEY_PACKET){return 'PACKET'}
    else if (key == OSKEY_OEM_RESET){return 'OEM_RESET'}
    else if (key == OSKEY_OEM_JUMP){return 'OEM_JUMP'}
    else if (key == OSKEY_OEM_PA1){return 'OEM_PA1'}
    else if (key == OSKEY_OEM_PA2){return 'OEM_PA2'}
    else if (key == OSKEY_OEM_PA3){return 'OEM_PA3'}
    else if (key == OSKEY_OEM_WSCTRL){return 'OEM_WSCTRL'}
    else if (key == OSKEY_OEM_CUSEL){return 'OEM_CUSEL'}
    else if (key == OSKEY_OEM_ATTN){return 'OEM_ATTN'}
    else if (key == OSKEY_OEM_FINISH){return 'OEM_FINISH'}
    else if (key == OSKEY_OEM_COPY){return 'OEM_COPY'}
    else if (key == OSKEY_OEM_AUTO){return 'OEM_AUTO'}
    else if (key == OSKEY_OEM_ENLW){return 'OEM_ENLW'}
    else if (key == OSKEY_OEM_BACKTAB){return 'OEM_BACKTAB'}
    else if (key == OSKEY_ATTN){return 'ATTN'}
    else if (key == OSKEY_CRSEL){return 'CRSEL'}
    else if (key == OSKEY_EXSEL){return 'EXSEL'}
    else if (key == OSKEY_EREOF){return 'EREOF'}
    else if (key == OSKEY_PLAY){return 'PLAY'}
    else if (key == OSKEY_ZOOM){return 'ZOOM'}
    else if (key == OSKEY_NONAME){return 'NONAME'}
    else if (key == OSKEY_PA1){return 'PA1'}
    else if (key == OSKEY_OEM_CLEAR){return 'OEM_CLEAR'}
    else {return ''}
}