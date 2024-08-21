import { transformFile } from "@swc/core";
import { sync } from "glob";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";
const package_name = "Imaginary"
const version = "1.0.0";

const initialMS = Date.now();
console.log(`Started building ${package_name}@${version}!`);

const files = sync("src/**/*.{ts,js}");

Promise.all(
    files.map((file) =>
        transformFile(file, {
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: false,
                    decorators: true,
                },
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
                target: "es2020",
            },
            // "sourceMaps": true,
            module: {
                type: "es6",
            },
        })
            .then((output) => {
                const outPath = join("scripts", relative("src", file));
                const outDir = dirname(outPath);
                mkdirSync(outDir, { recursive: true });
                writeFileSync(outPath.replace(/\.ts$/, ".js"), output.code);
                if (output.map) {
                    writeFileSync(outPath.replace(/\.ts$/, ".js.map"), output.map);
                }
            })
    )
)
    .then(() => {
        console.log(`Bundling finished in ${Date.now() - initialMS} milliseconds!`);
    })
    .catch((error) => {
        console.error(error)
    });
