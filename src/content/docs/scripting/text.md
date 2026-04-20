---
title: Text
sidebar:
    order: 10
---

Skript allows you to write pieces of text (aka strings). This is done by putting the text inside double quotes, for example: `"this is text"`.

If an effect, expression, condition, trigger or function accepts something of type text or string, you can use this format to create a new string.

## Colors and Formatting

Skript uses [Adventure](https://docs.advntr.dev/) and [MiniMessage](https://docs.papermc.io/adventure/minimessage/format) for text formatting. MiniMessage is a tag-based system that uses angle brackets, and it is the recommended way to format text in Skript:

```applescript
send "<red>Hello there <bold>%player%!" to player
```

Tags generally come in opening and closing pairs, though closing tags are usually optional for color and decoration tags:

```applescript
send "<red>This is red <bold>and bold</bold> but this is just red again" to player
```

### Color Tags

Minecraft has 16 legacy colors that can have named tag equivalents:

| Tag | Legacy Code | Alternative Names |
|-----|-------------|-------------------|
| `<black>` | §0 | |
| `<dark blue>` | §1 |  |
| `<dark green>` | §2 |  |
| `<cyan>` | §3 | `<dark aqua>`, `<dark cyan>`, `<dark turquoise>` |
| `<dark red>` | §4 | |
| `<purple>` | §5 | `<dark purple>` |
| `<gold>` | §6 | `<orange>`, `<dark yellow>` |
| `<gray>` | §7 | `<grey>`, `<light_gray>`, `<silver>` |
| `<dark gray>` | §8 | `<dark grey>` |
| `<blue>` | §9 | `<light blue>`, `<indigo>` |
| `<green>` | §a | `<light green>`, `<lime>` |
| `<aqua>` | §b | `<light aqua>`, `<turquoise>` |
| `<red>` | §c | `<light red>` |
| `<magenta>` | §d | `<light purple>`, `<pink>` |
| `<yellow>` | §e | `<light yellow>` |
| `<white>` | §f | |

Each colour can also be written with `_` instead of spaces: `<dark_blue>`.

For a full spectrum of colors, you can use 6-digit hexadecimal color tags:

```applescript
send "<#ABCDEF>Hey %player%!" to player
send "<#ff6b6b>Warning!" to player
```

You can also format colours in the verbose MiniMessage format: `<color:yellow>`, but using `_` instead of spaces is mandatory.

:::note
Legacy `§` and `&` color codes are still supported for backwards compatibility. However, [MiniMessage tags](https://docs.papermc.io/adventure/minimessage/format/#color) are the recommended approach going forward.
:::

### Decoration Tags

Text decorations work the same way as color tags:

| Tag | Legacy Code | Description |
|-----|-------------|-------------|
| `<bold>` | §l | Makes the provided text bold. |
| `<italic>` | §o | Makes the provided text italic. |
| `<underlined>` | §n | Makes the provided text underlined. |
| `<strikethrough>` | §m | Makes the provided text appear with a line through the middle. |
| `<obfuscated>` | §k | Makes the provided text unreadable (rapidly cycling characters). |
| `<reset>` | §r | Resets all active formatting. |

Using `<!tag>` can be used to prevent that formatting instead:
```applescript
# Item names are naturally italicized by Minecraft:
set name of player's tool to "<!i>Not Italicized!"
``` 

### Advanced Formatting Tags

MiniMessage supports more advanced formatting options that have no legacy equivalents.

```applescript
# Gradient between two or more colors
send "<gradient:#ff0000:#0000ff>Red to blue!</gradient>" to player

# Rainbow cycling colors
send "<rainbow>Wow this text is super colorful!</rainbow>" to player

# Color transitions
send "<transition:#ff0000:#ffffff:#0000ff:0.5>Transition!</transition>" to player
```

You can read more about all available MiniMessage tags on [Paper's documentation](https://docs.papermc.io/adventure/minimessage/format).

### Safe Tags

Not all MiniMessage tags are processed automatically. To prevent unintended formatting (for example, from player input being included in a message), Skript only parses a set of **safe tags** by default. Tags outside this list are left as plain text unless you use the `formatted` expression (see below).

The default safe tags are:

| Tag(s) | Description |
|--------|-------------|
| `color` | Named colors and hex colors (`<red>`, `<#AABBCC>`, etc.) |
| `decorations` | `<bold>`, `<italic>`, `<underlined>`, `<strikethrough>`, `<obfuscated>` |
| `gradient` | `<gradient:...>` |
| `rainbow` | `<rainbow>` |
| `reset` | `<reset>` |
| `transition` | `<transition:...>` |
| `pride` | Pride-themed rainbow colors |
| `shadowColor` | `<shadowColor:...>` — sets the shadow color of text |

### The `formatted` Expression

When you need to process tags that are outside the safe tags list, use the `formatted` expression. This processes the full MiniMessage tag set on the given string:

```applescript
# sprite tags are not safe by default, so we use formatted to process them
send formatted "Look at my <sprite:blocks:block/stone>!" to player
```

`formatted` also handles legacy `&` color codes, which are not processed automatically:

```applescript
send formatted "This is &4dark red &rand reset" to player
```

:::caution
Only use `formatted` on strings you control. Using `formatted` on player-provided input could allow players to inject arbitrary formatting tags into messages.
:::

### Configuring Safe Tags

You can control which tags are parsed automatically by editing the `safe tags` option in `config.sk`:

```yaml
safe tags: color, decorations, gradient, rainbow, reset, transition, pride, shadowColor
```

To allow additional tags to be parsed automatically, add them to the list. For example, to also allow `sprite` tags:

```yaml
safe tags: color, decorations, gradient, rainbow, reset, transition, pride, shadowColor, sprite
```

To restrict automatic parsing to only colors and decorations, simply remove unwanted entries:

```yaml
safe tags: color, decorations
```

## Chat-only Formatting

Skript also supports some custom names for certain features that are only available in chat messages. These use the same tag format:

```applescript
<name:parameter>
```

| Tag | Alternative Names | MiniMessage Equivalent | Description |
|-----|-------------------|------------------------|-------------|
| `<link:url>` | `<open_url:url>`, `<url:url>` | `<click:open_url:url>` | Opens a URL when the player clicks on the text. Must be an http or https URL. |
| `<run_command:cmd>` | `<command:cmd>`, `<cmd:cmd>` | `<click:run_command:cmd>` | Makes the player execute a command when they click on the text. |
| `<suggest_command:cmd>` | `<sgt:cmd>` | `<click:suggest_command:cmd>` | Adds a command to the player's chat input when clicked. |
| `<tooltip:text>` | `<show_text:text>`, `<ttp:text>` | `<hover:show_text:'text'>` | Shows a tooltip when the player hovers over the text. |
| `<font:key>` | `<f:key>` | `<font:key>` | Changes the font of the text. |
| `<insertion:text>` | `<insert:text>`, `<ins:text>` | `<insert:text>` | Appends text to the player's chat input when SHIFT-clicked. |

These tags are not in the safe tags list, so they must be used with the `formatted` expression:

```applescript
send formatted "<click:run_command:/gamemode creative><green>Click to enter creative mode!</click>" to player
send formatted "<tooltip:'<yellow>This is a tooltip'>Hover over me!</hover>" to player
send formatted "<link:https://skriptlang.org>Visit the Skript website</click>" to player
```

Minimessage also supports more click and hover events, like opening dialogs, showing item tooltips, and more. These can all be viewed at [MiniMessage's docs](https://docs.papermc.io/adventure/minimessage/format/#click).

## Unicode

Skript supports Unicode characters in any text. To add them to your scripts, 
paste the character inside the text, or use the provided Unicode tag. The unicode tag is not safe by default, so you will need to use `formatted`. Pasted characters do not need `formatted`.

The tag uses the character's codepoint to replace it with the actual 
character when the text is loaded.
```applescript
"🐛 hello <u:1F41B>" # 🐛 hello 🐛
"<unicode:03B5> <unicode:2245> <unicode:0194>, right?" # ε ≅ Ɣ, right?
```
