#include "Menus.h"
#include "Widgets.h"
#include "Game.h"
#include "Event.h"
#include "Platform.h"
#include "Gui.h"
#include "Stream.h"
#include "String_.h"
#include "Graphics.h"
#include "Options.h"
#include "Server.h"
#include "ExtMath.h"
#include "Vectors.h"
#include "Drawer2D.h"
#include "Screens.h"

/*########################################################################################################################*
*-------------------------------------------------------HomeScreen--------------------------------------------------------*
*#########################################################################################################################*/
static struct HomeScreen {
	Screen_Body
	struct ButtonWidget btnPlay;
	struct TextWidget   title;
	struct TextWidget   lblUsername;
	struct TextInputWidget inputUsername;
	struct Widget* _widgets[4];
} HomeScreen;

static void HomeScreen_StartGame(void* screen, void* w) {
	Gui_Remove((struct Screen*)&HomeScreen);
	SPConnection_DoStart();
}

static void HomeScreen_OnNameChanged(void* elem) {
	struct InputWidget* w = (struct InputWidget*)elem;
	String_Copy(&Game_Username, &w->text);
	Options_Set(LOPT_USERNAME, &w->text);
}

static void HomeScreen_ContextRecreated(void* screen) {
	struct HomeScreen* s = (struct HomeScreen*)screen;
	struct FontDesc titleFont, textFont;
	Screen_UpdateVb(s);

	Gui_MakeTitleFont(&titleFont);
	Gui_MakeBodyFont(&textFont);

	TextWidget_SetConst(&s->title,       "VoxelCraft",    &titleFont);
	TextWidget_SetConst(&s->lblUsername, "Your Name:",    &textFont);
	ButtonWidget_SetConst(&s->btnPlay,   "PLAY NOW",      &titleFont);

	/* Setup input widget */
	TextInputWidget_SetFont(&s->inputUsername, &textFont);

	Font_Free(&titleFont);
	Font_Free(&textFont);
}

static void HomeScreen_Layout(void* screen) {
	struct HomeScreen* s = (struct HomeScreen*)screen;
	Widget_SetLocation(&s->title,         ANCHOR_CENTRE, ANCHOR_CENTRE, 0, -120);
	Widget_SetLocation(&s->lblUsername,   ANCHOR_CENTRE, ANCHOR_CENTRE, 0,  -60);
	Widget_SetLocation(&s->inputUsername, ANCHOR_CENTRE, ANCHOR_CENTRE, 0,  -20);
	Widget_SetLocation(&s->btnPlay,       ANCHOR_CENTRE, ANCHOR_CENTRE, 0,   60);
}

static void HomeScreen_Init(void* screen) {
	struct HomeScreen* s = (struct HomeScreen*)screen;
	struct MenuInputDesc desc;
	s->widgets    = s->_widgets;
	s->numWidgets = 0;
	s->maxWidgets = Array_Elems(s->_widgets);

	/* Initialize Input Widget */
	MenuInput_String(desc);
	TextInputWidget_Create(&s->inputUsername, 300, &Game_Username, &desc);
	s->inputUsername.base.OnTextChanged = HomeScreen_OnNameChanged;

	TextWidget_Add(s,   &s->title);
	TextWidget_Add(s,   &s->lblUsername);
	Widget_Add(s,       (struct Widget*)&s->inputUsername);
	ButtonWidget_Add(s, &s->btnPlay, 240, HomeScreen_StartGame);

	s->maxVertices = Screen_CalcDefaultMaxVertices(s);
}

static const struct ScreenVTABLE HomeScreen_VTABLE = {
	HomeScreen_Init,    Screen_NullUpdate, Screen_NullFunc,
	MenuScreen_Render2, Screen_BuildMesh,
	Menu_InputDown,     Screen_InputUp,    Screen_FKeyPress,  Screen_FText,
	Menu_PointerDown,   Screen_PointerUp,  Menu_PointerMove,  Screen_FMouseScroll,
	HomeScreen_Layout,  Screen_ContextLost, HomeScreen_ContextRecreated
};

void HomeScreen_Show(void) {
	struct HomeScreen* s = &HomeScreen;
	s->grabsInput = true;
	s->closable   = false;
	s->VTABLE     = &HomeScreen_VTABLE;
	Gui_Add((struct Screen*)s, GUI_PRIORITY_MENU);
}
