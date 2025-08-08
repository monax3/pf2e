import fs from "fs-extra";
import Glob from "glob";
import path from "path";
import dts from "unplugin-dts/vite";
import typesPackageJSON from "../pf2e-types/package.json" with { type: "json" };
import tsconfig from "../tsconfig.json" with { type: "json" };

function getAliases(): [RegExp, string][] {
    const aliases: Record<string, string[]> = tsconfig.compilerOptions.paths;

    return Object.entries(aliases).map(([alias, paths]) =>
        [
            new RegExp(`['"]${alias.replaceAll(".", "\\.").replaceAll("*", "(.*?)")}['"]`, "g"),
            paths[0].replaceAll("*", "$1").replace("./src/", "./types/pf2e/"),
        ]
    );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function declarations() {
    return dts({
        include: ["./src/**/*", "./types/foundry/global-external.d.mts"],
        outDirs: [`./types/pf2e`],
        entryRoot: "src",
        copyDtsFiles: true,
        strictOutput: true,
        aliasesExclude: [/.*/],
        afterBuild,
    });
}

async function fixImports(files: string[]): Promise<void> {
    const aliases = getAliases();

    aliases.push([new RegExp(/['"][\./]*types\/foundry\/(.*?)['"]/g), "./types/foundry/$1"]);
    aliases.push([new RegExp(/['"][\./]*static\/lang\/en.json['"]/g), "./types/pf2e/en.json"]);

    const externals = new Set<string>();
    const externalRE = /(ex|im)port .*? from "(?!\.)(.*?)"/g;

    for (const file of files) {
        const dir = path.dirname(file);
        let data = await fs.promises.readFile(file, "utf-8");

        for (const [regex, into] of aliases) {
            data = data.replaceAll(regex, (_, repl: string) => {
                const relative = path.relative(dir, into.replace("$1", repl)).replaceAll(/\\/g, "/");
                return relative.startsWith(".") ? `"${relative}"` : `"./${relative}"`;
            });
        }

        data = data.replaceAll(/import (.*?) from ['"](.*?.json)['"];/g, 'import $1 from "$2" with { type: "json" };');
        data = data.replaceAll(/\.d(\.m?ts)/g, "$1");

        let m: RegExpExecArray | null;
        while ((m = externalRE.exec(data)) !== null) {
            externals.add(m[2]);
        }

        await fs.promises.writeFile(file, data, "utf-8");
    }

    for (const pkg of externals.values()) {
        const pkgs = typesPackageJSON.dependencies as Record<string, string>;
        if (!(pkgs[pkg] || pkgs[`@types/${pkg}`])) {
            throw new Error(`Missing type dependency "${pkg}"`);
        }
    }
}

async function buildExports(files: string[]): Promise<void> {
    const modules = new Map<string, string[]>();

    files.map((file) => {
        const from = path.relative("./types/pf2e/exports", file);
        const module = path.relative("./types/pf2e/module", file).split(path.sep)[0].replace(".d.ts", "");

        if (module !== ".." && from.indexOf("action-macros") === -1) {
            if (!modules.has(module))
                modules.set(module, []);

            modules.get(module)!.push(from.replaceAll(path.sep, "/"));
        }
    });

    await fs.promises.mkdir("./types/pf2e/exports", { recursive: true });

    for (const [module, from] of modules.entries()) {
        await fs.promises.writeFile(`./types/pf2e/exports/${module}.d.ts`, from.map((f) => `export type * from "${f}";`).join("\n"));
    }
}

async function afterBuild(): Promise<void> {
    await fs.promises.copyFile(
        "static/lang/en.json",
        "./types/pf2e/en.json",
    );

    const pf2eFiles = Glob.sync("./types/pf2e/**/*.{m,}ts");
    const foundryFiles = Glob.sync("./types/foundry/**/*.{m,}ts");

    await fixImports([...pf2eFiles, ...foundryFiles]);
    await buildExports(pf2eFiles);
}
