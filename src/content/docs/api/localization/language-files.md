---
title: Language Files
sidebar:
    order: 10
---

By default, Skript has two core language files, `default.lang` and `english.lang`.
The former is used for language entries that are *not* intended to be edited by the user,
while the latter is for entries, such as error messages, that are safe to be translated into other languages.

For addons, these language files are typically stored in a `lang` directory in your project's resources folder.
Addons are not required to provide language files by default.
Note that some features may require language entries, and if that is the case, the addon only has to provide a `default.lang` file.

Within a language file, it is only required that you include a version entry:
```
// default.lang
version: 1.0.0
```

Language entries are defined in a tree-like structure:
```
// default.lang
error messages:
    unknown error: An unknown error has occurred.
```
This entry would then be available under the key `error messages.unknown error`.
