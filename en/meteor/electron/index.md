---
layout: doc

title: Electron Addon for Meteor Client
description: A lightweight and performant Minecraft mod for enhanced gameplay.

head:
  - - meta
    - name: robots
      content: index
  - - meta
    - name: description
      content: A lightweight and performant Minecraft mod for enhanced gameplay.
  - - meta
    - name: keywords
      content: electron, Electron Meteor Client Addon, meteor client, meteor client addon, minecraft mods
---
# Electron Addon for Meteor Client
::: warning
I have taken this all infomation from new & old Github commits and explored the modules manually. So if there is something that is not correct, please do let me know.
:::

## Introduction

**Electron** is a Meteor Client addon focused on performance.  It implements *experimental performance improvements* for Meteor Client, aiming to speed up game launch and streamline the tick/render loops. In practice, Electron injects mixins into the client to skip unnecessary work (e.g. disabling unused render events) and use more efficient code paths in Meteor’s internals.  For example, it removes Meteor’s default 2D-rendering event when unused and substitutes optimized math and stream operations.  These tweaks reduce overhead in rendering and world tick processing, making the Meteor Client run leaner.

## Useful Links

* [Github Repository](https://github.com/RacoonDog/Electron)
* [Latest Download](/en/download/?RacoonDog/Electron){target="_blank"}

## Supported Version(s)

* minecraft_version=1.21.5
* minecraft_version=1.19.1 *(deleted)*
* As the README notes, Electron only supports the latest dev build of Meteor Client.

## Requirements

1. Minecraft
2. Meteor Client (latest dev build)
3. Fabric
4. Fabric API

## Key Features and Modules

Electron is essentially a collection of mixin-based performance modules. Its **core features/modules** include:

* **Render optimizations:**  Electron injects mixins into the HUD rendering pipeline to skip or cull unnecessary work.  For instance, it removes redundant `Render2DEvent` listeners in Meteor’s HUD, and provides *render culling* optimizations to skip off-screen rendering.  This reduces the GUI/rendering cost in Meteor Client.
* **Tick loop improvements:**  Several mixins optimize the world tick/update loop.  Electron includes a general *tick loop* optimization mixin (`mixin.tick`), and disables non-essential updates (e.g. disabling rainbow color animation when HUD isn’t active via `mixin.tick.colors`).  It also swaps Meteor’s `BlockIterator` for a faster version (`mixin.tick.blockiterator`). These changes cut down per-tick overhead.
* **Stream/math optimizations:**  The addon replaces certain Java Stream operations with simple loops for small lists (`mixin.stream`) and uses hardware FMA math instructions in key calculations (`mixin.math.fma`), shaving off CPU cycles.
* **Starscript optimizations:**  Meteor’s “Starscript” scripting system is accelerated by mixins (`mixin.starscript`, `mixin.starscript.raw`), which bypass some string-formatting overhead in the client’s script engine.
* **Developer/profiler support:**  Electron can enable optional dev tools for debugging (through `mixin.dev` and `mixin.dev.profiler`), which can be turned off in production mode.

In short, Electron bundles a suite of performance tweaks – from rendering and math to networking and scripting – all aimed at making Meteor Client run smoother and faster. The full list of mixin modules is documented in the repo’s README.

## Why Author is Trustworthy

* **Open Source Transparency**: The entire source code of Electron is public, modular, and well-documented. Anyone can review the code, see the mixins being injected, and verify that there is no malicious behavior or telemetry.
* **Reputation and Track RecordActive Developmen**: Aside from Electron, RacoonDog has contributed to other Meteor-related projects or mods such as MeteorEnemies. Their name is recognized within GitHub’s Minecraft modding ecosystem, particularly in advanced performance tooling and Meteor add-ons.
