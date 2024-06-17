# Introduction

Apple restricted the access to Xcode LLM (Predictive code completion) feature on China models of Mac. This guide provides a way to bypass that restriction. It's verified on macOS 15.0 Beta (24A5264n), but there is no guarentee that it will always work on later macOS versions.

# Prerequisites

* Xcode is installed and run at least once.
* SIP debugging restrictions are disabled (via `csrutil enable --without debug` command in recovery mode).

# Disclaimer

Disabling SIP can cause some unknown effect. And for now, Xcode LLM is not stable and may cause kernel panics, which will lose some of your document modifications. **Please use with caution.**

# Bypass Steps

**1. Attach to `eligibilityd` using LLDB**

```shell
$ sudo lldb
```

Then execute the below command in LLDB console:

```
(lldb) process attach --name eligibilityd
```

It should stop the main thread of `eligibilityd` process and show a `(lldb)` prompt if successful.

**2. Modify the device region**

```
(lldb) e (void) [[[InputManager sharedInstance] objectForInputValue:6] setValue:@"US" forKey:@"_deviceRegionCode"]
```

**3. Recompute the domain answers**

```
(lldb) e (void) [[EligibilityEngine sharedInstance] recomputeAllDomainAnswers]
```

**4. Verify the domain answer (Optional)**

You can check whether the operation is effective by executing:

```
(lldb) po [[[[EligibilityEngine sharedInstance] domains] objectForKey:@"OS_ELIGIBILITY_DOMAIN_XCODE_LLM"] answer]
```

If it prints `0x0000000000000004` then it's all good.

**5. Detach the process and exit LLDB**

```
(lldb) process detach
(lldb) exit
```

**6. Restart Xcode and enjoy!**

# Acknowledgement

Thanks for those who make this possible together: [Lakr233](https://x.com/Lakr233), [Sou1gh0st](https://x.com/Sou1gh0st), Yuriko.
