//require the manifest plugin and path
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./public/srcJs/index2.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [
        new WebpackPwaManifest({
            filename: "manifest.json",

            inject: false,

            fingerprints: false,

            name: "Budget Tracker",
            short_name: "Budget Tracker",
            theme_color: "#ffffff",
            background_color: "#ffffff",
            start_url: "/",
            display: "standalone",

            icons: [
                {
                    src: path.resolve(
                        __dirname,
                        "public/icons/icon-512x512.png"
                    ),
                    size: [72, 96, 128, 144, 152, 192, 384, 512]
                }
            ]
        })
    ]
}
module.exports = config;