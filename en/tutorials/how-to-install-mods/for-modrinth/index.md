---
layout: doc

title: How to Install Minecraft Mods in Modrinth?
description: A simple step-by-step tutorial on how to install Minecraft mods in Modrinth.

head:
  - - meta
    - name: description
      content: A simple step-by-step tutorial on how to install Minecraft mods in Modrinth.
  - - meta
    - name: keywords
      content: how to?, modrinth, install mods in modrinth, how to install mods, install mods in minecraft, meteor client, meteor client addon, minecraft mods
---
## Introduction

Hey there, Minecraft fans! Ready to spice up your game with some awesome mods? Modrinth is one of the best places to find and install Minecraft mods, from new biomes and mobs to performance boosters and fancy graphics. Whether you're a total newbie or a seasoned modder, this guide will walk you through two easy ways to install mods using Modrinth: the super-convenient Modrinth Launcher or the good ol’ manual method. Let’s dive in and get those mods running!

## Before You Start

Before we jump into the steps, here’s what you’ll need:

* **Minecraft Java Edition** : Mods on Modrinth are for Java Edition, not Bedrock.
* **Modrinth Launcher** : Sure, this is a guide about it. Download it from Modrinth’s website.
* **A mod file** : Pick a **.jar** file from Modrinth’s mod library (e.g. Sodium).
* **Correct Minecraft version** : Make sure the version of mod matches your Minecraft version.
* **Fabric or Forge** : Most mods require one of these mod loaders. Check the mod’s page to see which one you need and install it first.

## Install Mods via Modrinth Launcher?

1. **Open Modrinth Launcher**: Fire up the Modrinth Launcher on your computer. If you don’t have it yet, grab it from Modrinth’s website and set it up. Once it’s open, pick the Minecraft profile (or “instance”) where you want to add mods. Profiles let you keep different mod setups separate, which is super handy!

![](/data/assets/20250608_162616_modrinth-1.png){width=50%}

2. **Access the Install Content Menu** : Look for the **Install Content** button (usually near the top). Click the **drop-down arrow** next to it to see more options.

![](/data/assets/20250608_162640_modrinth-2.png){width=50%}

3. **Add Mod from File** : From the drop-down menu, select **Add from file** . This lets you upload a mod file you’ve downloaded from Modrinth or another trusted source.

![](/data/assets/20250608_162837_modrinth-3.png){width=50%}

4. **Select and Install Your Mod**: A file explorer window will pop up. Navigate to where you saved your mod’s **.jar** file (e.g., **meteor-client-0.5.9.jar**), select it, and click **Open**.

   The launcher will handle the rest, installing the mod to your selected profile.
5. **Launch and Play!**: Once the mod is installed, hit the **Play** button in the launcher to start Minecraft with your new mod. If everything’s set up right, you’ll see the mod in action!

## Install Mods Manually

1. **Download Your Mod**: Head to Modrinth’s website and download the **.jar** file for your desired mod. Save it somewhere easy to find, like your Downloads folder.
2. **Open the Run Command**: On Windows, press <Tag icon="pi pi-microsoft" value="Windows"></Tag> + <Tag value="R"></Tag> to open the Run dialog box. Type `%appdata%/ModrinthApp/profiles` and hit **OK**. This takes you straight to the Modrinth profiles folder.
   ::: info
   **For Mac Users:** it’s *~/Library/Application Support/modrinth-app/profiles*.

   **For Linux Users**: it’s *~/.local/share/modrinth-app/profiles*.
   :::
3. **Locate Your Profile Folder**: In the profiles folder, find the folder for the Minecraft profile you want to mod. It’s usually named something like `Default` or `1.20.1-Fabric`. Double-click to open it.
4. **Find or Create the Mods Folder**: Inside the profile folder, look for a folder called **mods**. If it’s not there, create one by right-clicking, selecting <Tag severity="secondary" icon="pi pi-file" value="New"></Tag> > <Tag severity="secondary" icon="pi pi-folder" value="Folder"></Tag> , and naming it <Tag severity="secondary" icon="pi pi-folder" value="mods"></Tag>
5. **Paste the Mod File**: Copy your downloaded **.jar** file (<Tag value="Ctrl"></Tag> + <Tag value="C"></Tag> or right-click > Copy), then paste it (<Tag value="Ctrl"></Tag> + <Tag value="V"></Tag> or right-click > Paste) into the **mods** folder.
6. **Start Minecraft**: Open the Modrinth Launcher, select your profile, and click **Play** . Your mod should now be loaded in Minecraft!
