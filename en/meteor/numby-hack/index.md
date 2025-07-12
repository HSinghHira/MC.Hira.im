---
layout: doc

title: Numby Hack Addon for Meteor Client
description: Comprehensive guide to the Numby Hack Meteor Client addon, covering its features, supported versions, and author credibility.

head:
  - - meta
    - name: description
      content: "A deep dive into the Numby Hack addon for the Meteor Client, outlining supported versions, modules, commands, and developer credentials."
  - - meta
    - name: keywords
      content: "Numby Hack, Meteor Client addon, Minecraft modules, Number81, Minecraft hack addon"
---

# Numby Hack Addon for Meteor Client

::: warning
I have taken this all infomation from developer's new & old Github commits and explored the modules manually. So if there is something that is not correct, please do let me know.
:::

## Introduction

Numby Hack is a **Meteor Client** addon that adds extra customization modules and commands to your Minecraft client. It was created “in honor of Number81” and aims to give players a variety of new tweaks and utilities. In short, it’s a collection of quality-of-life and fun modules (and a couple of chat commands) that plug into Meteor. The addon is verified for recent Minecraft/Meteor versions (see below), and it’s written by developer _cqb13_ (Maksim Straus) who actively maintains other Meteor projects.

## Supported Minecraft Versions

Numby Hack tracks Meteor Client updates, so it supports the latest Minecraft versions that Meteor does. In practice, that means it’s up-to-date through Minecraft **1.21.x** as of mid-2025. For example, the GitHub tags show builds like _1.21.7-build-44_ (released Jul 8, 2025) and _1.21.6-build-41_ (Jun 25, 2025), which correspond to Meteor Client 1.21.7 and 1.21.6 (Minecraft 1.21.7/1.21.6). The addon also has recent builds for **1.21.5** (June 2025) and **1.21.4** (Mar/Feb 2025) and so on.

- **Minecraft 1.21.x** – Supported up to Meteor 1.21.7 (latest build Apr–Jul 2025).
- **Minecraft 1.20.x** – Supported through Meteor 1.20.6 (last tag Jun 28, 2024), with earlier builds for 1.20.4 (Dec 2023), etc.
- **Minecraft 1.19.4** – Initial support was added around mid-2023 (e.g. build 15 on Jun 25, 2023).

In other words, Numby Hack keeps pace with Meteor’s updates. New Minecraft versions (via new Meteor versions) have had corresponding Numby releases. Check the GitHub **Tags** page for detailed build dates and version labels if you need specifics.

## Useful Links

- 🔗 [Advanced Previewer](/en/meteor/preview/?cqb13/Numby-hack/tree/master/src/main/java/cqb13/NumbyHack/modules) 🔗 [Simple Previewer](/en/meteor/preview/simple.html?cqb13/Numby-hack/tree/master/src/main/java/cqb13/NumbyHack/modules)
- 🔗 [Official Github Repository](https://github.com/cqb13/Numby-hack)
- ⬇️ [Download Latest Version](/en/download/?cqb13/Numby-hack)
- 🗂️ [Download Other Versions](https://github.com/cqb13/Numby-hack/tags)
- 💬 [Discord Server for Support](https://discord.gg/TtmQs7BzPJ)

## Key Features and Modules

Numby Hack adds dozens of new modules to Meteor’s list, plus a few HUD elements and commands. Below is a rundown of **all** the included modules and what they do. (These come from the addon’s README.)

### General Modules

- **Auto Log Plus:** Auto-disconnects you when a specified condition is met (e.g. low health or certain alerts). It helps you bail out of dangerous situations.
- **Better Place:** Lets you place blocks in*weird* ways (ignoring normal placement rules), useful for quick building or scaffolding tricks.
- **Bayblade:** Spins your player character constantly. It’s mostly for show – your avatar will be spinning and other players will see you spin.
- **Bonemeal Aura:** Automatically applies bone meal to nearby crops and plants around you, acting like an aura of growth.
- **Chat Encryption:** Lets you encrypt chat messages with a key. You type a message and the module encrypts it (so only someone with the same key can read it).
- **Condition Toggle:** Automatically turns other modules on or off based on conditions you set (for example, enabling a speed boost only when a certain potion is active).
- **Confetti:** Changes the color of the “totem pop” particle effect (the glowy particles when a Totem of Undying saves you), effectively tinting the confetti.
- **FloRida:** Makes your player spin (and move) in a circle continuously, for a cool visual effect.
- **Game Settings:** Exposes some game options in the mod’s GUI, allowing you to tweak certain Minecraft settings from the Meteor interface that aren’t normally adjustable (like view distance or animations).
- **Ignore Deaths:** Filters out death messages in chat from specific players. If someone you’ve “ignored” dies, you won’t see the “so-and-so has died” line.
- **Jump Helper:** Gives you a HUD or indicator of how far you can jump from your current position, helping with parkour or leap calculations.
- **Log Out Spots:** Shows you where players (and you) have logged out recently. It marks those spots in world or chat, so you can track where someone left the game.
- **New Chunks:** Detects and highlights “new” chunks (chunks you haven’t seen before) by monitoring liquid flow. It’s a trick to find newly generated terrain for Elytra exploring or scouting.
- **No Strip:** Prevents you from “stripping” logs (turning wood logs into stripped logs with an axe) by accident. If you try to strip a log, it will not turn into a stripped version.
- **Number81:** A novelty chat module: it simply counts from 1 up to 81 in chat messages. (This pays homage to the player Number81, who is mentioned in the addon’s description).
- **Numby Chat:** Adds various chat improvements (like filters, auto-prefixes, or formatting tweaks) to make chatting more pleasant. It’s basically a quality-of-life chat mod bundled with Numby.
- **NumbyRPC:** Sets your Discord Rich Presence to show “Numby Hack” as the active mod. In other words, on Discord it will display that you’re using Numby Hack.
- **Packet Delay:** Allows you to delay outbound packets to the server (introduce artificial lag), which can be used to exploit or throttle packet-based effects.
- **Ride Stats:** When you’re riding a horse, pig, or other mountable entity, this shows stats (like speed or health) on that entity’s nametag. It’s useful to see info about your mount at a glance.
- **Safe Fire:** Prevents you from walking into fire or lava. The mod will automatically stop you or block your movement if fire is about to touch you, keeping you from burning.
- **Safety Net:** If you fall below a certain Y-level (configurable), the addon will automatically place a block under you to catch your fall, acting like a safety net.
- **Spawner ESP:** Highlights monster spawner blocks in the world (for example, pig spawners or zombie spawners) with colored outlines or markers, making them easy to spot.
- **Egap Finder:** Scans for golden apples (named "Egap" in chat slang) dropped or in the world in single-player. When it finds any, it logs the location so you can collect them.
- **Wurst Glide:** Gives you a gliding ability (like the “Glide” module in the Wurst hacked client). You can glide through the air as if wearing Elytra, even if you’re not.

Each of the above modules can be toggled on or off in the Meteor GUI. They are grouped under the “Numby Hack” category in your modules list. (The official README lists all of them similarly.)

### HUD Modules

Numby Hack also adds several HUD (heads-up display) elements:

- **81:** A HUD indicator that shows the Number81 counter (linked to the Number81 module) up top on your screen.
- **Item Counter:** Lets you specify items and then it shows a count of those items in your inventory on the HUD.
- **Key Press HUD:** Displays which key you’ve just pressed (like W, A, S, D, jump, etc.) on the screen for easier visualization of your inputs.
- **Lava Warning:** Warns you on the HUD when there’s lava below you (useful in mineshafts or Netherrack) so you don’t accidentally fall in.
- **Kills:** Shows your current kill count (number of players you’ve killed) on screen.
- **Deaths:** Shows how many times you’ve died.
- **KDR:** Shows your kill/death ratio (kills divided by deaths) on the HUD.
- **High Score:** Displays your highest score (kill streak or similar) achieved so far.
- **Kill Streak:** Shows your current kill streak (how many kills in a row without dying) on screen.
- **Text Radar:** Displays a radar list of nearby player names and some of their stats in your render distance (like their health and armor).
- **Server Brand:** Shows the server modpack or brand name (like Bukkit, Spigot, etc.) on your HUD.

Each HUD element can be enabled or disabled, and usually has its own settings (position, color, etc.) in the HUD modules menu.

### Commands

Numby Hack provides two chat commands:

- **`.clear`** – Clears your chat history. Typing `.clear` will wipe your chat window.
- **`.coord-convert`** – Converts coordinates between dimensions. For example, it will take the XYZ you’re at in the Overworld and give you the corresponding Nether or End coordinates (and vice versa). This is handy for portal linking or dimension math.

(These match the commands listed in the addon README.)

### Other Features

- **Player Particle (Feature):** This isn’t a module you toggle on/off like the rest. It’s a special feature that lets you render particles around specified players. You can configure it to, say, circle a team member or target with particles for fun visual effects.

## Why the Author is Trustworthy

Numby Hack is written by **Maksim “cqb13” Straus** , an active Java developer in the Meteor Client community. A few reasons to trust his work:

- **Proven Experience:** He not only made Numby Hack (and pinned it on his GitHub profile), but also maintains the [Meteor Addons list site](https://meteor-addons.cqb13.dev) and the*meteor-addons* GitHub repo (a curated directory of open-source Meteor Client addons). This shows he’s well embedded in the Meteor ecosystem.
- **Active Development:** The Numby Hack repo has many recent commits and releases (many builds over 2023–2025) and is starred by dozens of users (around 90 stars, 12 forks), indicating community interest and maintenance.
- **Open Source:** All code is on GitHub under GPL-3.0, so it’s transparent. You can review the Java source for any module or command to see exactly what it does (e.g. the src/main/java/cqb13/NumbyHack directory contains all the code).

In summary, Maksim has a history of Meteor mods, keeps Numby Hack updated, and shares it openly. The project’s GitHub page describes it and its purpose (a Meteor addon with extra customization modules), and community interest (stars/forks) suggests it’s reliable.
