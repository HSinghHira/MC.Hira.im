---
layout: doc

title: Meteor Villager Roller Addon for Meteor Client
description: Learn how to use the meteor-villager-roller mod for Meteor Client to efficiently find desired villager trades in Minecraft.

head:
  - - meta
    - name: robots
      content: index
  - - meta
    - name: description
      content: Learn how to use the meteor-villager-roller mod for Meteor Client to efficiently find desired villager trades in Minecraft.
  - - meta
    - name: keywords
      content: meteor-villager-roller, Minecraft mod, villager trade, Meteor Client, enchantment farming, automated trading
---

# Meteor Villager Roller Addon for Meteor Client

## Introduction

The Meteor Villager Roller is a powerful module for Meteor Client that automates the process of changing a villager's profession until it offers the desired trade. This is particularly useful for finding specific enchantments from librarian villagers.

In Minecraft, trading with villagers is a key mechanic for obtaining valuable items, such as enchanted books from librarians. However, getting the exact trade you want can be time-consuming, as it involves repeatedly changing a villager’s profession by breaking and placing their work block. The meteor-villager-roller mod, designed for Meteor Client, automates this process, saving players significant time and effort. This guide will walk you through everything you need to know to use this mod effectively.

## Useful Links

* [Advanced Demo/Preview](/en/meteor/preview/?maxsupermanhd/meteor-villager-roller/tree/main/src/main/java/maxsuperman/addons/roller/modules), [Simple Previewer](/en/meteor/preview/simple.html?maxsupermanhd/meteor-villager-roller/tree/main/src/main/java/maxsuperman/addons/roller/modules)
* [Github Repository](https://github.com/maxsupermanhd/meteor-villager-roller)
* [Download Latest Version](/en/download/?maxsupermanhd/meteor-villager-roller){target="_blank"}
* [Check Older Versions](https://github.com/maxsupermanhd/meteor-villager-roller/tags)

## Supported Minecraft Versions

The meteor-villager-roller mod has releases available for Minecraft versions ranging from 1.18.1 to 1.21.6, as listed on the [GitHub releases page](https://github.com/maxsupermanhd/meteor-villager-roller/releases). The following table summarizes the supported versions based on available releases:

| Minecraft Version| Meteor Client Version        | Supported | Download                                                                                                                                      |
|-----------|------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| 1.21.6    | 1.21.6           | Yes       | [1.4.14](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.14/villager-roller-1.4.14+mc1.21.6-rev.e009dd3.jar)    |
| 1.21.5    | 1.21.5           | No        | [1.4.13](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.13/villager-roller-1.4.13+mc1.21.5-rev.80d75f3.jar)    |
| 1.21.5    | 1.21.5           | No        | [1.4.12](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.12/villager-roller-1.4.12+mc1.21.5-rev.2c77bc1.jar)    |
| 1.21.4    | 0.6.0-dev >2228  | No        | [1.4.10](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.10/villager-roller-1.4.10+mc1.21.4-rev.0f259ee.jar)    |
| 1.21.3    | 0.5.9-dev >2202  | No        | [1.4.9](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.9/villager-roller-1.4.9+mc1.21.3-rev.0cb2d37.jar)       |
| 1.21.1    | 0.5.8-dev >2147  | No        | [1.4.8](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.8/villager-roller-1.4.8+mc1.21.1-rev.5a91a53.jar)       |
| 1.20.6    | 0.5.7-dev >2072  | No        | [1.4.5](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.7/villager-roller-1.4.5+mc1.20.6-rev.e9d12e8-dirty.jar) |
| 1.20.4    | 0.5.6-dev >1983  | No        | [1.4.4](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.4/villager-roller-1.4.4+mc1.20.4-rev.aec87b6.jar)       |
| 1.20.2    | 0.5.5-dev >1945  | No        | [1.4.3](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.3/villager-roller-1.4.3+mc1.20.2-rev.019b0cc.jar)       |
| 1.20.1    | 0.5.4-dev >1846  | No        | [1.4.2](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.2/villager-roller-1.4.2+mc1.20.1-rev.ac89621.jar)       |
| 1.19.4    | 0.5.3-dev >1817  | No        | [1.4.2](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.4.2/villager-roller-1.4.2+mc1.19.4-rev.ac89621-dirty.jar) |
| 1.19.3    | 0.5.2-dev >1714  | No        | [1.3.6](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3.6/villager-roller-1.3.6+mc1.19.3-rev.0700d38.jar)       |
| 1.19.2    | 0.5.1-dev >1573  | No        | [1.3.4](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3.4/villager-roller-1.3.4+mc1.19.2-rev.f2c071c.jar)       |
| 1.19.1    | 0.5.1-dev >1570  | No        | [1.3.2](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3.2/villager-roller-1.3.2+mc1.19.1-rev.bd5aa5e.jar)       |
| 1.19      | 0.5.0-dev >=1563 | No        | [1.3.1](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3.1/villager-roller-1.3.1+mc1.19-build.34.jar)            |
| 1.19      | 0.5.0-dev <1563  | No        | [1.3](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3/villager-roller-1.3+mc1.19-rev.b16e705.jar)               |
| 1.18.2    | 0.4.9            | No        | [1.3](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.3/villager-roller-1.3+mc1.18.2-rev.3d6f694.jar)             |
| 1.18.1    | ?                | No        | [1.2.1](https://github.com/maxsupermanhd/meteor-villager-roller/releases/download/1.2.1/villager-roller-1.2.1.jar)                            |

While only Minecraft 1.21.6 is marked as actively supported, releases for older versions suggest they are usable, though they may not receive ongoing updates. For older versions, you can use [ViaFabricPlus](https://github.com/ViaVersion/ViaFabricPlus) to ensure compatibility.

## Key Features and Modules

The meteor-villager-roller mod offers several features that make it a valuable tool for Minecraft players. Based on information from the [GitHub repository](https://github.com/maxsupermanhd/meteor-villager-roller), the key features include:

- **Automated Profession Changing:** The mod continuously breaks and places the villager’s work block (e.g., a lectern for librarians) to cycle through professions until the desired trade is found.
- **Targeted for Librarians:** The mod is specifically designed to help players find enchanted book trades from librarian villagers. Support for other professions or trades is not currently planned, though community contributions are welcome.
- **User-Friendly Interface:** The mod provides clear chat messages to guide users through the process, such as instructions for selecting the villager or work block.
- **Configuration Options:** While not explicitly detailed in the documentation, as a Meteor Client module, it likely includes customizable settings within the client’s interface, such as pausing on screens or specifying desired trades.
- **Error Handling Guidance:** The mod includes troubleshooting tips for common issues, such as server desync or lectern placement failures, ensuring a smoother user experience.

These features make the mod an efficient tool for players looking to optimize their villager trading process.

## Why the Author is Trustworthy

The mod’s author, maxsupermanhd, is a credible developer with a robust presence in the open-source community. Their [GitHub profile](https://github.com/maxsupermanhd) showcases 66 repositories, including projects related to Minecraft, Factorio, and Warzone 2100. Notable projects include:

- [WebChunk](https://github.com/maxsupermanhd/WebChunk): A Dynmap alternative for Minecraft servers.
- [FactoCord-3.0](https://github.com/maxsupermanhd/FactoCord-3.0): A Discord bridge bot for Factorio servers.
- [go-mc-ms-auth](https://pkg.go.dev/github.com/maxsupermanhd/go-mc-ms-auth): A Go package for Minecraft authentication.

This diverse portfolio demonstrates maxsupermanhd’s expertise in game development and modding. Additionally, the meteor-villager-roller mod is licensed under GPL-3.0, allowing community scrutiny and contributions, which enhances its reliability. The author’s active engagement, including a [Discord server](https://discord.com/invite/DFsMKWJJPN) for support, further establishes their trustworthiness.

## Usage Guide

To use the meteor-villager-roller mod effectively, follow these detailed steps, adapted from the [GitHub repository’s instructions](https://github.com/maxsupermanhd/meteor-villager-roller):

1. **Acquire a Villager:**
   - Select a villager that is not a nitwit, as nitwits cannot take on professions or offer trades.

2. **Gather Materials:**
   - Collect at least 32 lecterns, which are used as the work block for librarians.
   - Obtain an axe, preferably of high quality (e.g., diamond or netherite), to speed up the process of breaking lecterns.

3. **Set Up the Environment:**
   - Confine yourself and the villager in a small, enclosed space to prevent interference from other entities or blocks.
   - Block the villager from wandering by surrounding it with slabs, blocks, or stairs. Avoid using trapdoors, as they may not work reliably.

4. **Place the Lectern:**
   - Position a lectern within reach of the villager, ensuring it can access it to take on the librarian profession.

5. **Configure and Enable the Module:**
   - Open the Meteor Client interface and navigate to the modules section.
   - Enable the Villager Roller module and adjust any available settings, such as the desired trade or the “Pause on screens” option, which prevents the mod from pausing when you open other screens.

6. **Follow the Mod’s Instructions:**
   - The mod will send chat messages guiding you through the setup process, such as selecting the villager or the lectern.
   - Pay close attention to these messages to ensure proper operation.

7. **Let the Mod Run:**
   - Once configured, the mod will automatically break and place the lectern to cycle through the villager’s professions.
   - You can leave the mod running in the background. If you need to switch focus (e.g., alt-tab), disable the “Pause on screens” option to avoid interruptions.

8. **Handle Common Issues:**
   - **Mod Stops Prematurely:** If the mod displays “We got your villager” twice and stops, this may be due to server desync. Rejoin the server to resolve this.
   - **Lectern Placement Fails:** If the mod cannot place lecterns back, ensure the block space is clear and manually place the lectern to resume.
   - **Chat/Overlay Closures:** The mod may close chat or other screens to interact with the villager’s trading interface. Toggle “Pause on screens” to manage this behavior.
   - **Villager Interaction Issues:** If you cannot interact with the villager, rejoin the server to fix potential desync.

9. **Optimize Lectern Collection:**
   - The mod does not automatically collect broken lecterns. To streamline this, set up a collection system using hoppers, droppers, or flowing water to gather the lecterns efficiently.

10. **Profit:**
    - Once the desired trade is found, you can lock the villager’s profession by keeping the lectern in place and begin trading.

By following these steps, you can efficiently use the meteor-villager-roller mod to obtain the villager trades you need, particularly for enchantment farming.