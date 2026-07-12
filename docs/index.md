---
layout: home

hero:
    name: 'VueGridle'
    image:
        src: ./logo.png
        alt: VueGridle
    tagline: 'Controlled grid primitives for Vue 3 dashboards.'
    actions:
        - theme: brand
          text: 'Get Started'
          link: /guide/getting-started
        - theme: alt
          text: 'Dashboard Example'
          link: /examples/dashboard
        - theme: alt
          text: 'View on GitHub'
          link: 'https://github.com/FrankieSR/VueGridle'

features:
    - icon: 🧭
      title: Controlled Layout
      details: Keep dashboard layout in your app state with v-model.
    - icon: 🖱️
      title: Pointer Interactions
      details: Drag and resize widgets with snapping or free movement.
    - icon: ⌨️
      title: Keyboard Accessible
      details: Focus items, move with arrows, and resize with Shift + arrows.
    - icon: ⚠️
      title: Collision Detection
      details: Pass layout once to Grid and react to item overlap events.
    - icon: 🛠️
      title: TypeScript
      details: Typed components and exported layout types for Vue 3 apps.
    - icon: 🎨
      title: Themeable
      details: Customize the grid with CSS variables and your own widget UI.
---

---

<div class="home-path">
    <a class="home-path-item" href="/VueGridle/guide/controlled-layout">
        <strong>Model your layout</strong>
        <span>Keep dashboard state in one controlled array and sync it with v-model.</span>
    </a>
    <a class="home-path-item" href="/VueGridle/examples/dashboard">
        <strong>Build a real dashboard</strong>
        <span>Use stable widget IDs, save on final events, and reset safely.</span>
    </a>
    <a class="home-path-item" href="/VueGridle/guide/accessibility">
        <strong>Support keyboard users</strong>
        <span>Focus widgets, move with arrows, and resize with Shift + arrows.</span>
    </a>
</div>

<div class="demo-container">
    <span class="demo-title">Live Demo</span>
    <div class="app-container-content">
        <SimpleGrid />
    </div>
</div>

<style>
.demo-container {
    margin: 7rem auto;
    position: relative;
    max-width: 1180px;
    padding: 0 24px;
}

.app-container-content {
    position: relative;
    z-index: 1;
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--vp-c-divider);
}

.demo-title {
    display: block;
    font-size: 1.4rem;
    font-weight: bold;
    text-align: right;
    padding: 0 0 16px;
}

.VPFeatures.VPHomeFeatures {
    position: relative;
    z-index: 10;
}

</style>
