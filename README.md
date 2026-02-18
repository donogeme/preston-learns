# Preston Learns 🚒🍎

A bilingual (English/Cantonese) interactive storybook for Preston (age 3).

## About Preston

- **Age:** 3 years old
- **Attention span:** ~5 minutes
- **Learning:** Spelling, numbers, simple math, Cantonese basics
- **Loves:** Talking to AI (Gemini), storytime

## Goals

- **Numbers & Math**: Counting, simple addition/subtraction
- **Spelling**: Basic word recognition
- **Cantonese**: Vocabulary for talking with 嫲嫲 (maa4 maa4) and 爺爺 (je4 je4)
- **Fun**: Trucks, fruits, stories — things he already loves
- **Printable**: Images designed as coloring pages too

## Art Style

- Cartoon, Bluey-inspired
- Flat, clean outlines (printable as coloring pages)
- Friendly, warm, age-appropriate

## Themes

### 🚗 Vehicles (favorites)
- Firetruck 🚒
- Garbage truck 🚛
- Excavator 🏗️
- Digger
- Police car 🚓
- Ice cream truck 🍦

### 🍎 Fruits (favorites)
- Apple 🍎
- Grapes 🍇
- Banana 🍌
- Blueberries 🫐
- Strawberry 🍓
- Watermelon 🍉

## Core Cantonese Vocabulary

### Family
| English | Cantonese | Jyutping |
|---------|-----------|----------|
| Grandma (paternal) | 嫲嫲 | maa4 maa4 |
| Grandpa (paternal) | 爺爺 | je4 je4 |

### Fruits
| English | Cantonese | Jyutping |
|---------|-----------|----------|
| Apple | 蘋果 | ping4 gwo2 |
| Grapes | 提子 | tai4 zi2 |
| Banana | 香蕉 | hoeng1 ziu1 |
| Blueberries | 藍莓 | laam4 mui2 |
| Strawberry | 士多啤梨 | si6 do1 be1 lei2 |
| Watermelon | 西瓜 | sai1 gwaa1 |

### Numbers (1-10)
| Number | Cantonese | Jyutping |
|--------|-----------|----------|
| 1 | 一 | jat1 |
| 2 | 二 | ji6 |
| 3 | 三 | saam1 |
| 4 | 四 | sei3 |
| 5 | 五 | ng5 |
| 6 | 六 | luk6 |
| 7 | 七 | cat1 |
| 8 | 八 | baat3 |
| 9 | 九 | gau2 |
| 10 | 十 | sap6 |

### Vehicles
| English | Cantonese | Jyutping |
|---------|-----------|----------|
| Firetruck | 消防車 | siu1 fong4 ce1 |
| Garbage truck | 垃圾車 | laap6 saap3 ce1 |
| Excavator | 挖泥機 | waat3 nai4 gei1 |
| Police car | 警車 | ging2 ce1 |
| Ice cream truck | 雪糕車 | syut3 gou1 ce1 |

### Useful Phrases
| English | Cantonese | Jyutping |
|---------|-----------|----------|
| Thank you | 多謝 | do1 ze6 |
| Thank you grandma | 多謝嫲嫲 | do1 ze6 maa4 maa4 |
| Thank you grandpa | 多謝爺爺 | do1 ze6 je4 je4 |
| I love you | 我愛你 | ngo5 oi3 nei5 |
| How many? | 幾多? | gei2 do1? |
| I want... | 我要... | ngo5 jiu3... |
| Good morning | 早晨 | zou2 san4 |
| Good boy! | 叻仔! | lek1 zai2! |

## Tech Stack

- **Frontend:** HTML/CSS/JS (simple, no framework needed)
- **Hosting:** GitHub Pages (free)
- **Audio:** 
  - Grandparent voice recordings (priority)
  - Google Cloud TTS for Cantonese (backup)
- **Images:** AI-generated Bluey-style illustrations, clean outlines for coloring

## Stories (v1)

### Story 1: "Preston Visits 嫲嫲's Fruit Stand"
Preston helps 嫲嫲 at her fruit stand. Learn fruit names in Cantonese, count fruits, say thank you.
- ~5 pages, ~5 minutes
- Vocabulary: 6 fruits + numbers 1-5 + 多謝嫲嫲

### Story 2: "Preston and the Firetruck" (later)
Preston helps count ladders, hoses, and rescued cats.

### Story 3: "Preston Helps the Garbage Truck" (later)
Addition/subtraction with trash bags on the route.

## Audio Assets Needed

### From Grandparents (authentic!)
- [ ] 嫲嫲 saying fruit names
- [ ] 嫲嫲 saying "叻仔!" (good boy!)
- [ ] 爺爺 saying numbers 1-10
- [ ] Both saying "我愛你 Preston"

### Generated (TTS backup)
- Numbers 1-10
- All fruit names
- All vehicle names
- Key phrases

## File Structure

```
preston-learns/
├── index.html          # Main entry
├── stories/
│   └── fruit-stand/
│       ├── index.html
│       ├── story.js
│       └── pages/
├── assets/
│   ├── images/
│   │   ├── color/      # Full color versions
│   │   └── outline/    # Coloring page versions
│   └── audio/
│       ├── grandparents/
│       └── tts/
├── css/
│   └── style.css
└── js/
    └── app.js
```

---

*Built with love for Preston to connect with 嫲嫲 and 爺爺* 🦀
