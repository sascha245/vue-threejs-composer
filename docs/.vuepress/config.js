module.exports = {
  title: "Vue Threejs Composer",
  description: "Compose beautiful 3D scenes in a flash",
  themeConfig: {
    search: true,
    lastUpdated: true,
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      {
        text: "Github",
        link: "https://github.com/sascha245/vue-threejs-composer"
      }
    ],
    sidebar: {
      "/guide/": [
        {
          title: "Guide",
          collapsable: false,
          children: [
            ["", "Introduction"],
            ["getting-started", "Getting started"],
            ["assets", "Assets"],
            ["scenes", "Scenes"],
            ["objects", "Objects"]
            // ["behaviours", "Behaviours"]
          ]
        }
      ]
    }
  }
};
