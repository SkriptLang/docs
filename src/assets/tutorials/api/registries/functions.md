---
title: Functions
author: Efnilite
date: 9/7/2024
url: https://github.com/SkriptLang/docs/blob/master/src/assets/tutorials/api/registries/functions.md
section: API/Registries
index: 1
---

# Functions

Skript's functions allow users to perform specific actions at multiple points in a code base.
To allow addons to easily add their own functions, Skript 2.13 introduced a new API for registering functions, 
which uses the DefaultFunction class. Compared to the previous way of dealing with functions, 
this new API is a drastic improvement in several key ways. 

As an example, let's register a function that removes a specific character from some strings,
which defaults to removing all spaces.

```applescript
# Intended result
set {_x::*} to remove("  hello  ") # "hello"
set {_y::*} to remove("  hello  ", " hey ") # "hello", "hey"
set {_z::*} to remove(("  hello  ", " hey "), "h") # "  ello  ", " ey " 
```

## Creating a new builder

First, create a new `DefaultFunction.Builder`. This builder takes the `SkriptAddon`
instance of your addon, the name of the function, and the return type of the function. Since our
function always returns an array of strings, we can specify the return type as `String[].class`.
If our function only returned a single string value, the return type would be `String.class`.

```java
SkriptAddon addon = SkriptAddon.of(YourMainClass.class);

DefaultFunction.builder(addon, "remove", String[].class)
```

## Documentation

The documentation should be specified next. 
This allows documentation sites to view more information about the function.

- The description features a brief description of the function and information about how it works.
- The examples contain example use cases or examples of what the function returns.
- The since method specifies the version history of the function. Any changes or additions to the function's workings should be added here. 
- The keywords contain words that may be associated with this function.

```java
DefaultFunction.builder(addon, "remove", String[].class)
    .description("Removes a specific character from the strings.",
        "Removes spaces if no character is specified.")
    .examples("""
        set {_x::*} to remove("  hello  ") # "hello"
        set {_y::*} to remove("  hello  ", " hey ") # "hello", "hey"
        set {_z::*} to remove(("  hello  ", " hey "), "h") # "  ello  ", " ey " 
        """)
    .since("3.0")
    .keywords("format", "strings")
```

## Parameters

Next, we should specify what arguments our function with the `parameter` function.
This specifies the parameter name and the type it accepts. Like the return type,
using an array indicates that multiple values can be passed to the argument. 

Note that the `char` parameter contains a modifier which indicates that no value is required to be passed to the argument. 

```java
DefaultFunction.builder(addon, "remove", String[].class)
    .description("Removes a specific character from the strings.",
        "Removes spaces if no character is specified.")
    .examples("""
        set {_x::*} to remove("  hello  ") # "hello"
        set {_y::*} to remove("  hello  ", " hey ") # "hello", "hey"
        set {_z::*} to remove(("  hello  ", " hey "), "h") # "  ello  ", " ey " 
        """)
    .since("3.0")
    .keywords("format", "strings")
    .parameter("strings", String[].class)
    .parameter("char", String.class, Modifier.OPTIONAL)
```

## Implementation

To complete our function, we add the actual implementation code.
The `build` method provides you with a `FunctionArguments` instance, called `args` in our example. This contains
all the values for the parameters that are passed when a function is called. These values are associated by the name
of the parameter. 

```java
DefaultFunction.builder(addon, "remove", String[].class)
    .description("Removes a specific character from the strings.",
        "Removes spaces if no character is specified.")
    .examples("""
        set {_x::*} to remove("  hello  ") # "hello"
        set {_y::*} to remove("  hello  ", " hey ") # "hello", "hey"
        set {_z::*} to remove(("  hello  ", " hey "), "h") # "  ello  ", " ey " 
        """)
    .since("3.0")
    .keywords("format", "strings")
    .parameter("strings", String[].class)
    .parameter("char", String.class, Modifier.OPTIONAL)
    .build(args -> {
         // what the user entered for strings
        String[] strings = args.get("strings");

        // what the user entered, or, if the user passed nothing, returns " "
        // this is only necessary because char has Modifier.OPTIONAL
        String chr = args.getOrDefault("char", " "); 

        // actually replace all the characters
        for (int i = 0; i < strings.length; i++) {
            strings[i] = strings[i].replaceAll(chr, "");
        }

        // return the value
        return strings;
    });
```

## Final step

Now that we have our function, we should register it. To do this, use `Functions#register`.

```java
DefaultFunction<String[]> remove = DefaultFunction.builder(addon, "remove", String[].class)
    .description("Removes a specific character from the strings.",
        "Removes spaces if no character is specified.")
    .examples("""
        set {_x::*} to remove("  hello  ") # "hello"
        set {_y::*} to remove("  hello  ", " hey ") # "hello", "hey"
        set {_z::*} to remove(("  hello  ", " hey "), "h") # "  ello  ", " ey " 
        """)
    .since("3.0")
    .keywords("format", "strings")
    .parameter("strings", String[].class)
    .parameter("char", String.class, Modifier.OPTIONAL)
    .build(args -> {
         // what the user entered for strings
        String[] strings = args.get("strings");

        // what the user entered, or, if the user passed nothing, returns " "
        // this is only necessary because char has Modifier.OPTIONAL
        String chr = args.getOrDefault("char", " "); 

        // actually replace all the characters
        for (int i = 0; i < strings.length; i++) {
            strings[i] = strings[i].replaceAll(chr, "");
        }

        // return the value
        return strings;
    });

Functions.register(remove);
```

## Other examples

These are some other implementations that are currently being used by Skript.

```java
DefaultFunction.builder(skript, "concat", String.class)
    .description("Joins the provided texts (and other things) into a single text.")
    .examples(
        "concat(\"hello \", \"there\") # hello there",
        "concat(\"foo \", 100, \" bar\") # foo 100 bar"
    )
    .since("2.9.0")
    .parameter("texts", Object[].class)
    .build(args -> {
        StringBuilder builder = new StringBuilder();
        Object[] objects = args.get("texts");
        for (Object object : objects) {
            builder.append(Classes.toString(object));
        }
        return builder.toString();
    });
```

```java
Functions.register(DefaultFunction.builder(skript, "location", Location.class)
    .description(
        "Creates a location from a world and 3 coordinates, with an optional yaw and pitch.",
        "If for whatever reason the world is not found, it will fallback to the server's main world."
    )
    .examples("""
        # TELEPORTING
        teleport player to location(1,1,1, world "world")"""
    )
    .since("2.2")
    .parameter("x", Number.class)
    .parameter("y", Number.class)
    .parameter("z", Number.class)
    .parameter("world", World.class, Modifier.OPTIONAL)
    .parameter("yaw", Float.class, Modifier.OPTIONAL)
    .parameter("pitch", Float.class, Modifier.OPTIONAL)
    .build(args -> {
        World world = args.getOrDefault("world", Bukkit.getWorlds().get(0));

        return new Location(world,
            args.<Number>get("x").doubleValue(), args.<Number>get("y").doubleValue(), args.<Number>get("z").doubleValue(),
            args.getOrDefault("yaw", 0f), args.getOrDefault("pitch", 0f));
    }));
```
