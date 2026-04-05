SOURCE_DIR  = src
BUILD_DIR   = build
C_SOURCES   = $(wildcard $(SOURCE_DIR)/*.c)
OBJECTS     = $(patsubst %.c, $(BUILD_DIR)/%.o, $(C_SOURCES))
BUILD_DIRS  = $(BUILD_DIR) $(BUILD_DIR)/src

##############################
# Configurable flags and names
##############################
CFLAGS  = -pipe -fno-math-errno -Werror -Wno-error=missing-braces -Wno-error=strict-aliasing
LDFLAGS = -g -rdynamic
ENAME   = ClassiCube
TARGET  := $(ENAME)

TRACK_DEPENDENCIES=1
LINK = $(CC)
BEARSSL=1
OPT_LEVEL=1

ifndef RM
	RM = rm -f
endif

#########################################################
# Platform config - web only
#########################################################
ifeq ($(PLAT),web)
	CC      = emcc
	OEXT    = .html
	CFLAGS  = -g
	LDFLAGS = -g -s WASM=1 -s NO_EXIT_RUNTIME=1 -s ABORTING_MALLOC=0 -s ALLOW_MEMORY_GROWTH=1 -s TOTAL_STACK=256Kb --js-library $(SOURCE_DIR)/webclient/interop_web.js
	BUILD_DIR = build/web
	BEARSSL = 0
	BUILD_DIRS += $(BUILD_DIR)/src/webclient
	C_SOURCES  += $(wildcard src/webclient/*.c)
endif

ifeq ($(BEARSSL),1)
	BUILD_DIRS += $(BUILD_DIR)/third_party/bearssl
	C_SOURCES  += $(wildcard third_party/bearssl/*.c)
endif

ifdef RELEASE
	CFLAGS += -O$(OPT_LEVEL)
else
	CFLAGS += -g
endif

default: web

web:
	$(MAKE) $(TARGET) PLAT=web
android:
	$(MAKE) -f misc/android/Makefile
release:
	$(MAKE) $(TARGET) RELEASE=1 PLAT=web
clean:
	$(RM) $(OBJECTS)

$(BUILD_DIRS):
	mkdir -p $@

$(ENAME): $(BUILD_DIRS) $(OBJECTS)
	$(LINK) $(LDFLAGS) -o $@$(OEXT) $(OBJECTS) $(EXTRA_LIBS) $(LIBS)
	@echo "----------------------------------------------------"
	@echo "Successfully compiled: $(ENAME)"
	@echo "----------------------------------------------------"

ifeq ($(TRACK_DEPENDENCIES), 1)
DEPFLAGS = -MT $@ -MMD -MP -MF $(BUILD_DIR)/$*.d
DEPFILES := $(patsubst %.o, %.d, $(OBJECTS))
$(DEPFILES):
$(BUILD_DIR)/%.o : %.c $(BUILD_DIR)/%.d
	$(CC) $(CFLAGS) $(EXTRA_CFLAGS) $(DEPFLAGS) -c $< -o $@
include $(wildcard $(DEPFILES))
else
$(BUILD_DIR)/%.o : %.c
	$(CC) $(CFLAGS) $(EXTRA_CFLAGS) -c $< -o $@
endif
