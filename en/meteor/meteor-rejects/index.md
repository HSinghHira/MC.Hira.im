---
layout: doc

title: Meteor Rejects Client Addon
description: An addon for Meteor Client that adds rejected and ported features

head:
  - - meta
    - name: description
      content: An addon for Meteor Client that adds rejected and ported features
  - - meta
    - name: keywords
      content: Meteor Rejects, Meteor Rejects Meteor Client Addon, meteor client, meteor client addon, minecraft mods
---
::: warning
I have taken this all infomation from developer's new & old Github commits and explored the modules manually. So if there is something that is not correct, please do let me know.
:::

## Introduction

Meteor Rejects is an addon designed to enhance the Meteor Client, a widely-used utility mod for Minecraft built on the Fabric mod loader. This addon introduces features that were either rejected from the main Meteor Client or ported from other Minecraft clients, offering players additional tools to customize and improve their gameplay experience. Whether you’re looking for advanced combat options, new commands, or enhanced user interface elements, Meteor Rejects provides a range of functionalities to meet diverse needs.

## Supported Minecraft Versions


| Minecraft Version | Release Date |
| ------------------- | -------------- |
| 1.19.2            | Nov 20, 2022 |
| 1.19.3            | Mar 18, 2023 |
| 1.19.4            | Jun 17, 2023 |
| 1.20              | Jul 11, 2023 |
| 1.20.1            | Aug 25, 2023 |
| 1.20.2            | Jan 3, 2024  |
| 1.20.4            | Apr 9, 2024  |
| 1.20.6            | Jul 1, 2024  |
| 1.21              | Jan 27, 2025 |
| 1.21.4            | Jan 25, 2025 |

## Key Features and Modules

Meteor Rejects significantly expands the capabilities of the Meteor Client by introducing new modules, commands, HUD elements, and configuration options. Below is a detailed breakdown of its key features, organized by category for clarity.

#### List of Modules

Meteor Rejects introduces a variety of new modules, each designed to enhance gameplay in different ways, such as combat, utility, and automation.


| **Module Name** | **Description**                                                        |
| ----------------- | ------------------------------------------------------------------------ |
| AimAssist       | Removed from Meteor, likely aids in aiming for combat.                 |
| AntiBot         | Removed from Meteor, possibly filters bot entities.                    |
| AntiCrash       | Ported from Anti-ClientCrasher, likely prevents client crashes.        |
| AntiSpawnpoint  | No specific description, possibly related to spawn manipulation.       |
| AntiVanish      | No specific description, possibly detects vanished players.            |
| ArrowDmg        | Ported from Wurst, likely shows arrow damage.                          |
| AutoBedTrap     | Ported from BleachHack-CupEdition, places obsidian around beds.        |
| AutoCraft       | Generalized version of AutoBedCraft from Orion, automates crafting.    |
| AutoEnchant     | No specific description, likely automates enchanting.                  |
| AutoExtinguish  | No specific description, possibly auto-extinguishes fire.              |
| AutoFarm        | No specific description, likely automates farming tasks.               |
| AutoGrind       | No specific description, possibly automates grinding resources.        |
| AutoLogin       | No specific description, likely automates login processes.             |
| AutoPot         | Taken from an unmerged PR, likely automates potion use.                |
| AutoSoup        | Ported from Wurst, likely automates soup consumption.                  |
| AutoTNT         | No specific description, possibly automates TNT placement.             |
| AutoWither      | Taken from an unmerged PR, likely automates wither skeleton farming.   |
| BlockIn         | No specific description, possibly blocks certain actions.              |
| BoatGlitch      | Taken from an unmerged PR, likely exploits boat mechanics.             |
| BoatPhase       | Taken from an unmerged PR, likely phases through blocks using boats.   |
| Boost           | Ported from Cornos, likely enhances movement speed.                    |
| BungeeCordSpoof | Ported from LiquidBounce, likely spoofs BungeeCord for server hopping. |
| ChatBot         | No specific description, possibly automates chat responses.            |
| ChestAura       | No specific description, likely automates chest interactions.          |
| ChorusExploit   | Taken from an unmerged PR, likely exploits chorus fruit mechanics.     |

### Enhanced Modules

Meteor Rejects enhances several existing Meteor Client modules with additional settings and functionalities:

* **NoRender** : Adds options such as`noCommandSuggestions` to disable command autocomplete suggestions and`disableToasts` to suppress notification pop-ups, improving performance and reducing visual clutter.
* **Flight** : Includes a`stopMomentum` feature, allowing players to halt their movement instantly while flying, providing better control during navigation.
* **KillAura** : Offers advanced combat settings, including Fov and invisible entity filters, random teleport to confuse opponents, hit chance adjustments, and random delay for more unpredictable attacks. Note that some features, like random delay, may have been removed in later updates.
* **Alts** : Supports Yggdrasil login, enabling seamless management of alternative Minecraft accounts through the Mojang authentication system.

### New Commands

Meteor Rejects introduces a variety of new commands that provide players with additional control over their gameplay. These commands can be executed via the in-game chat or command interface (default key to open the GUI is Right Shift, configurable in Minecraft’s controls menu). The commands include:

* **`.center`** : Aligns the player to the center of the current block, useful for precise positioning.
* **`.ghost`** : Likely related to anti-ghosting functionality, possibly clearing ghost blocks, ported from another mod.
* **`.save-skin`** : Saves the player’s current skin for later use or reference.
* **`.heads`** : Manages player heads, potentially for decorative or server purposes.
* **`.seed`** : Retrieves the world seed, allowing players to share or analyze the world generation.
* **`.setblock`** : Places a specified block at a given coordinate, useful for quick building or testing.
* **`.set-velocity`** : Adjusts the player’s velocity, enabling custom movement speeds or jumps.
* **`.teleport`** : Teleports the player to specified coordinates, simplifying navigation.
* **`.terrain-export`** : Exports terrain data, possibly for map-making or analysis, adapted from another client.
* **`.kick`** : Allows kicking a player from a server, likely intended for server administrators, ported from another mod.

Some commands, such as `.clear-chat` and `.panic`, were removed in later updates, so their availability depends on the version used.

### HUD Module

* **Radar HUD** : Adds a radar display to the heads-up display, showing nearby entities or players, which enhances situational awareness in multiplayer environments.

### Configuration Options

Meteor Rejects provides additional settings to customize the addon’s behavior:

* **Http Allowed** : Enables or disables HTTP requests, controlling network interactions.
* **Http User Agent** : Allows setting a custom user agent for HTTP requests, useful for specific server interactions.
* **Hidden Modules** : Permits hiding specific modules from the Meteor Client GUI, reducing clutter. A game restart is required to unhide modules.
* **Load System Fonts** : Offers an option to disable system font loading for faster game startup. Custom fonts can be placed in the`meteor-client/fonts` folder, requiring a restart to apply.
* **Duplicate Module Names** : Allows modules to share the same name, providing flexibility in module management.

These features make Meteor Rejects a versatile addon, catering to players who want more control, customization, and utility in their Minecraft experience.

## Usefull Links

* [Github Repository](https://github.com/AntiCope/meteor-rejects)
* [Latest Download](/en/download/?AntiCope/meteor-rejects){target="_blank"}
* [All Versions](https://github.com/AntiCope/meteor-rejects/tags)
* [Discord](https://discord.gg/9mrRPGKYU3)

## Why the Author Is Trustworthy?

The author of Meteor Rejects, known as AntiCope, is a recognized figure in the Minecraft modding community. Their credibility is supported by several factors:

* **Open-Source Contributions** : AntiCope maintains multiple open-source projects on GitHub, including Meteor Rejects, which has garnered significant community engagement with hundreds of stars and forks. The transparency of the source code allows users to review it for safety and functionality.
* **Active Maintenance** : AntiCope regularly updates Meteor Rejects, addressing bugs and incorporating community feedback, as evidenced by the frequent releases and commit history on GitHub.
* **Reputation** : While some community members have raised questions about the safety of AntiCope’s addons (e.g., a Reddit post on [r/minecraftclients](https://www.reddit.com/r/minecraftclients/comments/19e853u/are_anticope_addons_for_meteor_client_safe/)), the open-source nature and community support suggest a level of trustworthiness. However, as with any mod, users should exercise caution, verify downloads from official sources, and review the code if possible.

AntiCope’s commitment to open-source development and active engagement with the Minecraft community makes them a reliable developer, though standard precautions for mod safety should always be followed.
