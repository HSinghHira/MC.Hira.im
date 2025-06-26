---
layout: doc

title: Lucid Addon for Meteor Client
description: Explore the Lucid addon for Meteor Client - Enhance your Minecraft experience with advanced chat features and ESP modules for version 1.21.4.

head:
  - - meta
    - name: robots
      content: index
  - - meta
    - name: description
      content: Explore the Lucid addon for Meteor Client - Enhance your Minecraft experience with advanced chat features and ESP modules for version 1.21.4.
  - - meta
    - name: keywords
      content: Lucid addon, Meteor Client, Minecraft, mod, addon, chat bot, chat fonts, auto GG, ESP, automation, Fabric, Minecraft 1.21.4, stronghold finder, packet logger, Better Macros, Multi Command, Auto Totem, AFK Log, Anti Item Destroy
---

# Lucid Addon for Meteor Client

## Introduction

Lucid is a lightweight addon for Meteor Client, a well-known Minecraft mod that operates on the Fabric loader. It enhances gameplay by offering a range of chat interaction features and Extra Sensory Perception (ESP) modules. Whether you want to automate chat responses, customize the look of your chat, or use advanced tools like stronghold triangulation, Lucid provides practical solutions for Minecraft players. Its lightweight design ensures it integrates seamlessly with Meteor Client without overwhelming system resources.

## Useful Links

* [Advanced Previewer](/en/meteor/preview/?HUHNcode/Lucid-addon/tree/master/src/main/java/huhncode/lucid/lucidaddon/modules), [Simple Previewer](/en/meteor/preview/simple.html?HUHNcode/Lucid-addon/tree/master/src/main/java/huhncode/lucid/lucidaddon/modules)
* [Github Repository](https://github.com/HUHNcode/Lucid-addon)
* [Latest Download](/en/download/?HUHNcode/Lucid-addon){target="_blank"}
* [All Other Versions](https://github.com/HUHNcode/Lucid-addon/tags)

## Supported Minecraft Versions

Based on the latest releases available on [GitHub](https://github.com/HUHNcode/Lucid-addon/releases), Lucid supports Minecraft version 1.21.4. All documented releases, from v0.1.1 to v0.1.4, are tailored for this version, suggesting that 1.21.4 is the primary supported version as of June 2025. The installation guide on the repository mentions downloading Lucid for "your Minecraft version," which may imply potential support for other versions, but no evidence confirms this. For now, players should assume compatibility with 1.21.4 only.

| Release Version | Minecraft Version |
|-----------------|-------------------|
| Lucid v0.1.4    | 1.21.4            | 
| Lucid v0.1.3    | 1.21.4            | 
| Lucid v0.1.2    | 1.21.4            | 
| Lucid v0.1.1    | 1.21.4            | 

## Key Features and Modules

Lucid provides a diverse set of modules that enhance various aspects of Minecraft gameplay, particularly focusing on chat enhancements and ESP functionalities. Below is a detailed list of all modules, along with their descriptions:

| Module Name          | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| **Chat Bot**         | Automatically detects and responds to chat messages using configurable settings. It employs regular expressions to extract messages and filters them based on keywords. ([ChatBot Docs](https://github.com/HUHNcode/Lucid-addon/blob/master/docs/ChatBot.md)) |
| **Chat Fonts**       | Allows customization of chat message font styles, such as Block, Blackletter, Bold, or Script, for a unique visual experience. ([ChatFonts Docs](https://github.com/HUHNcode/Lucid-addon/blob/master/docs/ChatFonts.md)) |
| **AFK Log**          | Logs you out automatically after a set AFK period, with options to detect inactivity and disable AutoReconnect. |
| **Auto GG**          | Sends a "GG" message after a kill, with customizable random or predefined messages and private messaging options. |
| **Auto Totem**       | Equips a Totem of Undying automatically when one is consumed, with a random delay to bypass anti-cheat systems. |
| **Anti Item Destroy**| Blocks crystal and anchor use briefly after a nearby player dies to prevent item destruction. |
| **Better Macros**    | Opens the chat with predefined text and cursor position via keybind, ideal for quick commands (e.g., `k::/say hello $c world`). |
| **Multi Command**    | Executes multiple commands in sequence, separated by a delimiter (e.g., `/home && /kit daily`). |
| **Stronghold Finder**| Assists in locating strongholds by triangulating positions based on two eye of ender throws, displaying estimated coordinates in chat. |
| **Packet Logger**    | Logs network packets for debugging or analysis, with options to filter incoming (S2C), outgoing (C2S), or both packet types. |

These modules can be configured directly within the Meteor Client interface, offering flexibility to suit individual playstyles. The combination of chat-focused and utility modules makes Lucid versatile for both casual and competitive players.

## Why the Author is Trustworthy

The author, known as HUHNcode on [GitHub](https://github.com/HUHNcode), has shown dedication to the Lucid project through consistent updates, with four releases between March and June 2025. The repository includes detailed documentation for key modules like Chat Bot and Chat Fonts, reflecting a commitment to user clarity and support. Lucid’s integration with Meteor Client, a widely respected Minecraft mod, further bolsters its credibility. Although the repository has only six stars, indicating a small but growing community, the structured development approach and regular updates suggest HUHNcode is a reliable developer. The lack of reported issues or negative feedback on the repository also supports this assessment.