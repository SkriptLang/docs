---
title: Writing Syntax
sidebar:
    order: 5
---

## SyntaxInfos

In Skript, every syntax is defined by a [SyntaxInfo](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/registration/SyntaxInfo.java)
that describes the properties of that syntax.

### Creating SyntaxInfos
Skript provides a standard implementation and builder for SyntaxInfos.
A new builder can be created by using the `builder(Class)` method on SyntaxInfo.
It takes one parameter: the class implementing the syntax.
As an example, let's start by creating a new builder for a SyntaxInfo:
```java
var builder = SyntaxInfo.builder(MySyntax.class);
```
We recommend using `var` for SyntaxInfo builders to simplify generics handling.

### Patterns
Every syntax is made up of patterns that must be matched for your syntax implementation to be used.
They can be accessed by calling the `patterns` method on a SyntaxInfo.

The simplest pattern is made up of literal characters:
```text
stop the server
```
Of course, we might want our syntax to have more flexibility without creating distinct patterns.
Skript uses a custom pattern parser that provides options for enhancing patterns.

#### Groups
What if we want to allow an alternative verb, such as `shutdown` in favor of `stop`?
We can use parentheses to create a group, combined with pipes (`|`) to declare choices:
```text
(stop|shutdown) the server
```
It is important to understand that parentheses are not required to declare choices, but they are often needed.
For example, if we had just done `stop|shutdown the server`, this would create two choices:
```text
stop
shutdown the server
```
This is why using parentheses to create groups is important, as choices are simply split at each pipe.
When you use parentheses, everything within that group is parsed as its own subpattern.

#### Optional groups
For example, if we want `the` to be optional, we can surround it with square brackets to create an optional group:
```text
(stop|shutdown) [the] server
```
Now, both `stop server` and `stop the server` are valid matches for the pattern.

:::tip
This means that you can also use pipes to create choices within optional groups, such as `[the|a]`.
Parentheses aren't needed because brackets act as groups too, just groups that are optional.
:::

#### Expressions
It is extremely common that we would want our syntax to accept dynamic values (e.g. those produced by other syntax).
For example, what if we want the ability to specify a delay before stopping the server, such as `stop the server in 5 minutes`?

We can specify dynamic inputs using percentage signs (`%`) with the desired type inside:
```text
(stop|shutdown) [the] server in %timespan%
```
In this example, `timespan` is the type of input we want our syntax to accept.
:::tip
All available types are listed on our [syntaxes page](/syntaxes?types=Type).
:::

You can accept multiple types of input by separating them with forward slashes (`/`), such as `%timespan/string%`.
You can also accept multiple inputs by pluralizing the type (typically with an `s`), such as `%timespans%`.

There are a few other special characters you can use to control what inputs are permitted:
- Prefixing with `*` to only accept literals
  - For example, if we only wanted literal timespans in our pattern: `stop the server in 5 minutes`
- Prefixing with `~` to only accept non-literals
  - For example, if we only wanted expressions or variables in our pattern: `stop the server in {_time}`
- Prefixing with `-` to allow nullable inputs
  - For example, if we did not want to require the user to specify a time until shutdown: `(stop|shutdown) [the] server [in %-timespan%]`
    - This would allow `stop the server` to still be a valid option
  - What if we didn't include the `-`? This expression would then be occupied by a `default expression` determined by the current context (typically an event value in an event).
- Suffixing with `@-1` or `@1` to force the time state (`past` or `future`)

#### Regular expressions (Regex)
Patterns can also include regular expressions by surrounding the regex pattern with angle brackets (`<` and `>`).
These are useful if you need to obtain literal input in your patterns.

For example, the [loop value](/syntaxes#ExprLoopValue) expression has a pattern like `loop-<.+>`.
This allows the user to write any characters after `loop-`, such as `loop-index` or `loop-string`.

#### Parse tags
Parse tags allow you to detect what parts of a pattern are used, such as a specific optional group or choice.
You can add them to a pattern using the `tag:pattern` format.
For example, what if we wanted `stop` to behave differently from `shutdown`?
Rather than writing two different patterns and seeing which was matched, we can use a parse tag:
```text
(isStop:stop|shutdown) [the] server [in %-timespan%]
```
In this case, there is now a parse tag for our `stop` choice: `isStop`.

It can be repetitive to write out the parse tag names though, so a shortcut is to simply omit the name, for example:
```text
(:stop|shutdown) [the] server [in %-timespan%]
```
The pattern parser will generate the parse tag based on pattern it attaches to.
In this case, it is attached to the pattern `stop`, so the generated parse tag will be `stop`.
It is the same as writing `(stop:stop|shutdown)`.

Parse tags can also be expanded over a choices within a group, for example:
```text
(:(stop|shutdown)) [the] server [in %-timespan%]
```
Parse tags are then applied to each choice, meaning it is equivalent to writing `(:stop|:shutdown)`.
Note that there is a group surrounding the parse tag.
For this feature to work, the parse tag must be empty, and surrounding putting the parse tag within a group ensures this is the case.

#### Pattern options summarized
The pattern options summarized are:
- Use square brackets (`[the]`) for optional text
- Use parentheses and pipes (`(the|a)`) for choices
- Use expressions (`%timespan%`) for dynamic inputs
  - Prefix with `*` to only accept literals
  - Prefix with `~` to only accept non-literals
  - Prefix with `-` to mark as nullable
  - Suffix with `@-1` or `@1` to force the time state
- Use angle brackets (`<expr>`) for regular expressions
- Use colons (`tag:pattern`) for parse tags

#### Adding patterns to a SyntaxInfo
We can add patterns to a SyntaxInfo builder by using any of the following methods:
- `addPattern(String)`
- `addPatterns(String[])`
- `addPatterns(Collection)`

We can also reset the patterns currently added to the builder by calling the `clearPatterns` method.

For example, to add the pattern discussed above, you would simply call:
```java
var builder = SyntaxInfo.builder(MySyntax.class);
builder.addPattern("(stop|shutdown) [the] server [in %-timespan%]");
```

### Type
Every SyntaxInfo has a class that provides the implementation of the syntax it describes.
It can be obtained by calling the `type` method on a SyntaxInfo.

#### Creating new instances
When Skript matches a SyntaxInfo during the parsing process, it needs to instantiate the class providing the implementation of the syntax.
Skript uses the `instance` method of a SyntaxInfo for this instantiation.

By default, Skript uses reflection to instantiate new instances.
This requires that the class have a nullary (zero argument) constructor.
However, for performance reasons, or if your syntax cannot have a nullary constructor, it is possible to provide a Supplier for Skript to use for creating new instances.
This is done by calling the `supplier` method of a SyntaxInfo builder, for example:
```java
var builder = SyntaxInfo.builder(MySyntax.class);
builder.supplier(MySyntax::new); // equivalent to: () -> new MySyntax()
```

### Priority
The priority of a SyntaxInfo dictates its position for matching during parsing.
That is, a collection of SyntaxInfos will be sorted by their priority, and Skript will attempt to match each SyntaxInfo through order-based traversal.
It can be obtained by calling the `priority` method on a SyntaxInfo.

There are three standard priorities used by Skript, available as constants on SyntaxInfo:
- `SIMPLE` - For SyntaxInfos with patterns that only match simple text. That is, they do not contain any other expressions.
- `COMBINED` For SyntaxInfos with patterns that contain other expressions.
- `PATTERN_MATCHES_EVERYTHING` For SyntaxInfos with patterns that contain adjacent expressions.

`SIMPLE` is the earliest priority, with `COMBINED` coming directly after, followed by `PATTERN_MATCHES_EVERYTHING`.

The default SyntaxInfo builders will automatically assign a priority based on these criteria.
Thus, it is generally unnecessary to specify a priority.
However, if there is a need to override the automatic assignment, a priority can be specified by calling the `priority` method on a SyntaxInfo builder, for example:
```java
var builder = SyntaxInfo.builder(MySyntax.class);
builder.priority(SyntaxInfo.PATTERN_MATCHES_EVERYTHING);
```

### Origin
The origin of a SyntaxInfo provides information about its source, such as the [SkriptAddon](../../skript/addons) that registered it.
It can be obtained by calling the `origin` method on a SyntaxInfo.

The default Skript implementation will automatically assign an origin to a SyntaxInfo when it is registered (if one was not specified during building).
For documentation purposes, it can be helpful to provide more information than just the addon that registered a SyntaxInfo.
For example, if using the [AddonModule](../../skript/addons#addon-modules) system, an origin that also describes the module can be created:
```java
var builder = SyntaxInfo.builder(MySyntax.class);
builder.origin(AddonModule.origin(addonInstance, moduleInstance));
```

## The SyntaxRegistry
The [SyntaxRegistry](https://github.com/SkriptLang/Skript/blob/master/src/main/java/org/skriptlang/skript/registration/SyntaxRegistry.java) is the central store of all registered SyntaxInfos.

It can be accessed by calling the `syntaxRegistry` method on SkriptAddon.
:::note
This is the same as calling:
```java
SkriptAddon addon = ...;
SyntaxRegistry syntaxRegistry = addon.registry(SyntaxRegistry.class);
```
:::

With a SyntaxRegistry, you can obtain all registered SyntaxInfos or all registered SyntaxInfos of a specific type (key, described further below).
It is also possible to register and unregister SyntaxInfos.

### Keys
Keys are used to store SyntaxInfos based on the type of syntax they represent.

Skript provides the following keys (based on the standard types of syntax), available as constants on SyntaxRegistry:
- `STRUCTURE`
- `SECTION`
- `STATEMENT`
- `EFFECT` (child of `STATEMENT`)
- `CONDITION` (child of `STATEMENT`)
- `EXPRESSION`

Keys can be created using the `of` method on Key.
It takes one parameter: a string typically representing the name of the syntax element type represented by the key.
```java
Key<SyntaxInfo<? extends Statement>> STATEMENT = Key.of("statement");
```

#### Child keys
There are two child keys of `STATEMENT`, `EFFECT` and `CONDITION`.
When syntax is registered to the register of a child key, it is also registered to its parent key(s).
Thus, the syntax stored under `STATEMENT` includes the union of the syntaxes stored `EFFECT` and `CONDITION`.
:::note
While it is possible to register syntax only under the `STATEMENT` key, this is atypical and may result in unexpected behavior.
:::

Child keys can be created using the `of` method on ChildKey, for example:
```java
Key<SyntaxInfo<? extends Effect>> EFFECT = ChildKey.of(STATEMENT, "effect");
```

### Registering syntax
A SyntaxInfo can be registered using the `register(Key, SyntaxInfo)` method.
It takes in two parameters:
- The key to register the SyntaxInfo under (see above)
- The SyntaxInfo to register
For example, combining everything we have learned so far, we are ready to register a syntax:
```java
var key = ...; // key to be determined by the type of syntax you are registering (see above)
var builder = SyntaxInfo.builder(MySyntax.class);
// ... add more things to the SyntaxInfo build here
SkriptAddon addon = ...;
addon.syntaxRegistry().register(key, builder.build());
```

#### Unregistering syntax
There exists a similar method for unregistering syntax: `unregister(Key, SyntaxInfo)`.
It takes in the same parameters as the `register` method:
- The key the SyntaxInfo is stored under
- The SyntaxInfo to unregister

If this all still seems confusing, that is understandable.
The rest of these pages will provide information about registering and implementing syntax for each of Skript's built-in syntax types.
They will provide more concrete examples of creating SyntaxInfos, registering them, and actually implementing functionality.
