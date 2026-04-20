---
title: Cooldowns
sidebar:
    order: 45
---

Cooldowns are a way to prevent something from happening too frequently. Whether it's stopping a player from spamming a command, limiting how often an ability can be used, or adding a delay between item uses, cooldowns are something you'll find yourself reaching for often. The concept is simple: when a player does something, they have to wait before they can do it again.

Let's look at the different ways you can set up cooldowns in Skript.

## Command Cooldowns

If you want to add a cooldown to a custom command, you can add a `cooldown:` field directly to your command, just like you would add a `permission:` or `description:`. Here's a basic example:

```applescript
command /kit:
    cooldown: 1 hour
    trigger:
        give diamond sword to player
        give 16 golden apples to player
        send "Enjoy your kit!"
```

The player now has to wait an hour before using `/kit` again. Skript handles all the timing for you.

### Cooldown Messages

By default, Skript will send a generic message when a player tries to use a command that's still on cooldown. You can customize this with `cooldown message:`, and even include how much time is left:

```applescript
command /kit:
    cooldown: 1 hour
    cooldown message: You need to wait %remaining time% before grabbing another kit.
    trigger:
        give diamond sword to player
        give 16 golden apples to player
```

You can also use `elapsed time` if you'd rather tell the player how long it's been since they last used it.

### Bypassing and Canceling

Sometimes staff or VIP players should be exempt from a cooldown. The `cooldown bypass:` field lets you specify a permission that skips the wait:

```applescript
command /kit:
    cooldown: 1 hour
    cooldown message: You need to wait %remaining time% before grabbing another kit.
    cooldown bypass: kit.bypass
    trigger:
        if player has space for diamond sword:
            give diamond sword to player
            give 16 golden apples to player
        else:
            send "Your inventory is full!"
            cancel the cooldown
```

Notice the `cancel the cooldown` at the end. If the player's inventory is full and they didn't actually get anything, it'd be unfair to put them on cooldown, so we cancel it.

### Persistent Cooldowns

By default, command cooldowns reset when the server restarts. If you want cooldowns to survive restarts, use `cooldown storage:` to store the cooldown in a variable:

```applescript
command /daily:
    cooldown: 1 day
    cooldown storage: {cooldown::%player's uuid%::daily}
    cooldown message: You can claim your daily reward again in %remaining time%.
    trigger:
        give 5 diamonds to player
        send "Here are your daily diamonds!"
```

This also lets you access and manipulate the cooldown from other places in your scripts. For instance, an admin command could reset a player's daily cooldown:

```applescript
command /reset-daily <player>:
    permission: admin.reset
    trigger:
        delete {cooldown::%arg-1's uuid%::daily}
        send "Reset %arg-1%'s daily cooldown."
```

## Item Cooldowns

Minecraft has a built-in item cooldown system: the gray overlay you see on ender pearls after throwing one. Skript lets you use this for any item. This is great for things like custom weapons, tools, or abilities tied to specific items:

```applescript
on right click holding blaze rod:
    set item cooldown of blaze rod for player to 5 seconds
    strike lightning at target block
    send "Zap!"
```

The player will see the gray cooldown overlay on all blaze rods in their inventory for 5 seconds. You can also check whether an item is on cooldown:

```applescript
on right click holding blaze rod:
    if player has blaze rod on cooldown:
        send "Your lightning rod is recharging!"
        stop
    set item cooldown of blaze rod for player to 5 seconds
    strike lightning at target block
```

:::note
Item cooldowns apply to the **item type**, not a specific item. If you put a blaze rod on cooldown, _all_ blaze rods in that player's inventory are affected.
:::

## Variable-Based Cooldowns

Command cooldowns only work for commands, and item cooldowns only apply to item types. What about everything else? Events, abilities, custom mechanics? For those, you'll build your own cooldown using variables and timestamps.

The idea is straightforward: save the current time when the player does something, and the next time they try to do it, check if enough time has passed.

```applescript
on right click holding iron sword:
    if difference between now and {cooldown::%player's uuid%::slam} < 10 seconds:
        send "Ability on cooldown!"
        stop
    set {cooldown::%player's uuid%::slam} to now
    # do the ability
    push all entities in radius 5 of player upward at speed 1
    send "Ground slam!"
```

Let's break down what's happening. When the player right-clicks, we check the `difference between now` and the last time they used the ability. If it's been less than 10 seconds, the ability does not get activated. Otherwise, we update the timestamp to `now` and activate the ability.

### Showing Remaining Time

You can show the player how much time they have left by doing a little math:

```applescript
on right click holding iron sword:
    set {_elapsed} to difference between now and {cooldown::%player's uuid%::slam}
    if {_elapsed} < 10 seconds:
        set {_remaining} to 10 seconds - {_elapsed}
        send "Ability on cooldown! %{_remaining}% left."
        stop
    set {cooldown::%player's uuid%::slam} to now
    push all entities in radius 5 of player upward at speed 1
    send "Ground slam!"
```

### Alternative: Storing the End Time

Instead of storing _when_ the player used the ability and calculating how much time has passed, you can store _when_ the cooldown expires and just compare it to `now`:

```applescript
on right click holding iron sword:
    if {cooldown::%player's uuid%::slam} > now:
        set {_remaining} to difference between {cooldown::%player's uuid%::slam} and now
        send "Ability on cooldown! %{_remaining}% left."
        stop
    set {cooldown::%player's uuid%::slam} to 10 seconds from now
    push all entities in radius 5 of player upward at speed 1
    send "Ground slam!"
```

This approach can be a bit cleaner when you want to show remaining time, since you don't need to subtract anything. The check is simply "is the stored time still in the future?".

:::tip
Both approaches work fine. Pick whichever one makes more sense to you and stick with it for consistency.
:::

## Cooldowns with Delays

Sometimes a "cooldown" isn't about preventing repeat usage, it's about making the player wait _before_ something happens. Warmups, cast times, countdowns. These use `wait` and are a different pattern entirely:

```applescript
command /spawn:
    trigger:
        send "Teleporting in 5 seconds... don't move!"
        set {_loc} to player's location
        wait 5 seconds
        if distance between player and {_loc} > 1:
            send "Teleport cancelled, you moved!"
            stop
        teleport player to spawn of player's world
        send "Welcome to spawn!"
```

This isn't really a cooldown in the traditional sense, but it comes up often alongside cooldown discussions. The key difference: a cooldown prevents doing something _again_ too soon, while a delay makes you wait _before_ it happens the first time.

:::caution
Be careful with `wait` in commands. After the wait, the player might have logged off, changed worlds, or died. Always re-check your assumptions after a delay.
:::

## A Note on Variables

If you're using variable-based cooldowns (the `{cooldown::...}` pattern), keep in mind that these are global variables. They get saved to disk and persist through restarts, which is great for long cooldowns like daily rewards but unnecessary for short ones like a 5-second ability cooldown.

For short cooldowns that don't need to survive restarts, consider using a storage solution that keeps data in memory only, so you're not writing to disk every few seconds for cooldowns that will expire before anyone notices.

## Summary

| Method | Best For | Persists Through Restart? |
|---|---|---|
| Command cooldowns | Commands | Only with `cooldown storage:` |
| Item cooldowns | Vanilla-style item use limits | No |
| Variable-based (timestamp) | Events, abilities, custom mechanics | Yes (global variables) |
| Delays (`wait`) | Warmups, cast times | N/A |

Each method has its place. Command cooldowns are the easiest when you're working with commands. Item cooldowns give you that nice visual overlay. Variable-based cooldowns are the most flexible and work anywhere. And delays are for when you need the player to wait before something happens, not after.
