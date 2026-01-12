---
title: Skript
sidebar:
    order: 10
---

The [Skript](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/Skript.java) interface provides the core functionality for registering addons.

:::tip
Unfortunately, there are currently two classes both named Skript, which can be confusing.
As our work to modernize the API continues, we have introduced the modern access point, the Skript class within the `org.skriptlang.skript` package.
Depending on the age of the API, it may be located within the older (`ch.njol.skript`) Skript class.
:::

## Accessing the Skript instance

Currently, the active Skript instance is accessible through a static getter on the [Skript JavaPlugin](https://github.com/SkriptLang/Skript/blob/master/src/main/java/ch/njol/skript/Skript.java) class:
```java
// MyAddon.java
import org.skriptlang.skript.Skript;
public class MyAddon {
	@Override
	public static void main(String[] args) {
		Skript skript = ch.njol.skript.Skript.instance();
	}
}
```
:::caution
The Skript instance obtained through `Skript.instance()` is unmodifiable, apart from the ability to register addons.
That is, [registries](../../registries/) obtained through it are typically unmodifiable as well.
:::

:::note
The rest of this page covers the API surrounding creating new Skript instances.
This functionality is not yet fully supported and not relevant for most developers.
:::

## Creating a new Skript instance

A static method (`of`) is available on the Skript interface for creating a new Skript instance using the default API implementation.
The method takes two things:
- The main class (source) of the program creating the Skript.
- A name for the Skript
```java
// MyApp.java
import org.skriptlang.skript.Skript;
public class MyApp {
	@Override
	public static void main(String[] args) {
		Skript skript = Skript.of(MyApp.class, "MyApp Skript");
	}
}
```
