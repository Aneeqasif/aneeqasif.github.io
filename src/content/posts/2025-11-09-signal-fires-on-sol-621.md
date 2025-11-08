---
title: "Signal Fires on Sol 621"
published: 2025-11-09
description: "A Mars-stranded astronomer logs every survival trick—from data notebooks to gallery bursts—to prove our blog can do it all."
image: "/posts/right-hand-light.jpg"
tags: ["demo", "story", "mars"]
category: "Stories"
draft: false
duckdb: "/data/blog.duckdb"
---

I am Mirai Sen, last astronomer of the Asteria outpost. The storm that tore our ascent vehicle apart also shredded the bandwidth to Earth, so I am keeping this field log concise, sharp, and feature-loaded. Mission Control will read it someday—maybe you will too.

:::tip
Keep the log tidy, and even hostile planets listen. This notice doubles as a reminder that admonitions survive the dust just fine.
:::

## A Morning Playlist for Thin Air

<figure class="spotify-song" style="width: 80%; margin: 0 auto 20px auto; text-align: center;">
  <iframe style="border-radius: 12px;" src="https://open.spotify.com/embed/track/7dqZgF33NQwGaQSuh88Fq1?utm_source=generator" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  <figcaption style="color: #5a5a66; font-size: 0.9em; overflow-wrap: break-word; text-align: center; margin-top: 5px;">Looping a synthwave heartbeat while the habitat hums.</figcaption>
</figure>

### Systems Check

::github{repo="saicaca/fuwari"}

The station AI still mirrors GitHub over laser bounce. This card keeps the trending firmware repo one glance away.

:::warning
Sand eats optics. Before sunrise, wipe every lens or risk losing the stars—and our navigation fit.
:::

### Rapid Sol Plan

:::steps

1. **Warm the observatory dome**  
   `heliostat.align()` takes ten minutes; start it while coffee brews.
2. **Align return trajectory**  
   Feed the latest dust density curve into the guidance model.
3. **Broadcast home**  
   Queue the data bundles before the relay satellite dips below the horizon.

:::

### Whiteboard Fragments

```python title="guidance/window.py" ins={6-8} del={4}
def launch_window(sol_time):
    baseline = compute_baseline(sol_time)
-   return baseline - timedelta(minutes=17)
+   buffer = timedelta(minutes=9)
+   if sol_time.hour >= 18:
+       buffer += timedelta(minutes=6)
+   return baseline - buffer
```

Migrating launch math, one diff at a time. Expressive code keeps the annotations honest.

### Surface Sketches

The sky stayed clear for six minutes, long enough to photograph the crater rim and the stubborn rover.

:::gallery
/posts/ride.jpg
/posts/bike.jpg
/posts/coffee-cup.png
:::

:spoiler[The third frame hides a compression artifact that looks suspiciously like a rescue ship. I wish.]

### Telemetry Snapshots

```sql {pw}
SELECT customer AS habitat, amount AS power_budget
FROM main.orders
ORDER BY amount DESC
LIMIT 5;
```

Even the PondPilot console runs on my tablet. Shared DuckDB instance, shared hope.

### Contingency Table

| Supply              | Remaining | Notes                     |
| ------------------- | --------: | ------------------------- |
| Water gel packs     |        14 | Enough if filters hold    |
| Fuel cells          |         3 | Allocate for ascent only  |
| Spectrometer lenses |         2 | One chipped, one pristine |

### Nightfall Protocol

:::steps

1. **Seal the bulkhead** – double-check the red indicators.
2. **Power down sensors** – except the thermal sweep; the dunes hide surprises.
3. **Chart the stars** – triangulate the beacon once skies clear.

:::

> **Mission Log**: When navigation aligns and the ascent script sings, I will ride the dust all the way home. Until then, each entry is a breadcrumb across the Martian night.

Triggered flash markers only after a heading actually slips into the viewport—keeps the highlight fresh even if the scroll takes time. Time to sleep. Tomorrow I hunt for the missing comm dish.
