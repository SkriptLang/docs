---
title: Text
---

Skript allows you to write pieces of text (aka strings). This is done by putting the text inside double quotes, for example: `"this is text"`.

If an effect, expression, condition, trigger or function accepts something of type text or string, you can use this format to create a new string.

## Colors

Minecraft has 16 pre-set color codes to be used in text. 

* Color name tags, for example `red`
* Minecraft color codes, like `§c` (or `&c`)

Here's a table of all colors, including both Skript names and color codes.

<table>
    <thead>
        <tr>
            <th>Color</th>
            <th>Code</th>
            <th>Name</th>
            <th>Alternative Names</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="bg-[#000000]"></td>
            <td>§0</td>
            <td>black</td>
            <td></td>
        </tr>
        <tr>
            <td class="bg-[#0000AA]"></td>
            <td>§1</td>
            <td>blue</td>
            <td>dark blue</td>
        </tr>
        <tr>
            <td class="bg-[#00AA00]"></td>
            <td>§2</td>
            <td>green</td>
            <td>dark green</td>
        </tr>
        <tr>
            <td class="bg-[#00AAAA]"></td>
            <td>§3</td>
            <td>cyan</td>
            <td>aqua, dark cyan, dark aqua, dark turquoise, dark turquois</td>
        </tr>
        <tr>
            <td class="bg-[#AA0000]"></td>
            <td>§4</td>
            <td>red</td>
            <td>dark red</td>
        </tr>
        <tr>
            <td class="bg-[#AA00AA]"></td>
            <td>§5</td>
            <td>purple</td>
            <td>dark purple</td>
        </tr>
        <tr>
            <td class="bg-[#FFAA00]"></td>
            <td>§6</td>
            <td>orange</td>
            <td>orange, gold, dark yellow</td>
        </tr>
        <tr>
            <td class="bg-[#AAAAAA]"></td>
            <td>§7</td>
            <td>grey</td>
            <td>light grey, gray, light gray, silver</td>
        </tr>
        <tr>
            <td class="bg-[#555555]"></td>
            <td>§8</td>
            <td>dark gray</td>
            <td>dark grey</td>
        </tr>
        <tr>
            <td class="bg-[#5555FF]"></td>
            <td>§9</td>
            <td>light blue</td>
            <td>light blue, indigo</td>
        </tr>
        <tr>
            <td class="bg-[#55FF55]"></td>
            <td>§a</td>
            <td>light green</td>
            <td>lime, lime green</td>
        </tr>
        <tr>
            <td class="bg-[#55FFFF]"></td>
            <td>§b</td>
            <td>light cyan</td>
            <td>light aqua, turquoise, turquois, light blue</td>
        </tr>
        <tr>
            <td class="bg-[#FF5555]"></td>
            <td>§c</td>
            <td>light red</td>
            <td>pink</td>
        </tr>
        <tr>
            <td class="bg-[#FF55FF]"></td>
            <td>§d</td>
            <td>magenta</td>
            <td>light purple</td>
        </tr>
        <tr>
            <td class="bg-[#FFFF55]"></td>
            <td>§e</td>
            <td>yellow</td>
            <td>light yellow</td>
        </tr>
        <tr>
            <td class="bg-[#FFFFFF]"></td>
            <td>§f</td>
            <td>white</td>
            <td></td>
        </tr>
    </tbody>
</table>

In Minecraft 1.16, support was added for 6-digit hexadecimal colors.
A tag can be used to format with these colors, which looks like this: 

```
<#ABCDEF>
<#ffb2c3>
```

Here's what the tag would look like when used in a script:

```applescript
send "<#123456>Hey %player%!" to player
```

For information not related to Skript, see Minecraft Wiki page concerning colors. 


Depending on the Skript configuration, 
color codes may do more than just change color of text after them. 
By default, for backwards compatibility, they clear following styles: 
magic, bold, strikethrough, underlined, italic. 
Other styles are not affected, and this feature can be toggled of in config.sk.

## Formatting

Minecraft also has various other styles available. 
The following are available everywhere, including item and entity names:

<table>
    <thead>
        <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Alternative Names</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>§k</td>
            <td>magic</td>
            <td>obfuscated</td>
            <td>Makes the provided text unreadable.</td>
        </tr>
        <tr>
            <td>§l</td>
            <td>bold</td>
            <td>b</td>
            <td>Makes the provided text bold.</td>
        </tr>
        <tr>
            <td>§m</td>
            <td>strikethrough</td>
            <td>strike, s</td>
            <td>Makes the provided text appear 
            with a line through the middle.</td>
        </tr>
        <tr>
            <td>§n</td>
            <td>underlined</td>
            <td>underline, u</td>
            <td>Makes the provided text underlined.</td>
        </tr>
        <tr>
            <td>§o</td>
            <td>italic</td>
            <td>italics, i</td>
            <td>Makes the provided text italic.</td>
        </tr>
        <tr>
            <td>§r</td>
            <td>reset</td>
            <td>r</td>
            <td>Resets all active formatting options. 
            Usually used to indicate the end of a format.</td>
        </tr>
    </tbody>
</table>

### Chat-only formatting
Skript also supports certain newer features, which are only available in chat. Those do not have formatting codes, so you must use tags for them.
                        
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Alternative Names</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>link</td>
            <td>open url, url</td>
            <td>Opens a link when player clicks on text</td>
        </tr>
        <tr>
            <td>run command</td>
            <td>command, cmd</td>
            <td>Makes player execute a chat command when they click on text</td>
        </tr>
        <tr>
            <td>suggest command</td>
            <td>sgt</td>
            <td>Adds a command to chat prompt of player when clicked</td>
        </tr>
        <tr>
            <td>tooltip</td>
            <td>show text, ttp</td>
            <td>Shows a tooltip when player hovers over text with their mouse</td>
        </tr>
        <tr>
            <td>font</td>
            <td>f</td>
            <td>Change the font of the text (1.16+)</td>
        </tr>
        <tr>
            <td>insertion</td>
            <td>insert, ins</td>
            <td>Will append a text at player's current cursor in chat input only while holding SHIFT.</td>
        </tr>
    </tbody>
</table>

These chat-only formats use the following tag format:  

```applescript
<name:parameter>
```

For example:

```applescript
<link:https://skriptlang.org>
<run command:/gamemode creative>
```

For a link, parameter must be either http or https url 
if you want clients to recognize it. 
For others, it can be any text, including invalid commands.

## Unicode

Skript supports Unicode characters in any text. To add them to your scripts, 
paste the character inside the text, or use the provided Unicode tag. 

The tag uses the character's codepoint to replace it with the actual 
character when the text is loaded.
```applescript
"🐛 hello <u:1F41B>" # 🐛 hello 🐛
"<unicode:03B5> <unicode:2245> <unicode:0194>, right?" # ε ≅ Ɣ, right?
```