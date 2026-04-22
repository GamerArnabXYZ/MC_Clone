#include <ucontext.h>

#define DUMP_REG1(label, value) do { \
	cc_uintptr _v0 = (cc_uintptr)(value); \
	String_Format1(str, label ": %x" _NL, &_v0); \
} while (0)

#define DUMP_REG2(label1, value1, label2, value2) do { \
	cc_uintptr _v0 = (cc_uintptr)(value1); \
	cc_uintptr _v1 = (cc_uintptr)(value2); \
	String_Format2(str, label1 ": %x  " label2 ": %x" _NL, &_v0, &_v1); \
} while (0)

void CrashHandler_DumpRegisters(void* ctx, cc_string* str) {
	ucontext_t* uc = (ucontext_t*)ctx;
	if (!uc) {
		String_AppendConst(str, "No crash context available" _NL);
		return;
	}

#if defined(__x86_64__) && defined(REG_RIP)
	DUMP_REG1("RIP", uc->uc_mcontext.gregs[REG_RIP]);
	DUMP_REG2("RSP", uc->uc_mcontext.gregs[REG_RSP], "RBP", uc->uc_mcontext.gregs[REG_RBP]);
	DUMP_REG2("RAX", uc->uc_mcontext.gregs[REG_RAX], "RBX", uc->uc_mcontext.gregs[REG_RBX]);
	DUMP_REG2("RCX", uc->uc_mcontext.gregs[REG_RCX], "RDX", uc->uc_mcontext.gregs[REG_RDX]);
	DUMP_REG2("RSI", uc->uc_mcontext.gregs[REG_RSI], "RDI", uc->uc_mcontext.gregs[REG_RDI]);
	DUMP_REG2("R8",  uc->uc_mcontext.gregs[REG_R8],  "R9",  uc->uc_mcontext.gregs[REG_R9]);
	DUMP_REG2("R10", uc->uc_mcontext.gregs[REG_R10], "R11", uc->uc_mcontext.gregs[REG_R11]);
	DUMP_REG2("R12", uc->uc_mcontext.gregs[REG_R12], "R13", uc->uc_mcontext.gregs[REG_R13]);
	DUMP_REG2("R14", uc->uc_mcontext.gregs[REG_R14], "R15", uc->uc_mcontext.gregs[REG_R15]);
#elif defined(__i386__) && defined(REG_EIP)
	DUMP_REG1("EIP", uc->uc_mcontext.gregs[REG_EIP]);
	DUMP_REG2("ESP", uc->uc_mcontext.gregs[REG_ESP], "EBP", uc->uc_mcontext.gregs[REG_EBP]);
	DUMP_REG2("EAX", uc->uc_mcontext.gregs[REG_EAX], "EBX", uc->uc_mcontext.gregs[REG_EBX]);
	DUMP_REG2("ECX", uc->uc_mcontext.gregs[REG_ECX], "EDX", uc->uc_mcontext.gregs[REG_EDX]);
	DUMP_REG2("ESI", uc->uc_mcontext.gregs[REG_ESI], "EDI", uc->uc_mcontext.gregs[REG_EDI]);
#elif defined(__aarch64__)
	DUMP_REG1("PC", uc->uc_mcontext.pc);
	DUMP_REG1("SP", uc->uc_mcontext.sp);
	DUMP_REG1("PSTATE", uc->uc_mcontext.pstate);
	DUMP_REG2("X0", uc->uc_mcontext.regs[0],   "X1",  uc->uc_mcontext.regs[1]);
	DUMP_REG2("X2", uc->uc_mcontext.regs[2],   "X3",  uc->uc_mcontext.regs[3]);
	DUMP_REG2("X4", uc->uc_mcontext.regs[4],   "X5",  uc->uc_mcontext.regs[5]);
	DUMP_REG2("X6", uc->uc_mcontext.regs[6],   "X7",  uc->uc_mcontext.regs[7]);
	DUMP_REG2("X29", uc->uc_mcontext.regs[29], "X30", uc->uc_mcontext.regs[30]);
#elif defined(__arm__) && defined(__GLIBC__)
	DUMP_REG1("PC", uc->uc_mcontext.arm_pc);
	DUMP_REG1("SP", uc->uc_mcontext.arm_sp);
	DUMP_REG1("LR", uc->uc_mcontext.arm_lr);
	DUMP_REG1("CPSR", uc->uc_mcontext.arm_cpsr);
	DUMP_REG2("R0", uc->uc_mcontext.arm_r0, "R1", uc->uc_mcontext.arm_r1);
	DUMP_REG2("R2", uc->uc_mcontext.arm_r2, "R3", uc->uc_mcontext.arm_r3);
	DUMP_REG2("R4", uc->uc_mcontext.arm_r4, "R5", uc->uc_mcontext.arm_r5);
	DUMP_REG2("R6", uc->uc_mcontext.arm_r6, "R7", uc->uc_mcontext.arm_r7);
#else
	String_AppendConst(str, "Register dump unavailable for this Linux architecture" _NL);
#endif
}

#undef DUMP_REG2
#undef DUMP_REG1
