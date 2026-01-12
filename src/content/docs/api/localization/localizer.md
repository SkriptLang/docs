---
title: Localizer
sidebar:
    order: 20
    badge:
        text: Experimental
        variant: caution
---

:::caution[Experimental]
The API described in this page is still experimental and subject to change.
However, there will be no breaking changes to methods detailed below.
If necessary, they would only be deprecated for future removal.
:::

The Localizer is an **experimental** interface defining the methods available for localization.
Currently, it is only used by addons to load their language files, which is described below.

## Obtaining a Localizer
A Localizer instance is available through your [registered addon](../../skript/addons) by calling the `localizer()` method:
```java
SkriptAddon addon = ...;
Localizer addonLocalizer = addon.localizer();
```

## Loading language files
The localizer currently provides a single method, `setSourceDirectories(String, String)` for loading an addon's language files.
It takes two parameters:
- A string representing the path to the directory (on the jar) containing language files
- A string representing the path to the directory (on the disk) containing language files

The second parameter may be null. That is, there is no requirement that you store language files outside your application's jar.
However, you may wish to do so if you have language files that are intended to be customizable by the user.

### Example usage
Let's say my addon's language files are stored in a directory `lang` on the jar (as is typical).
I can simply call the `setSourceDirectories` method with this path:
```java
Localizer localizer = ...;
localizer.setSourceDirectories("lang", null);
```
After calling this method, Skript will immediately load the `default.lang` and `english.lang` (if present) files from that directory in your jar.

## Evaluating entries
The `translate(String)` method can be used for obtaining the translation of a language key (the parameter).
This method will return `null` if there is no translation for the provided key.

Let's say my addon's default language file has the following entry:
```
// default.lang
error messages:
    unknown error: An unknown error has occurred.
```
I can obtain its value by simply calling:
```java
Localizer localizer = ...;
String message = localizer.translate("error messages.unknown error");
```
