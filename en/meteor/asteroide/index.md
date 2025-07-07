---
layout: doc

title: Asteroide Addon for Meteor Client
description: Asteroide is a powerful Meteor Client addon for Minecraft 1.20 and above.

head:
  - - meta
    - name: description
      content: Asteroide is a powerful Meteor Client addon for Minecraft 1.20 and above.
  - - meta
    - name: keywords
      content: Minecraft, Asteroide, addon, mod, Meteor Client, features, versions, Asteroide Meteor Client
---

# Asteroide Addon for Meteor Client

::: warning
I have taken this all infomation from developer's new & old Github commits and explored the modules manually. So if there is something that is not correct, please do let me know.
:::

## Introduction

Asteroide is a powerful Meteor Client addon for Minecraft 1.20 and above It bundles a variety of utility modules and commands that make gameplay and chatting on servers easier, with a special focus on chat enhancements. The addon is described as a "utility addon" aimed at enriching the Meteor Client experience, especially the in-game chat. In practice, Asteroide provides tools ranging from automated chat-game play to advanced movement and inventory features, all designed to add convenience that players “long needed.

## Supported Minecraft Versions

- Minecraft 1.20.x: Asteroide’s initial releases (starting with v0.1.2) are built for Minecraft 1.20 and related versions. The README explicitly targets 1.20+, so any 1.20.x version is supported from the first release onward.
- Minecraft 1.21.x: Later updates added support for newer Minecraft releases. Notably, Asteroide v0.1.7 (Feb 2025) is explicitly a “1.21.4 port,” meaning it supports Minecraft 1.21.4 v0.1.8 (Jul 2025) continues this, listing support for 1.21.4 as well.

::: tip
For players using older Minecraft versions, the mod can be used with [ViaFabricPlus](https://modrinth.com/mod/viafabricplus), which enables compatibility with earlier versions.
:::

## Useful Links

- 🔗 [Advanced Previewer](/en/meteor/preview/?asteroide-development/Asteroide/tree/master/src/main/java/spigey/asteroide/modules) 🔗 [Simple Previewer](/en/meteor/preview/simple.html?asteroide-development/Asteroide/tree/master/src/main/java/spigey/asteroide/modules)
- 🔗 [Github Repository](https://github.com/asteroide-development/Asteroide/)
- ⬇️ [Download Latest Version](/en/download/?asteroide-development/Asteroide/){target="\_blank"}
- 🗂️ [Download Other Versions](https://github.com/asteroide-development/Asteroide/tags)

## Key Features and Modules

Asteroide includes many custom modules and commands that extend Meteor Client’s functionality. Below is an overview of each module and command (with references to release notes where available):

### Modules

| Module Name              | Introduction | Description                                                                                 |
| ------------------------ | ------------ | ------------------------------------------------------------------------------------------- |
| Chatbot                  | v0.1.4       | Likely an automated chat-responder or chat enhancement feature. Interacts with server chat. |
| AutoMacro                | v0.1.4       | Allows recording or automating keypress macros in-game for customizable automation.         |
| AntiAnnouncement         | v0.1.3       | Suppresses or auto-handles server announcement messages to keep chat cleaner.               |
| AutoBack                 | v0.1.3       | Teleports the player back to their spawn or last location after events like death.          |
| AutoChatGame             | v0.1.3       | Automates participation in server chat mini-games, e.g., auto-answering puzzles.            |
| AutoXd                   | v0.1.3       | Undocumented; unclear purpose, removed in v0.1.4, likely experimental.                      |
| DeathNotifier            | v0.1.3       | Sends notifications when a player (user or others) dies.                                    |
| ServerCrash              | v0.1.3       | Disruptive tool, likely attempts to crash the server (use with caution).                    |
| AutoHotbar               | v0.1.5       | Automatically swaps hotbar slots to cycle through tools or items.                           |
| MultiCommandCommandBlock | v0.1.5       | Provides a command block that can hold and run multiple commands at once.                   |
| PlatformFly (AirWalk)    | v0.1.5       | Prevents fall damage and gravity, enabling flight (renamed to AirWalk).                     |
| BetterBungeeSpoof        | v0.1.5       | Spoofs backend connection details to join BungeeCord proxy servers.                         |
| BetterCollisions         | v0.1.5       | Enhanced collision handling for Meteor Client, in development.                              |
| CreativeFlight           | v0.1.5       | Allows creative mode flight in survival settings.                                           |
| AutoFuck                 | v0.1.5       | Automatically attacks or sends taunting messages to players (harassment tool).              |
| ChestStealer             | v0.1.6       | Automatically takes all items from opened chests or inventories.                            |
| MinehutAutoJoin          | v0.1.6       | Auto-joins a random Minehut server from a Minehut lobby.                                    |
| BorderNoclip             | v0.1.6       | Removes world border collision, allowing players to walk through borders.                   |
| AutoLogin                | v0.1.6       | Automatically sends login credentials on cracked servers.                                   |
| InvCleaner               | v0.1.6       | Auto-drops or clears useless items from the player’s inventory.                             |
| VersionSpoof             | v0.1.6       | Spoofs the Minecraft version reported to servers.                                           |
| Tracker                  | v0.1.6       | Rotates player’s view to keep a target player in sight.                                     |
| Aimbot                   | v0.1.6       | Automates aiming at players or entities for PvP.                                            |
| ChatEncryption           | v0.1.6       | Encrypts outgoing chat messages for Asteroide users only.                                   |
| Distribute               | v0.1.6       | Splits and gives duplicated items to other players (likely for exploits).                   |
| Troll                    | v0.1.6       | Automatically sends random messages to other players for trolling.                          |
| FastStaircase            | v0.1.6       | Speeds up walking up stairs for faster ascension.                                           |

### Commands

| Commands    | Introduction | Description                                                                            |
| ----------- | ------------ | -------------------------------------------------------------------------------------- |
| .bypass     | -            | Bypasses most server chat filters, allowing the player to send blocked words.          |
| .math       | -            | Solves a math equation provided by the player.                                         |
| .c          | -            | Similar to .math, but automatically sends the solution into chat.                      |
| .whereis    | -            | Rotates the player to look directly at a specified target player to locate them.       |
| .track      | -            | Starts tracking a specified player using the Tracker module, following their movement. |
| .me         | v0.1.5       | Displays basic info about the player, intended as a developer utility.                 |
| .cmdblock   | v0.1.5       | Gives the player a command block containing a specified command.                       |
| phase       | v0.1.5       | Performs a horizontal V-clip, allowing sideways teleport through blocks.               |
| .fuckserver | v0.1.3       | Unspecified command, possibly disruptive, may attempt to crash or stress the server.   |
| .getitem    | v0.1.3       | Likely gives the player a specified item (no documentation provided).                  |
| .perm       | v0.1.3       | Likely related to managing or querying permissions.                                    |
| .scrash     | v0.1.3       | Presumably attempts to crash the server (use with caution).                            |

## Why the Author is Trustworthy

Asteroide is an open-source project with visible, frequent updates, which boosts confidence in its reliability. The GitHub repo shows 378 commits on the master branch as of mid-2025 , indicating active development. It is licensed under Apache-2.0 , meaning its source code is publicly available for review. The author (“Spigey”) explicitly states the goal of enhancing the chat experience, and many of the modules (like ChatEncryption and Troll) reflect this focus. In short, the addon's transparent development history and clear purpose – coupled with its open license – suggest the author is
committed and trustworthy in maintaining Asteroide.
