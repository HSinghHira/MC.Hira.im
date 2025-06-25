---
layout: doc
prev: false
next: false

title: Meteor Client Archives
description: Archive of Meteor Client versions with corresponding Minecraft versions, download links, and source code references.

head:
  - - meta
    - name: description
      content: Archive of Meteor Client versions with corresponding Minecraft versions, download links, and source code references.
  - - meta
    - name: keywords
      content: Meteor Client, Minecraft, archives, versions, downloads
---
# Meteor Client Archives

## Introduction

Meteor Client is a popular Minecraft utility mod. This archive lists older versions, their compatible Minecraft versions, download links, and source code references. Older versions are unsupported, so use them at your own risk. For the best experience, stick with the latest version and use mods like ViaFabricPlus to play on older servers.

## Legit Way

You can find older Meteor Client versions on the [official website](https://meteorclient.com/faq/old-versions). The developers don’t support these versions, so you won’t get help if issues arise.

A better option is to use the latest Meteor Client version with the [ViaFabricPlus](https://modrinth.com/mod/viafabricplus) mod. It lets you switch to older server versions while keeping the mod up to date.

## Download Archive

<MeteorArchivesTable />

## Credits

| Builders                                      | Versions                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [ManInMyVan](https://github.com/ManInMyVan/)  | 0.2.5, 0.2.7, 0.2.9, 0.3.1, 0.3.2, 0.3.3, 0.3.4, 0.3.5, 0.3.7, 0.3.9, 0.4.0, 0.4.1, 0.4.3 |
| [Mininaut](https://github.com/Mininaut/)      | 0.4.7-1373                                                                               |
| [YumYummity](https://github.com/YumYummity/)  | 0.4.5, 0.4.9, 0.5.6, 0.5.1-1571, 0.5.0-1562, 0.5.7-2079                                  |

## Self Building

Building older Meteor Client versions from source is not recommended. The developers don’t support them, and issues with old builds won’t be addressed in the support forum.

If you still want to build from source, you’ll need a **Java 21 JDK** from [Adoptium](https://adoptium.net/temurin/releases/?package=jdk&version=21). Follow these steps:

1. Click the "Source" button for desired version and download the "Source code".
2. Extract the ZIP file and open a terminal in the folder.
3. Run `gradlew build` (or `.\gradlew build` in PowerShell). The built JAR file will appear in the `build/libs` folder.
4. Copy the `meteor-client-x.x.x.jar` file to your Minecraft `mods` folder.