---
layout: home

hero:
  name: 'VueGridle'
  image:
    src: ./.vitepress/public/logo.png
    alt: VueGridle
  tagline: "Ultra-light (4.7kB gzip) grid library for Vue 3, powered by TypeScript & Composition API."
  actions:
    - theme: brand
      text: 'Get Started'
      link: /guide/getting-started
    - theme: alt
      text: 'View on GitHub'
      link: 'https://github.com/FrankieSR/VueGridle'

features:
  - icon: 🖱️
    title: Drag & Drop Grid Snapping
    details: Snap items to the grid for precise layouts.
  - icon: 🌍
    title: Free Movement Drag
    details: Enjoy optional free-form dragging without grid constraints.
  - icon: 📏
    title: Resizable
    details: Easily resize items with min/max limits for perfect control.
  - icon: ⚠️
    title: Collision Detection
    details: Get real-time alerts when items overlap.
  - icon: 🛠️
    title: TypeScript
    details: Strictly typed for cleaner code and fewer bugs.
  - icon: 🎨
    title: Customizable
    details: Tweak everything via props, events, and CSS variables.

---

---

<div class="demo-container">
    <span class="demo-title">Live Demo</span>
    <div class="app-container-shadow"></div>
    <div class="app-container-content">
        <SimpleGrid />
    </div>
</div>

<style>
.demo-container {
    border-radius: 16px;
    margin: 12px 0;
    margin: 7rem auto;
    position: relative;
    max-width: 1024px;
}

.app-container-shadow {
    position: absolute;
    top: 12%;
    left: 18px;
    width: 100%;
    height: calc(100% - 54px);
    background: #000;
    border-radius: 16px;
    z-index: 0;
}

.app-container-content {
  position: relative;
  z-index: 1;
  background: var(--vp-button-brand-bg);
  border-radius: 8px;
  padding: 20px;
  color: #fff;
}

.demo-title {
    display: block;
    font-size: 1.4rem;
    font-weight: bold;
    text-align: right;
    padding: 16px;
}

.VPFeatures.VPHomeFeatures {
    position: relative;
    z-index: 10;
}

.demo-bg {
    background-image: linear-gradient(-45deg, var(--vp-button-brand-bg) 30%, var(--vp-c-brand-1) 35%);
    filter: blur(130px);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    /* z-index: -1; */
}
</style>
